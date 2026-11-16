/* ============================================================
   ResQCoord — db.js
   Local database layer. Uses IndexedDB when available, with a
   localStorage fallback so the demo also runs from file://.
   Seeds demo accounts, teams, missions, incidents and messages.
   ============================================================ */
"use strict";

const DB = (() => {
  const NAME = "resqcoord";
  const VERSION = 1;
  const LS_KEY = "resqcoord.fallback.v1";

  const STORES = {
    users: { keyPath: "id", indexes: { email: "email", role: "role" } },
    sessions: { keyPath: "token", indexes: { userId: "userId" } },
    missions: { keyPath: "id", indexes: { status: "status" } },
    teams: { keyPath: "id", indexes: { status: "status" } },
    positions: { keyPath: "id", indexes: { teamId: "teamId", ts: "ts" } },
    incidents: { keyPath: "id", indexes: { status: "status", severity: "severity" } },
    messages: { keyPath: "id", indexes: { channel: "channel", ts: "ts" } },
    checkins: { keyPath: "id", indexes: { userId: "userId" } },
    audit: { keyPath: "id", indexes: { ts: "ts" } },
    settings: { keyPath: "userId" },
  };

  const DEMO = {
    admin: { email: "admin@resqcoord.ph", password: "Admin@123" },
    user: { email: "j.reyes@resqcoord.ph", password: "User@123" },
    user2: { email: "m.santos@resqcoord.ph", password: "User@123" },
    adminCode: "RESQ-ADMIN-2026",
  };

  let db = null;
  let mode = "idb";
  let readyPromise = null;

  const hasIDB = () => {
    try {
      return typeof indexedDB !== "undefined" && indexedDB !== null;
    } catch {
      return false;
    }
  };

  /* ---------------- IndexedDB backend ---------------- */
  const openIdb = () =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open(NAME, VERSION);
      req.onupgradeneeded = () => {
        const idb = req.result;
        Object.entries(STORES).forEach(([name, def]) => {
          if (idb.objectStoreNames.contains(name)) return;
          const store = idb.createObjectStore(name, { keyPath: def.keyPath });
          Object.entries(def.indexes || {}).forEach(([idx, field]) => {
            store.createIndex(idx, field, { unique: idx === "email" });
          });
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("IndexedDB failed to open"));
      req.onblocked = () => reject(new Error("IndexedDB is blocked by another tab"));
    });

  const idbTx = (store, modeName = "readonly") => {
    const tx = db.transaction(store, modeName);
    return { tx, os: tx.objectStore(store) };
  };

  const idbRequest = (request) =>
    new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

  /* ---------------- localStorage fallback ---------------- */
  const lsRead = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      Object.keys(STORES).forEach((k) => {
        if (!Array.isArray(parsed[k])) parsed[k] = [];
      });
      return parsed;
    } catch {
      return Object.fromEntries(Object.keys(STORES).map((k) => [k, []]));
    }
  };

  const lsWrite = (data) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("[ResQCoord] localStorage write failed", err);
    }
  };

  /* ---------------- Public API ---------------- */
  const getAll = async (store) => {
    if (mode === "idb") {
      const { os } = idbTx(store);
      return (await idbRequest(os.getAll())) || [];
    }
    return [...lsRead()[store]];
  };

  const get = async (store, key) => {
    if (mode === "idb") {
      const { os } = idbTx(store);
      return (await idbRequest(os.get(key))) ?? null;
    }
    return lsRead()[store].find((row) => row[STORES[store].keyPath] === key) ?? null;
  };

  const put = async (store, value) => {
    if (mode === "idb") {
      const { tx, os } = idbTx(store, "readwrite");
      os.put(value);
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
      return value;
    }
    const data = lsRead();
    const kp = STORES[store].keyPath;
    const idx = data[store].findIndex((row) => row[kp] === value[kp]);
    if (idx >= 0) data[store][idx] = value;
    else data[store].push(value);
    lsWrite(data);
    return value;
  };

  const add = async (store, value) => put(store, value);

  const del = async (store, key) => {
    if (mode === "idb") {
      const { tx, os } = idbTx(store, "readwrite");
      os.delete(key);
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      return true;
    }
    const data = lsRead();
    const kp = STORES[store].keyPath;
    data[store] = data[store].filter((row) => row[kp] !== key);
    lsWrite(data);
    return true;
  };

  const clear = async (store) => {
    if (mode === "idb") {
      const { tx, os } = idbTx(store, "readwrite");
      os.clear();
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      return true;
    }
    const data = lsRead();
    data[store] = [];
    lsWrite(data);
    return true;
  };

  const count = async (store) => (await getAll(store)).length;

  const byIndex = async (store, index, value) => {
    if (mode === "idb") {
      const { os } = idbTx(store);
      return (await idbRequest(os.index(index).getAll(value))) || [];
    }
    const field = STORES[store].indexes?.[index] || index;
    return lsRead()[store].filter((row) => row[field] === value);
  };

  /* ---------------- Demo seed ---------------- */
  const minutesAgo = (n) => Date.now() - n * 60000;

  async function seed() {
    if ((await count("users")) > 0) return;

    const specs = [
      {
        id: "u_admin",
        name: "Carl R. Miller",
        email: DEMO.admin.email,
        password: DEMO.admin.password,
        role: "admin",
        title: "Administrator · Duty Commander",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_command",
        team: "Command Center",
        phone: "+63 917 555 0100",
        status: "active",
        responderId: "ADM-0001",
        createdAt: minutesAgo(60 * 24 * 90),
        lastLogin: minutesAgo(12),
      },
      {
        id: "u_reyes",
        name: "J. Reyes",
        email: DEMO.user.email,
        password: DEMO.user.password,
        role: "user",
        title: "Field Responder · Team Alpha",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_alpha",
        team: "Team Alpha",
        phone: "+63 917 555 4821",
        status: "active",
        responderId: "FR-0214",
        cert: "Wilderness First Responder",
        createdAt: minutesAgo(60 * 24 * 40),
        lastLogin: minutesAgo(3),
      },
      {
        id: "u_santos",
        name: "Lt. Mara Santos",
        email: DEMO.user2.email,
        password: DEMO.user.password,
        role: "user",
        title: "Mission Lead · Team Alpha",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_alpha",
        team: "Team Alpha",
        phone: "+63 917 555 3390",
        status: "active",
        responderId: "FR-0101",
        cert: "Incident Command / WFR",
        createdAt: minutesAgo(60 * 24 * 120),
        lastLogin: minutesAgo(22),
      },
      {
        id: "u_delacruz",
        name: "Cpl. Dela Cruz",
        email: "d.delacruz@resqcoord.ph",
        password: DEMO.user.password,
        role: "user",
        title: "Field Responder · Team Bravo",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_bravo",
        team: "Team Bravo",
        phone: "+63 917 555 7712",
        status: "active",
        responderId: "FR-0188",
        cert: "Rope Rescue Technician",
        createdAt: minutesAgo(60 * 24 * 30),
        lastLogin: minutesAgo(41),
      },
      {
        id: "u_navarro",
        name: "A. Navarro",
        email: "a.navarro@resqcoord.ph",
        password: DEMO.user.password,
        role: "user",
        title: "Field Responder · Team Charlie",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_charlie",
        team: "Team Charlie",
        phone: "+63 917 555 6204",
        status: "active",
        responderId: "FR-0233",
        cert: "Mountain Rescue",
        createdAt: minutesAgo(60 * 24 * 18),
        lastLogin: minutesAgo(88),
      },
    ];

    for (const spec of specs) {
      const { password, ...rest } = spec;
      const { salt, hash, algo } = await U.hashPassword(password);
      await put("users", { ...rest, salt, hash, algo });
      await put("settings", {
        userId: spec.id,
        shareLocation: true,
        backgroundTracking: true,
        checkinMinutes: 15,
        notifications: { sos: true, checkin: true, messages: true, weather: true },
        createdAt: Date.now(),
      });
    }

    const patrolAlpha = [
      [16.3998, 120.5965], [16.4032, 120.5989], [16.4068, 120.6012],
      [16.4103, 120.6041], [16.4072, 120.6068], [16.4030, 120.6080],
      [16.4001, 120.6033], [16.3979, 120.5999],
    ];
    const patrolBravo = [
      [16.4010, 120.6070], [16.4062, 120.6088], [16.4108, 120.6072],
      [16.4088, 120.6034], [16.4040, 120.6046],
    ];
    const patrolCharlie = [
      [16.3968, 120.6015], [16.3948, 120.6042], [16.3972, 120.6064],
      [16.3992, 120.6032],
    ];
    const patrolRescue = [
      [16.4008, 120.5940], [16.4040, 120.5960], [16.4075, 120.5985],
      [16.4109, 120.6007], [16.4075, 120.5985], [16.4040, 120.5960],
    ];
    const patrolAir = [
      [16.3990, 120.5902], [16.4005, 120.5928], [16.3982, 120.5946],
      [16.3968, 120.5918],
    ];

    const teams = [
      {
        id: "team_alpha", name: "Team Alpha", short: "TA", kind: "Ground",
        status: "onsite", members: 12, lead: "Lt. Mara Santos", missionId: "msn_014",
        lat: 16.4068, lng: 120.6012, heading: 28, speed: 2.4, battery: 78,
        patrol: patrolAlpha, patrolIdx: 3, lastCheckin: minutesAgo(9),
        lastSeen: minutesAgo(1), sector: "Sector A", note: "Ridge approach",
      },
      {
        id: "team_bravo", name: "Team Bravo", short: "TB", kind: "Ground",
        status: "enroute", members: 9, lead: "Sgt. R. Ocampo", missionId: "msn_013",
        lat: 16.4062, lng: 120.6088, heading: 315, speed: 3.8, battery: 64,
        patrol: patrolBravo, patrolIdx: 2, lastCheckin: minutesAgo(4),
        lastSeen: minutesAgo(1), sector: "Sector B", note: "North spur",
      },
      {
        id: "team_charlie", name: "Team Charlie", short: "TC", kind: "Ground",
        status: "onsite", members: 8, lead: "A. Navarro", missionId: "msn_014",
        lat: 16.3972, lng: 120.6064, heading: 190, speed: 1.1, battery: 41,
        patrol: patrolCharlie, patrolIdx: 3, lastCheckin: minutesAgo(31),
        lastSeen: minutesAgo(2), sector: "Sector C", note: "Check-in overdue",
      },
      {
        id: "team_rescue12", name: "Rescue 12", short: "R12", kind: "Ground",
        status: "onsite", members: 6, lead: "F. Aquino", missionId: "msn_014",
        lat: 16.4040, lng: 120.5960, heading: 64, speed: 0, battery: 88,
        patrol: patrolRescue, patrolIdx: 1, lastCheckin: minutesAgo(6),
        lastSeen: minutesAgo(1), sector: "North spur", note: "Staging at Km 6",
      },
      {
        id: "team_air2", name: "Air Unit 2", short: "AU2", kind: "Air",
        status: "standby", members: 4, lead: "Capt. L. Bautista", missionId: null,
        lat: 16.3990, lng: 120.5902, heading: 0, speed: 0, battery: 92,
        patrol: patrolAir, patrolIdx: 0, lastCheckin: minutesAgo(14),
        lastSeen: minutesAgo(1), sector: "Helipad H2", note: "Medevac standby",
      },
    ];

    for (const team of teams) {
      await put("teams", { ...team, updatedAt: Date.now(), tracking: true });
      // Seed a short position trail behind each team.
      for (let i = 4; i >= 1; i--) {
        const base = team.patrol[Math.max(0, team.patrolIdx - i)] || team.patrol[0];
        await put("positions", {
          id: U.randomId("pos"),
          teamId: team.id,
          lat: base[0] + (Math.random() - 0.5) * 0.0006,
          lng: base[1] + (Math.random() - 0.5) * 0.0006,
          ts: minutesAgo(i * 3),
          speed: team.speed,
        });
      }
    }

    const checkpoints = [
      { name: "Trailhead", detail: "Km 0", time: "12:10", done: true },
      { name: "Creek crossing", detail: "Km 4", time: "12:52", done: true },
      { name: "North spur saddle", detail: "Km 6", time: "13:48", done: true },
      { name: "Ridge marker", detail: "Km 7.5", time: "ETA 14:50", done: false, next: true },
      { name: "Helipad H2", detail: "Evac point", time: "Pending", done: false },
    ];

    const missions = [
      {
        id: "msn_014", code: "MSN-2026-014", name: "Mt. Lantin Rescue",
        status: "In progress", priority: "High", type: "Mountain SAR",
        sector: "N-2", lead: "Lt. Mara Santos", teamId: "team_alpha",
        progress: 70, lat: 16.4103, lng: 120.6041,
        description: "Search and extraction of two lost hikers last seen on the north spur trailhead. Team Alpha is clearing grid N-2 with drone support.",
        subjects: "2 lost hikers (1 male, 1 female)",
        lastSeen: "North spur trailhead · 09:40",
        weather: "Light rain · visibility 300 m · wind 18 km/h",
        hazards: "Rockfall in Sector C · wet slopes",
        startedAt: new Date(new Date().setHours(11, 20, 0, 0)).getTime(),
        createdAt: minutesAgo(192), updatedAt: minutesAgo(4),
        checkpoints, timeline: [
          { t: "11:20", text: "Mission dispatched" },
          { t: "12:05", text: "Team Alpha on site" },
          { t: "13:40", text: "Drone scan started in sector N-2" },
          { t: "14:21", text: "2 heat signatures detected" },
          { t: "14:28", text: "Advance to ridge marker" },
        ],
        createdBy: "u_admin",
      },
      {
        id: "msn_013", code: "MSN-2026-013", name: "Kennon Road Landslide",
        status: "Monitoring", priority: "Medium", type: "Landslide response",
        sector: "Sector B", lead: "Sgt. R. Ocampo", teamId: "team_bravo",
        progress: 35, lat: 16.4108, lng: 120.6072,
        description: "Slope assessment and clearing crew protection along the Kennon corridor after overnight rainfall.",
        subjects: "Road corridor · 2 barangays",
        lastSeen: "Km 7 Kennon Road",
        weather: "Overcast · light drizzle",
        hazards: "Loose debris · unstable cut slope",
        startedAt: minutesAgo(320), createdAt: minutesAgo(330), updatedAt: minutesAgo(22),
        checkpoints: [
          { name: "Staging area", detail: "Km 5", time: "09:10", done: true },
          { name: "Slope assessment", detail: "Km 7", time: "10:05", done: true },
          { name: "Clearing operations", detail: "Km 7.4", time: "Ongoing", done: false, next: true },
          { name: "Road reopen", detail: "All lanes", time: "Pending", done: false },
        ],
        timeline: [
          { t: "09:10", text: "Bravo deployed to staging area" },
          { t: "10:05", text: "Slope assessment completed" },
          { t: "11:40", text: "Partial lane closure established" },
        ],
        createdBy: "u_admin",
      },
      {
        id: "msn_012", code: "MSN-2026-012", name: "Missing Hiker · Camp 3",
        status: "Completed", priority: "Low", type: "Search",
        sector: "Sector C", lead: "A. Navarro", teamId: "team_charlie",
        progress: 100, lat: 16.3948, lng: 120.6042,
        description: "Hiker reported overdue at Camp 3. Located safe at the creek junction and escorted to the trailhead.",
        subjects: "1 hiker",
        lastSeen: "Camp 3 junction",
        weather: "Clear",
        hazards: "None",
        startedAt: minutesAgo(1440), createdAt: minutesAgo(1500), updatedAt: minutesAgo(900),
        checkpoints: [{ name: "Camp 3", detail: "Search start", time: "08:20", done: true }],
        timeline: [
          { t: "08:20", text: "Search initiated" },
          { t: "09:55", text: "Subject located safe" },
        ],
        createdBy: "u_admin",
      },
    ];

    for (const mission of missions) await put("missions", mission);

    const incidents = [
      {
        id: "inc_001", code: "INC-0412", type: "Hazard", severity: "High",
        title: "Rockfall near Sector C", status: "escalated",
        description: "Active rockfall at the gully crossing below Km 6. Trail partially blocked. Recommend rerouting via the upper saddle.",
        lat: 16.3972, lng: 120.6015, sector: "Sector C",
        reporterId: "u_delacruz", reporterName: "Cpl. Dela Cruz", teamId: "team_bravo",
        ts: minutesAgo(87), updatedAt: minutesAgo(70), assignedTo: "Team Bravo",
      },
      {
        id: "inc_002", code: "INC-0411", type: "Equipment", severity: "Medium",
        title: "Radio battery low", status: "acknowledged",
        description: "Spare battery depleted on the primary handheld. Switching to backup channel and conserving power.",
        lat: 16.4068, lng: 120.6012, sector: "Sector A",
        reporterId: "u_reyes", reporterName: "J. Reyes", teamId: "team_alpha",
        ts: minutesAgo(61), updatedAt: minutesAgo(40),
      },
      {
        id: "inc_003", code: "INC-0410", type: "Hazard", severity: "Low",
        title: "Slippery trail section", status: "acknowledged",
        description: "Wet clay on the switchbacks above the creek. No injuries. Route marked with flagging tape.",
        lat: 16.4010, lng: 120.6005, sector: "Sector A",
        reporterId: "u_reyes", reporterName: "J. Reyes", teamId: "team_alpha",
        ts: minutesAgo(116), updatedAt: minutesAgo(100),
      },
      {
        id: "inc_004", code: "INC-0413", type: "Injured person", severity: "Critical",
        title: "Hiker with leg injury at gully", status: "open",
        description: "One hiker reported with a suspected lower-leg fracture near the gully crossing. Conscious and stable. Requesting medic and evacuation route.",
        lat: 16.4008, lng: 120.5996, sector: "Sector A · Km 6.2",
        reporterId: "u_santos", reporterName: "Lt. Mara Santos", teamId: "team_alpha",
        ts: minutesAgo(12), updatedAt: minutesAgo(12),
      },
    ];

    for (const incident of incidents) await put("incidents", incident);

    const messages = [
      {
        id: "msg_001", channel: "command", senderId: "u_admin", senderName: "Command Center",
        text: "Team Alpha, advance to ridge marker. Report on arrival.", ts: minutesAgo(8), readBy: [],
      },
      {
        id: "msg_002", channel: "command", senderId: "u_admin", senderName: "Command Center",
        text: "Drone scan found 2 heat signatures in grid N-2. Coordinates sent to your device.", ts: minutesAgo(14), readBy: ["u_reyes"],
      },
      {
        id: "msg_003", channel: "command", senderId: "u_admin", senderName: "Command Center",
        text: "Rockfall near Sector C — route flagged. Use the upper saddle detour.", ts: minutesAgo(22), readBy: ["u_reyes", "u_santos"],
      },
      {
        id: "msg_004", channel: "team:team_alpha", senderId: "u_delacruz", senderName: "Cpl. Dela Cruz",
        text: "Copy, moving out.", ts: minutesAgo(6), readBy: [],
      },
      {
        id: "msg_005", channel: "team:team_alpha", senderId: "u_santos", senderName: "Lt. Mara Santos",
        text: "Keep radio checks every 15 minutes. Weather is closing in.", ts: minutesAgo(28), readBy: [],
      },
      {
        id: "msg_006", channel: "command", senderId: "u_admin", senderName: "Command Center",
        text: "Check-in window opens 14:45. Use the Check in action when you reach the ridge.", ts: minutesAgo(35), readBy: [],
      },
      {
        id: "msg_007", channel: "team:team_alpha", senderId: "u_reyes", senderName: "J. Reyes",
        text: "Copy. Team Alpha holding at the saddle. Visual on trail marker 14.", ts: minutesAgo(18), readBy: ["u_santos"],
      },
    ];

    for (const message of messages) await put("messages", message);

    await put("checkins", {
      id: U.randomId("chk"), userId: "u_reyes", teamId: "team_alpha",
      ts: minutesAgo(35), lat: 16.4068, lng: 120.6012, note: "All clear at the saddle",
    });
    await put("checkins", {
      id: U.randomId("chk"), userId: "u_santos", teamId: "team_alpha",
      ts: minutesAgo(64), lat: 16.4032, lng: 120.5989, note: "Moving to ridge",
    });

    await put("audit", {
      id: U.randomId("aud"), ts: minutesAgo(8), actorId: "u_admin",
      actorName: "Carl R. Miller", action: "BROADCAST",
      detail: "Broadcast to all teams: advance to ridge marker",
    });
    await put("audit", {
      id: U.randomId("aud"), ts: minutesAgo(12), actorId: "u_santos",
      actorName: "Lt. Mara Santos", action: "INCIDENT",
      detail: "Reported critical incident INC-0413",
    });
  }

  const ensureReady = async () => {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      if (hasIDB()) {
        try {
          db = await openIdb();
          mode = "idb";
        } catch (err) {
          console.warn("[ResQCoord] IndexedDB unavailable, using localStorage fallback.", err);
          mode = "local";
        }
      } else {
        mode = "local";
      }
      await seed();
      // Remove expired sessions on boot.
      const sessions = await getAll("sessions");
      for (const session of sessions) {
        if (session.expiresAt < Date.now()) await del("sessions", session.token);
      }
      console.info(`[ResQCoord] Database ready (${mode}).`);
      return { mode };
    })();
    return readyPromise;
  };

  const reset = async () => {
    // Preserve signed-in sessions so a demo reset does not kick the
    // operator out; seeded user ids are stable, and restore() drops any
    // session whose account no longer exists or is suspended.
    const keepSessions = await getAll("sessions");
    for (const store of Object.keys(STORES)) {
      if (store === "sessions") continue;
      await clear(store);
    }
    if (mode === "local") localStorage.removeItem(LS_KEY);
    readyPromise = null;
    await ensureReady();
    for (const session of keepSessions) {
      if (session.expiresAt > Date.now()) await put("sessions", session);
    }
  };

  const exportAll = async () => {
    const snapshot = { exportedAt: new Date().toISOString(), version: VERSION, mode, data: {} };
    for (const store of Object.keys(STORES)) snapshot.data[store] = await getAll(store);
    return snapshot;
  };

  return {
    STORES, DEMO, ensureReady, getAll, get, put, add, del, clear, count, byIndex,
    reset, exportAll, get mode() { return mode; },
  };
})();
