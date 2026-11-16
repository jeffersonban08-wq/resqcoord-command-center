/* ============================================================
   ResQCoord — tracking.js
   Live tracking engine: demo patrol simulation (one leader tab),
   real GPS watch, position persistence, cross-tab events,
   check-ins and SOS handling.
   ============================================================ */
"use strict";

const Tracking = (() => {
  const CHANNEL = "resqcoord.live";
  const PING_KEY = "resqcoord.ping";
  const SIM_LOCK = "resqcoord.simulation";

  let channel = null;
  try {
    channel = new BroadcastChannel(CHANNEL);
  } catch {
    channel = null;
  }

  const listeners = new Set();

  const dispatch = (message) => {
    listeners.forEach((fn) => {
      try {
        fn(message);
      } catch (err) {
        console.error("[ResQCoord] tracking listener failed", err);
      }
    });
    window.dispatchEvent(new CustomEvent("resqcoord:changed", { detail: message }));
  };

  if (channel) channel.onmessage = (event) => dispatch(event.data);

  window.addEventListener("storage", (event) => {
    if (event.key !== PING_KEY || !event.newValue) return;
    try {
      dispatch(JSON.parse(event.newValue));
    } catch {
      /* ignore malformed ping */
    }
  });

  const notify = (type, payload = {}) => {
    const message = { type, ...payload, ts: Date.now() };
    try {
      channel?.postMessage(message);
    } catch {
      /* channel closed */
    }
    try {
      localStorage.setItem(PING_KEY, JSON.stringify(message));
    } catch {
      /* storage full / private mode */
    }
    dispatch(message);
  };

  const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  /* ---------------- Position helpers ---------------- */
  const recordPosition = async (team, source = "simulation") => {
    await DB.put("positions", {
      id: U.randomId("pos"),
      teamId: team.id,
      lat: team.lat,
      lng: team.lng,
      ts: Date.now(),
      speed: team.speed || 0,
      source,
    });
  };

  const setTeamPosition = async (teamId, lat, lng, { source = "manual", status, speed } = {}) => {
    const team = await DB.get("teams", teamId);
    if (!team) return null;
    team.lat = Number(lat);
    team.lng = Number(lng);
    team.updatedAt = Date.now();
    team.lastSeen = Date.now();
    if (status) team.status = status;
    if (typeof speed === "number") team.speed = speed;
    await DB.put("teams", team);
    await recordPosition(team, source);
    notify("teams", { teamId, source });
    return team;
  };

  const getTrail = async (teamId, limit = 40) => {
    const rows = await DB.byIndex("positions", "teamId", teamId);
    rows.sort((a, b) => a.ts - b.ts);
    return rows.slice(-limit).map((row) => [row.lat, row.lng]);
  };

  const prune = async () => {
    const rows = await DB.getAll("positions");
    const cutoff = Date.now() - 45 * 60000;
    const stale = rows.filter((row) => row.ts < cutoff);
    for (const row of stale.slice(0, 200)) await DB.del("positions", row.id);
  };

  /* ---------------- Demo simulation ----------------
     Only one tab writes team movement at a time, using the Web Locks
     API when available. Movement is accelerated for demonstration. */
  let simTimer = null;
  let simRelease = null;
  let simTick = 0;
  let simLeader = false;

  const stepTeam = async (team) => {
    if (!team.patrol?.length || team.gpsLocked) return false;
    const target = team.patrol[team.patrolIdx % team.patrol.length] || team.patrol[0];
    const to = [target[0], target[1]];
    const distance = U.haversine([team.lat, team.lng], to);
    const step = team.status === "standby" ? 6 : team.kind === "Air" ? 70 : 42;
    const heading = Routing.bearing([team.lat, team.lng], to);
    let moved = false;

    if (distance < step + 2) {
      team.lat = to[0];
      team.lng = to[1];
      team.patrolIdx = (team.patrolIdx + 1) % team.patrol.length;
      moved = true;
    } else {
      const ratio = step / distance;
      team.lat += (to[0] - team.lat) * ratio;
      team.lng += (to[1] - team.lng) * ratio;
      moved = true;
    }

    if (team.status === "standby") {
      team.speed = 0;
    } else {
      team.speed = Number((1.5 + Math.random() * 2.2).toFixed(1));
    }
    team.heading = Math.round(heading);
    team.updatedAt = Date.now();
    team.lastSeen = Date.now();
    team.battery = Math.max(15, (team.battery ?? 80) - 0.02);
    await DB.put("teams", team);
    if (simTick % 3 === 0 && moved) await recordPosition(team, "simulation");
    return moved;
  };

  const simulationTick = async () => {
    simTick++;
    const teams = await DB.getAll("teams");
    const updates = [];
    for (const team of teams) {
      const moved = await stepTeam(team);
      if (moved) updates.push(team);
    }
    // Age out stale check-ins for the admin alert panel.
    if (simTick % 20 === 0) await prune();
    if (updates.length) notify("teams", { count: updates.length, tick: simTick });
  };

  const beginInterval = (intervalMs, onTick) => {
    if (simTimer) return;
    simLeader = true;
    simTimer = setInterval(async () => {
      try {
        await simulationTick();
        if (onTick) {
          const teams = await DB.getAll("teams");
          onTick(teams);
        }
      } catch (err) {
        console.warn("[ResQCoord] Simulation tick failed", err);
      }
    }, intervalMs);
    simulationTick().catch(() => {});
  };

  const startSimulation = ({ intervalMs = 2600, onTick } = {}) => {
    if (simTimer) return Promise.resolve(true);
    if (navigator.locks?.request) {
      return new Promise((resolve) => {
        navigator.locks
          .request(SIM_LOCK, { mode: "exclusive", ifAvailable: true }, (lock) => {
            if (!lock) {
              simLeader = false;
              resolve(false);
              return Promise.resolve();
            }
            beginInterval(intervalMs, onTick);
            resolve(true);
            return new Promise((release) => {
              simRelease = release;
            });
          })
          .catch(() => {
            beginInterval(intervalMs, onTick);
            resolve(true);
          });
      });
    }
    beginInterval(intervalMs, onTick);
    return Promise.resolve(true);
  };

  const stopSimulation = () => {
    if (simTimer) clearInterval(simTimer);
    simTimer = null;
    simLeader = false;
    if (simRelease) {
      simRelease();
      simRelease = null;
    }
  };

  /* ---------------- Real GPS ---------------- */
  let watchId = null;
  let lastFix = null;
  let gpsTeamId = null;
  let gpsStatus = "off";
  let demo = null;

  const GPS_MESSAGES = {
    1: "Location permission was denied. Allow location access in the browser, or use demo movement.",
    2: "GPS position unavailable. Move to an open area and try again.",
    3: "GPS timed out. Retrying automatically while live tracking stays on.",
  };

  const startGps = ({ teamId, onFix, onError, onStatus } = {}) => {
    if (!navigator.geolocation) {
      onError?.("This browser does not support the Geolocation API.");
      return false;
    }
    if (watchId !== null) return true;
    gpsTeamId = teamId;
    gpsStatus = "searching";
    onStatus?.("searching");
    lastFix = null;

    watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        const now = Date.now();
        let calcSpeed = speed != null ? speed * 3.6 : 0;
        if ((!calcSpeed || Number.isNaN(calcSpeed)) && lastFix) {
          const dt = (now - lastFix.ts) / 1000;
          const dist = U.haversine([lastFix.lat, lastFix.lng], [latitude, longitude]);
          calcSpeed = dt > 0 ? (dist / dt) * 3.6 : 0;
        }
        lastFix = { lat: latitude, lng: longitude, ts: now, accuracy };

        const team = await DB.get("teams", teamId);
        if (team) {
          team.lat = latitude;
          team.lng = longitude;
          team.accuracy = Math.round(accuracy);
          team.speed = Number((calcSpeed || 0).toFixed(1));
          team.heading = heading != null ? Math.round(heading) : team.heading;
          team.gpsLocked = true;
          team.updatedAt = now;
          team.lastSeen = now;
          await DB.put("teams", team);
          await recordPosition(team, "gps");
          notify("teams", { teamId, source: "gps" });
        }

        gpsStatus = "live";
        onStatus?.("live", { accuracy, speed: calcSpeed });
        onFix?.({
          lat: latitude,
          lng: longitude,
          accuracy,
          speed: Number((calcSpeed || 0).toFixed(1)),
          heading,
          ts: now,
        });
      },
      (error) => {
        gpsStatus = error.code === 1 ? "denied" : "error";
        onStatus?.(gpsStatus, error);
        onError?.(GPS_MESSAGES[error.code] || "Unable to read your GPS position.", error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2500 }
    );

    onStatus?.("searching");
    return true;
  };

  const stopGps = async () => {
    if (watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    lastFix = null;
    gpsStatus = "off";
    if (gpsTeamId) {
      const team = await DB.get("teams", gpsTeamId);
      if (team) {
        team.gpsLocked = false;
        await DB.put("teams", team);
        notify("teams", { teamId: gpsTeamId, source: "gps-off" });
      }
    }
    gpsTeamId = null;
  };

  /* Demo movement for environments without a GPS fix. */
  const startDemoMovement = async ({ teamId, onFix } = {}) => {
    stopDemoMovement();
    const team = await DB.get("teams", teamId);
    if (!team) return false;
    team.gpsLocked = true;
    team.speed = 3.2;
    await DB.put("teams", team);

    demo = setInterval(async () => {
      const row = await DB.get("teams", teamId);
      if (!row?.patrol?.length) return;
      const target = row.patrol[row.patrolIdx % row.patrol.length];
      const from = [row.lat, row.lng];
      const to = [target[0], target[1]];
      const distance = U.haversine(from, to);
      const step = 32;
      let lat = to[0];
      let lng = to[1];
      if (distance > step) {
        lat = row.lat + (to[0] - row.lat) * (step / distance);
        lng = row.lng + (to[1] - row.lng) * (step / distance);
      } else {
        row.patrolIdx = (row.patrolIdx + 1) % row.patrol.length;
      }
      row.lat = lat;
      row.lng = lng;
      row.heading = Math.round(Routing.bearing(from, [lat, lng]));
      row.speed = 3.2;
      row.updatedAt = Date.now();
      row.lastSeen = Date.now();
      await DB.put("teams", row);
      await recordPosition(row, "demo");
      notify("teams", { teamId, source: "demo" });
      onFix?.({ lat, lng, accuracy: 8, speed: 3.2, source: "demo" });
    }, 2200);
    return true;
  };

  const stopDemoMovement = async () => {
    if (demo) clearInterval(demo);
    demo = null;
    if (gpsTeamId) {
      const team = await DB.get("teams", gpsTeamId);
      if (team) {
        team.gpsLocked = false;
        await DB.put("teams", team);
      }
    }
  };

  /* ---------------- Check-in / SOS ---------------- */
  const checkIn = async (user, { lat, lng, note = "", status = "onsite" } = {}) => {
    const team = await Auth.getTeam();
    const now = Date.now();
    const record = {
      id: U.randomId("chk"),
      userId: user.id,
      teamId: team?.id || null,
      ts: now,
      lat: lat ?? team?.lat ?? null,
      lng: lng ?? team?.lng ?? null,
      note,
      status,
    };
    await DB.put("checkins", record);
    if (team) {
      team.lastCheckin = now;
      if (status) team.status = status;
      await DB.put("teams", team);
    }
    await Auth.audit(user, "CHECKIN", note || "Field check-in submitted");
    notify("checkins", { teamId: team?.id, userId: user.id });
    return record;
  };

  const triggerSos = async (user, reason = "Emergency assistance requested") => {
    const team = await Auth.getTeam();
    if (!team) return null;
    team.status = "sos";
    team.sosAt = Date.now();
    team.sosReason = reason;
    await DB.put("teams", team);

    const incident = {
      id: U.randomId("inc"),
      code: `INC-${String(Math.floor(1000 + Math.random() * 9000))}`,
      type: "SOS",
      severity: "Critical",
      title: `SOS activated · ${team.name}`,
      status: "open",
      description: reason,
      lat: team.lat,
      lng: team.lng,
      sector: team.sector || "Mt. Lantin area",
      reporterId: user.id,
      reporterName: user.name,
      teamId: team.id,
      ts: Date.now(),
      updatedAt: Date.now(),
    };
    await DB.put("incidents", incident);

    await DB.put("messages", {
      id: U.randomId("msg"),
      channel: "command",
      senderId: user.id,
      senderName: `${user.name} · ${team.name}`,
      text: `SOS · ${reason}`,
      ts: Date.now(),
      readBy: [],
      sos: true,
    });
    await Auth.audit(user, "SOS", `${team.name}: ${reason}`);
    notify("sos", { teamId: team.id, incidentId: incident.id });
    return { team, incident };
  };

  const clearSos = async (teamId, actor) => {
    const team = await DB.get("teams", teamId);
    if (!team) return null;
    team.status = "onsite";
    team.sosAt = null;
    team.sosReason = null;
    await DB.put("teams", team);
    if (actor) await Auth.audit(actor, "SOS_CLEARED", `SOS cleared for ${team.name}`);
    notify("teams", { teamId, source: "sos-cleared" });
    return team;
  };

  const heartbeatStatus = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    if (diff < 5 * 60000) return { label: "Live", cls: "badge-green" };
    if (diff < 20 * 60000) return { label: "Recent", cls: "badge-amber" };
    return { label: "Stale", cls: "badge-red" };
  };

  return {
    subscribe, notify, getTrail, setTeamPosition, recordPosition,
    startSimulation, stopSimulation, stepTeam,
    startGps, stopGps, startDemoMovement, stopDemoMovement,
    checkIn, triggerSos, clearSos, heartbeatStatus, prune,
    get gpsStatus() { return gpsStatus; },
    get isSimLeader() { return simLeader; },
    get gpsActive() { return watchId !== null; },
    get demoActive() { return demo !== null; },
    get gpsTeamId() { return gpsTeamId; },
    set gpsTeam(id) { gpsTeamId = id; },
    set gpsTeamId(id) { gpsTeamId = id; },
  };
})();
