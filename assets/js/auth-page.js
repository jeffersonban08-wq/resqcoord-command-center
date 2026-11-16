/* ============================================================
   ResQCoord — auth-page.js
   Shared logic for the responder/admin login and register pages.
   ============================================================ */
"use strict";

(async () => {
  const portal = document.body.dataset.portal || "user";
  const page = document.body.dataset.page || "login";
  const dashboard = "dashboard.html";
  const otherPortal = portal === "admin" ? "user" : "admin";

  const form = U.qs("#authForm");
  const errorBox = U.qs("#formError");
  const submitBtn = U.qs("#submitBtn");
  const submitLabel = submitBtn?.innerHTML;

  const setError = (message) => {
    if (!errorBox) return;
    errorBox.textContent = message || "";
    errorBox.style.display = message ? "block" : "none";
    if (message) errorBox.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const busy = (isBusy, label = "Working…") => {
    if (!submitBtn) return;
    submitBtn.disabled = isBusy;
    submitBtn.innerHTML = isBusy
      ? `<span class="pulse-dot" style="background:currentColor"></span> ${U.escapeHtml(label)}`
      : submitLabel;
  };

  /* Show a "already signed in" hint instead of forcing a redirect,
     so both portals can be demoed in the same browser. */
  try {
    await DB.ensureReady();
    const existing = await Auth.restore();
    const notice = U.qs("#sessionNotice");
    if (existing && notice) {
      notice.style.display = "block";
      notice.innerHTML = `
        <div class="row between wrap" style="gap:8px">
          <div class="small" style="color:var(--muted)">
            Signed in as <b style="color:var(--text)">${U.escapeHtml(existing.name)}</b>
            <span class="badge ${existing.role === "admin" ? "badge-purple" : "badge-green"}" style="margin-left:6px">${existing.role}</span>
          </div>
          <div class="row" style="gap:6px">
            <a class="btn btn-sm" href="${existing.role === "admin" ? "../admin/dashboard.html" : "../user/dashboard.html"}">Continue</a>
            <button type="button" class="btn btn-sm btn-ghost" id="sessionSignOut">Sign out</button>
          </div>
        </div>`;
      U.qs("#sessionSignOut")?.addEventListener("click", async () => {
        await Auth.logout();
        notice.style.display = "none";
        U.toast("Signed out. You can sign in with another account.", "info");
      });
    }
  } catch (err) {
    console.warn("[ResQCoord] Session check failed", err);
  }

  /* Password show/hide */
  U.qsa("[data-toggle-pw]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = U.qs(`#${btn.dataset.togglePw}`);
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.innerHTML = U.icon(showing ? "eye" : "eyeOff");
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });

  /* Password strength */
  const pw = U.qs("#password");
  const meter = U.qs("#strength");
  if (pw && meter) {
    pw.addEventListener("input", () => {
      const score = U.passwordScore(pw.value);
      meter.dataset.score = String(score);
      const label = U.qs("#strengthLabel");
      if (label) {
        label.textContent = pw.value
          ? ["Too weak", "Weak", "Fair", "Good", "Strong"][score]
          : "At least 8 characters with letters and a number";
      }
    });
  }

  /* Demo credential fill */
  U.qsa("[data-fill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.fill;
      const creds = DB.DEMO[kind];
      if (!creds) return;
      const email = U.qs("#email");
      const password = U.qs("#password");
      if (email) email.value = creds.email;
      if (password) password.value = creds.password;
      setError("");
      U.toast("Demo credentials filled in. Press sign in.", "info");
    });
  });

  /* Forgot password informational modal */
  U.qs("#forgotLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    U.modal({
      title: "Password recovery",
      subtitle: "Demo build",
      body: `<p style="color:var(--muted);font-size:13px;line-height:1.7">
        Password reset email delivery is not connected in this local build. Accounts and hashes live in
        IndexedDB on this device only. For the demo, use the seeded accounts in the panel below,
        or ask an administrator to create a new account from <b>User Management</b>.
      </p>`,
      footer: `<button class="btn btn-primary" data-close>Got it</button>`,
    });
  });

  /* Populate team picker on responder registration */
  if (page === "register" && portal === "user") {
    const select = U.qs("#teamId");
    if (select) {
      try {
        const teams = await DB.getAll("teams");
        select.innerHTML =
          `<option value="">Unassigned · assign me later</option>` +
          teams
            .map(
              (team) =>
                `<option value="${U.escapeHtml(team.id)}">${U.escapeHtml(team.name)} · ${team.members} personnel</option>`
            )
            .join("");
        const alpha = teams.find((t) => t.id === "team_alpha");
        if (alpha && !select.value) select.value = alpha.id;
      } catch (err) {
        console.warn("[ResQCoord] Team list unavailable", err);
      }
    }
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(form).entries());

    if (page === "login") {
      if (!data.email || !data.password) {
        setError("Enter your email and password.");
        return;
      }
      busy(true, "Signing in…");
      try {
        const result = await Auth.login(data.email, data.password, portal);
        if (!result.ok) {
          setError(result.error);
          busy(false);
          return;
        }
        U.toast(`Welcome back, ${result.user.name.split(" ")[0]}.`, {
          title: "Secure session established",
          type: "success",
        });
        setTimeout(() => location.replace(dashboard), 420);
      } catch (err) {
        console.error(err);
        setError("Could not sign in. Check the browser console for details.");
        busy(false);
      }
      return;
    }

    /* Registration */
    if (!data.name || data.name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }
    if (!data.email || !Auth.emailOk(data.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!data.password || data.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (data.password !== data.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (portal === "admin" && !data.adminCode) {
      setError("Enter the admin access code. Demo code: RESQ-ADMIN-2026");
      return;
    }

    busy(true, "Creating account…");
    try {
      const result = await Auth.register(data, portal);
      if (!result.ok) {
        setError(result.error);
        busy(false, "Create account");
        return;
      }
      U.toast(`Account created for ${result.user.name}.`, {
        title: "Welcome to ResQCoord",
        type: "success",
      });
      setTimeout(() => location.replace(dashboard), 450);
    } catch (err) {
      console.error(err);
      setError("Could not create the account. Check the browser console for details.");
      busy(false);
    }
  });

  /* Keep link targets honest */
  const portalSwitch = U.qs(`.portal-switch a[href*="${otherPortal}"]`);
  if (portalSwitch) portalSwitch.removeAttribute("aria-disabled");
})();
