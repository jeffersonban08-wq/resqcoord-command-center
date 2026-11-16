/* ============================================================
   ResQCoord — auth.js
   Registration, login, sessions and role-based route guards.
   ============================================================ */
"use strict";

const Auth = (() => {
  const SESSION_KEY = "resqcoord.session";
  const SESSION_HOURS = 12;
  let currentUser = null;
  let currentToken = null;

  const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const audit = async (actor, action, detail) => {
    await DB.put("audit", {
      id: U.randomId("aud"),
      ts: Date.now(),
      actorId: actor?.id || "system",
      actorName: actor?.name || "System",
      action,
      detail,
    });
  };

  const cleanupSession = () => {
    localStorage.removeItem(SESSION_KEY);
    currentUser = null;
    currentToken = null;
  };

  const restore = async () => {
    await DB.ensureReady();
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return null;
    const session = await DB.get("sessions", token);
    if (!session) {
      cleanupSession();
      return null;
    }
    if (session.expiresAt < Date.now()) {
      await DB.del("sessions", token);
      cleanupSession();
      return null;
    }
    const user = await DB.get("users", session.userId);
    if (!user || user.status !== "active") {
      cleanupSession();
      return null;
    }
    currentToken = token;
    currentUser = user;
    return user;
  };

  const createSession = async (user) => {
    const token = U.randomId("ses") + Math.random().toString(36).slice(2, 10);
    const session = {
      token,
      userId: user.id,
      role: user.role,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_HOURS * 3600 * 1000,
    };
    await DB.put("sessions", session);
    localStorage.setItem(SESSION_KEY, token);
    currentToken = token;
    currentUser = user;
    return session;
  };

  const login = async (email, password, portal = "user") => {
    await DB.ensureReady();
    email = String(email || "").trim().toLowerCase();
    if (!email || !password) return { ok: false, error: "Enter your email and password." };
    if (!emailOk(email)) return { ok: false, error: "That email address doesn't look right." };

    const users = await DB.getAll("users");
    const user = users.find((row) => row.email.toLowerCase() === email);
    if (!user) return { ok: false, error: "No account found for that email." };
    if (user.status !== "active") return { ok: false, error: "This account is suspended. Contact the command center." };

    const valid = await U.verifyPassword(password, user);
    if (!valid) return { ok: false, error: "Incorrect password. Please try again." };

    if (portal === "admin" && user.role !== "admin") {
      return { ok: false, error: "This is the admin portal. Use the responder portal to sign in." };
    }
    if (portal === "user" && user.role === "admin") {
      return { ok: false, error: "Administrators must sign in through the admin portal." };
    }

    if (currentToken) await DB.del("sessions", currentToken).catch(() => {});
    await createSession(user);
    user.lastLogin = Date.now();
    await DB.put("users", user);
    await audit(user, "LOGIN", `${portal === "admin" ? "Admin" : "Responder"} signed in`);
    return { ok: true, user };
  };

  const register = async (data, portal = "user") => {
    await DB.ensureReady();
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "");
    const confirm = String(data.confirm || "");
    const org = String(data.org || "").trim();
    const phone = String(data.phone || "").trim();
    const teamId = data.teamId || "";

    if (name.length < 2) return { ok: false, error: "Enter your full name." };
    if (!emailOk(email)) return { ok: false, error: "Enter a valid email address." };
    if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return { ok: false, error: "Password must include letters and at least one number." };
    }
    if (password !== confirm) return { ok: false, error: "Passwords do not match." };

    if (portal === "admin") {
      if (!data.adminCode) return { ok: false, error: "Enter the admin access code." };
      if (String(data.adminCode).trim().toUpperCase() !== DB.DEMO.adminCode) {
        return { ok: false, error: "Invalid admin access code. Ask the duty commander for the current code." };
      }
    }

    const users = await DB.getAll("users");
    if (users.some((row) => row.email.toLowerCase() === email)) {
      return { ok: false, error: "An account with that email already exists." };
    }

    let team = null;
    if (portal === "user" && teamId) team = await DB.get("teams", teamId);

    const id = U.randomId(portal === "admin" ? "u" : "u");
    const { salt, hash, algo } = await U.hashPassword(password);
    const now = Date.now();
    const user = {
      id,
      name,
      email,
      role: portal === "admin" ? "admin" : "user",
      title:
        portal === "admin"
          ? data.title || "Administrator · Duty Commander"
          : data.title || `Field Responder · ${team?.name || "Unassigned"}`,
      org: org || "Provincial Rescue Coordination Office",
      phone,
      teamId: portal === "admin" ? "team_command" : teamId || null,
      team: portal === "admin" ? "Command Center" : team?.name || "Unassigned",
      status: "active",
      responderId:
        portal === "admin"
          ? `ADM-${String(users.filter((u) => u.role === "admin").length + 1).padStart(4, "0")}`
          : `FR-${String(200 + users.filter((u) => u.role === "user").length + 1).padStart(4, "0")}`,
      cert: data.cert || "",
      salt,
      hash,
      algo,
      createdAt: now,
      lastLogin: now,
    };

    await DB.put("users", user);
    await DB.put("settings", {
      userId: id,
      shareLocation: true,
      backgroundTracking: true,
      checkinMinutes: 15,
      notifications: { sos: true, checkin: true, messages: true, weather: true },
      createdAt: now,
    });

    if (currentToken) await DB.del("sessions", currentToken).catch(() => {});
    await createSession(user);
    await audit(user, "REGISTER", `${portal === "admin" ? "Admin" : "Responder"} account created`);
    return { ok: true, user };
  };

  const logout = async (redirectTo = null) => {
    if (currentToken) {
      await DB.del("sessions", currentToken).catch(() => {});
    }
    if (currentUser) await audit(currentUser, "LOGOUT", "Signed out of the command center");
    cleanupSession();
    if (redirectTo) location.replace(redirectTo);
  };

  const guard = async (portal) => {
    const user = await restore();
    if (!user) {
      location.replace("login.html");
      return null;
    }
    if (user.role !== portal) {
      location.replace(portal === "admin" ? "../user/dashboard.html" : "../admin/dashboard.html");
      return null;
    }
    return user;
  };

  const refresh = async () => {
    if (!currentUser) return null;
    const row = await DB.get("users", currentUser.id);
    if (row) currentUser = row;
    return currentUser;
  };

  const getTeam = async () => {
    if (!currentUser?.teamId) return null;
    return DB.get("teams", currentUser.teamId);
  };

  const updateProfile = async (patch) => {
    if (!currentUser) return { ok: false, error: "Not signed in." };
    const updated = { ...currentUser, ...patch, id: currentUser.id, role: currentUser.role, email: currentUser.email };
    await DB.put("users", updated);
    currentUser = updated;
    await audit(updated, "PROFILE", "Profile details updated");
    return { ok: true, user: updated };
  };

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (!currentUser) return { ok: false, error: "Not signed in." };
    if (!(await U.verifyPassword(currentPassword, currentUser))) {
      return { ok: false, error: "Current password is incorrect." };
    }
    if (newPassword.length < 8) return { ok: false, error: "New password must be at least 8 characters." };
    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return { ok: false, error: "New password must include letters and a number." };
    }
    if (newPassword !== confirmPassword) return { ok: false, error: "New passwords do not match." };
    const { salt, hash, algo } = await U.hashPassword(newPassword);
    const updated = { ...currentUser, salt, hash, algo, passwordChangedAt: Date.now() };
    await DB.put("users", updated);
    currentUser = updated;
    await audit(updated, "SECURITY", "Password changed");
    return { ok: true };
  };

  return {
    restore, login, register, logout, guard, refresh, getTeam, updateProfile,
    changePassword, audit,
    get user() { return currentUser; },
    get token() { return currentToken; },
    emailOk,
  };
})();
