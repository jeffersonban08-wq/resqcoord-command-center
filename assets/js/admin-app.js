/* ============================================================
   ResQCoord — admin-app.js
   Administrator command dashboard: overview KPIs, all-team live
   map, team tracking and routing, mission dispatch, personnel
   management, incident triage, broadcasts, reports, audit log
   and system data tools.
   ============================================================ */
"use strict";

(() => {
  const $ = U.qs;
  const $$ = U.qsa;
  const esc = U.escapeHtml;

  const SYS_KEY = "resqcoord.admin.settings";

  const state = {
    user: null,
    teams: [],
    missions: [],
    incidents: [],
    messages: [],
    users: [],
    checkins: [],
    audit: [],
    settings: null,
    system: {
      simulation: true,
      sosSound: false,
      strictCheckin: true,
      accuracy: true,
    },
    maps: { overview: null, admin: null },
    selectedTeamId: null,
    route: null,
    routeTeamId: null,
    showTrails: true,
    ready: false,
    lastSync: Date.now(),
    lastExport: null,
    views: {},
  };

  const clockIds = [
    "overviewClock", "mapClock", "missionsClock", "personnelClock",
    "incidentsClock", "messagesClock", "reportsClock", "auditClock", "settingsClock",
  ];

  const MISSION_STATUS_ORDER = { "In progress": 0, Monitoring: 1, Planned: 2, Completed: 3 };

  /* ---------------- small helpers ---------------- */
  const setText = (id, value) => {
    const el = $(`#${id}`);
    if (el) el.textContent = value;
  };

  const statusLabel = (status) => U.statusMeta[status]?.label || "Standby";
  const statusDot = (status) => `<span class="status-dot ${U.statusMeta[status]?.css || "standby"}"></span>`;

  const teamMonogram = (team) => esc((team?.short || team?.name || "TM").slice(0, 3).toUpperCase());

  const teamById = (id) => state.teams.find((t) => t.id === id) || null;

  const fmtMinutesAgo = (ts) => (ts ? U.fmtRelative(ts) : "never");

  const setSync = () => {
    state.lastSync = Date.now();
    const text = `Synced ${U.fmtTimeSec(state.lastSync)}`;
    if ($("#lastSync")) $("#lastSync").textContent = text;
  };

  const loadSystem = () => {
    try {
      const raw = localStorage.getItem(SYS_KEY);
      if (raw) state.system = { ...state.system, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
  };

  const saveSystem = () => {
    localStorage.setItem(SYS_KEY, JSON.stringify(state.system));
  };

  const toast = (msg, type = "success", title) => U.toast(msg, { type, title });

  /* ---------------- Data ---------------- */
  const reload = async () => {
    const [teams, missions, incidents, messages, users, checkins, audit, settings] = await Promise.all([
      DB.getAll("teams"),
      DB.getAll("missions"),
      DB.getAll("incidents"),
      DB.getAll("messages"),
      DB.getAll("users"),
      DB.getAll("checkins"),
      DB.getAll("audit"),
      DB.get("settings", state.user.id),
    ]);
    state.teams = teams.sort((a, b) => a.name.localeCompare(b.name));
    state.missions = missions;
    state.incidents = incidents;
    state.messages = messages.sort((a, b) => a.ts - b.ts);
    state.users = users;
    state.checkins = checkins;
    state.audit = audit.sort((a, b) => b.ts - a.ts);
    state.settings = settings || null;
    if (state.selectedTeamId && !teamById(state.selectedTeamId)) state.selectedTeamId = null;
  };

  /* ---------------- Identity ---------------- */
  const renderIdentity = () => {
    const u = state.user;
    const initials = U.initials(u.name);
    ["sidebarName", "topName", "settingsName"].forEach((id) => setText(id, u.name));
    ["sidebarRole", "settingsRole"].forEach((id) => setText(id, u.title || "Administrator · Duty Commander"));
    ["sidebarAvatar", "topAvatar", "settingsAvatar"].forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = initials;
    });
    setText("settingsResponderId", u.responderId || "—");
    if ($("#setName")) $("#setName").value = u.name || "";
    if ($("#setEmail")) $("#setEmail").value = u.email || "";
    if ($("#setPhone")) $("#setPhone").value = u.phone || "";
    if ($("#setTitle")) $("#setTitle").value = u.title || "";
    if ($("#setOrg")) $("#setOrg").value = u.org || "";
    if ($("#broadcastSender")) $("#broadcastSender").textContent = u.name;
    const mode = DB.mode === "idb" ? "IndexedDB (local)" : "localStorage fallback";
    setText("settingsDbMode", mode);
    setText("aboutDbMode", DB.mode === "idb" ? "IndexedDB" : "localStorage");
    setText("settingsAdminCode", DB.DEMO.adminCode);
  };

  /* ---------------- Overview ---------------- */
  const renderOverview = () => {
    const active = state.missions.filter((m) => m.status === "In progress");
    const monitoring = state.missions.filter((m) => m.status === "Monitoring");
    const openIncidents = state.incidents.filter((i) => i.status !== "resolved");
    const critical = openIncidents.filter((i) => i.severity === "Critical");
    const fieldUsers = state.users.filter((u) => u.role === "user" && u.status === "active");
    const deployed = state.teams.filter((t) => t.status === "onsite" || t.status === "enroute");
    const personnel = state.teams.reduce((sum, t) => sum + (t.members || 0), 0);

    setText("kpiActiveMissions", active.length + monitoring.length);
    setText("kpiActiveMissionsFoot", `${active.length} in progress · ${monitoring.length} monitoring`);
    setText("kpiTeams", state.teams.length);
    setText("kpiTeamsFoot", `${personnel} personnel tracked · ${deployed.length} deployed`);
    setText("kpiIncidents", openIncidents.length);
    setText("kpiIncidentsFoot", `${critical.length} critical priority`);
    setText("kpiPersonnel", fieldUsers.length);
    setText("kpiPersonnelFoot", `${state.teams.length} teams · ${state.users.filter((u) => u.role === "admin").length} admins`);
    setText("overviewMissionMeta", `${state.missions.length} total`);
    setText("mapTeamCount", state.teams.length);
    setText("mapTeamHint", `${state.teams.length} tracked`);

    const badge = $("#overviewMapBadge");
    if (badge) badge.textContent = `${state.teams.length} teams tracked`;

    const incidentCount = $("#incidentNavCount");
    if (incidentCount) {
      incidentCount.textContent = String(openIncidents.length);
      incidentCount.style.display = openIncidents.length ? "grid" : "none";
    }
    setText("incidentBadge", `${openIncidents.length} open`);
    setText("missionBadge", `${active.length} active`);
  };

  const renderAlerts = () => {
    const wrap = $("#alertList");
    if (!wrap) return;
    const alerts = [];
    state.teams.forEach((team) => {
      if (team.status === "sos") {
        alerts.push({
          icon: "sos", cls: "", title: `SOS · ${team.name}`,
          meta: `${team.sosReason || "Emergency assistance requested"} · ${fmtMinutesAgo(team.sosAt || team.updatedAt)}`,
          ts: team.sosAt || Date.now(), action: "sos", teamId: team.id,
        });
      }
    });
    state.incidents.filter((i) => i.status !== "resolved").forEach((inc) => {
      alerts.push({
        icon: inc.severity === "Critical" ? "alert" : "radio",
        cls: inc.severity === "Critical" ? "" : "amber",
        title: `${inc.code} · ${inc.title}`,
        meta: `${inc.severity} · ${inc.status} · ${inc.reporterName || "field"} · ${fmtMinutesAgo(inc.ts)}`,
        ts: inc.ts, action: "incident", incidentId: inc.id,
      });
    });
    const interval = state.settings?.checkinMinutes || 15;
    state.teams.forEach((team) => {
      const due = (team.lastCheckin || 0) + interval * 60000;
      if (team.status !== "sos" && due < Date.now()) {
        const over = Math.round((Date.now() - due) / 60000);
        alerts.push({
          icon: "clock", cls: "blue", title: `Check-in overdue · ${team.name}`,
          meta: `${over} min past window · last seen ${fmtMinutesAgo(team.lastSeen)}`,
          ts: due, action: "team", teamId: team.id,
        });
      }
    });

    alerts.sort((a, b) => b.ts - a.ts);
    setText("alertCount", alerts.length);
    if (!alerts.length) {
      wrap.innerHTML = `<div class="empty">${U.icon("checkCircle")}<div>No active alerts. All teams are within their check-in windows.</div></div>`;
      return;
    }
    wrap.innerHTML = alerts.slice(0, 8).map((a) => `
      <div class="alert-item" data-alert-action="${a.action}" data-team-id="${a.teamId || ""}" data-incident-id="${a.incidentId || ""}" role="button" tabindex="0">
        <div class="ai-icon ${a.cls}">${U.icon(a.icon)}</div>
        <div class="ai-body">
          <div class="ai-title">${esc(a.title)}</div>
          <div class="ai-meta">${esc(a.meta)}</div>
        </div>
        <span style="color:var(--muted-2);align-self:center">${U.icon("arrowRight")}</span>
      </div>`).join("");
  };

  const renderOverviewTeams = () => {
    const wrap = $("#overviewTeams");
    if (!wrap) return;
    if (!state.teams.length) {
      wrap.innerHTML = '<div class="empty">No teams registered.</div>';
      return;
    }
    wrap.innerHTML = state.teams.map((team) => {
      const meta = U.statusMeta[team.status] || U.statusMeta.standby;
      return `
        <div class="list-row clickable" data-team-id="${team.id}">
          <div class="team-avatar ${meta.css === "onsite" ? "green" : meta.css === "enroute" ? "amber" : meta.css === "sos" ? "red" : "purple"}">${teamMonogram(team)}</div>
          <div class="meta">
            <div class="name">${esc(team.name)} ${statusDot(team.status)}</div>
            <div class="sub">${esc(team.sector || "Mt. Lantin")} · ${team.members || 0} personnel</div>
          </div>
          <div class="right">
            <span class="badge ${meta.badge}">${meta.label}</span>
          </div>
        </div>`;
    }).join("");
  };

  const renderOverviewMissions = () => {
    const body = $("#overviewMissionRows");
    if (!body) return;
    const list = [...state.missions].sort((a, b) =>
      (MISSION_STATUS_ORDER[a.status] ?? 9) - (MISSION_STATUS_ORDER[b.status] ?? 9)
    );
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="6"><div class="empty">No missions yet. Create one to get started.</div></td></tr>';
      return;
    }
    body.innerHTML = list.slice(0, 6).map((m) => {
      const meta = U.statusMeta;
      const statusBadge = m.status === "Completed" ? "badge-green" : m.status === "Monitoring" ? "badge-blue" : "badge-amber";
      const priorityCls = U.severityMeta[m.priority]?.badge || "badge-muted";
      return `
        <tr>
          <td class="strong">${esc(m.code)}<div class="e" style="color:var(--muted-2);font-size:10px">${esc(m.name)}</div></td>
          <td><span class="badge ${statusBadge}">${esc(m.status)}</span></td>
          <td><span class="badge ${priorityCls}">${esc(m.priority || "—")}</span></td>
          <td>${esc(m.lead || "—")}<div class="e" style="color:var(--muted-2);font-size:10px">${esc(teamById(m.teamId)?.name || "Unassigned")}</div></td>
          <td style="min-width:110px">
            <div class="mini-progress"><i style="width:${m.progress || 0}%"></i></div>
            <span class="tiny muted-2">${m.progress || 0}%</span>
          </td>
          <td><button class="tbtn" data-mission-view="${m.id}" title="Open mission">${U.icon("eye")}</button></td>
        </tr>`;
    }).join("");
  };

  const renderOverviewActivity = () => {
    const wrap = $("#overviewActivity");
    if (!wrap) return;
    const rows = state.audit.slice(0, 6);
    if (!rows.length) {
      wrap.innerHTML = '<div class="empty">No activity recorded yet.</div>';
      return;
    }
    wrap.innerHTML = rows.map((a) => `
      <div class="msg-preview">
        <div class="mp-body">
          <div class="mp-head"><b>${esc(a.actorName || "System")}</b><span>${U.fmtRelative(a.ts)}</span></div>
          <div class="mp-text"><b style="color:var(--accent-2)">${esc(a.action)}</b> · ${esc(a.detail || "")}</div>
        </div>
      </div>`).join("");
  };

  /* ---------------- Maps ---------------- */
  const initMaps = () => {
    state.maps.overview = MapKit.create($("#overviewMap"), {
      center: [16.4037, 120.6012],
      zoom: 13,
      layers: "streets",
      onTeamClick: (team) => selectTeam(team.id, { jump: true }),
      onTileError: () => toast("Map tiles could not load. Check your connection.", "warn", "Map tiles offline"),
    });
    state.maps.admin = MapKit.create($("#adminMap"), {
      center: [16.4037, 120.6012],
      zoom: 14,
      layers: "streets",
      onTeamClick: (team) => selectTeam(team.id),
      onTileError: () => {},
    });
  };

  const renderMarkers = () => {
    const ids = new Set(state.teams.map((t) => t.id));
    [state.maps.overview, state.maps.admin].forEach((mk) => {
      if (!mk) return;
      mk.markers.forEach((_, key) => {
        if (key !== "me" && !ids.has(key)) mk.removeTeam(key);
      });
      state.teams.forEach((team) => mk.updateTeam(team, false));
    });
    if (state.maps.admin && state.route) state.maps.admin.drawRoute(state.route, { fit: false });
  };

  const renderTeamList = () => {
    const wrap = $("#adminTeamList");
    if (!wrap) return;
    const query = ($("#teamSearch")?.value || "").trim().toLowerCase();
    const filter = $("#teamFilter")?.value || "";
    const list = state.teams.filter((t) => {
      if (filter && t.status !== filter) return false;
      if (!query) return true;
      return [t.name, t.lead, t.sector, t.short].some((v) => String(v || "").toLowerCase().includes(query));
    });
    if (!list.length) {
      wrap.innerHTML = '<div class="empty">No teams match this filter.</div>';
      return;
    }
    wrap.innerHTML = list.map((team) => {
      const meta = U.statusMeta[team.status] || U.statusMeta.standby;
      const selected = team.id === state.selectedTeamId ? " selected" : "";
      return `
        <button class="team-card${selected}" data-team-id="${team.id}">
          <div class="team-avatar ${meta.css === "onsite" ? "green" : meta.css === "enroute" ? "amber" : meta.css === "sos" ? "red" : "purple"}" style="width:32px;height:32px;font-size:11px">${teamMonogram(team)}</div>
          <div class="tc-body">
            <div class="tc-name">${esc(team.name)} ${statusDot(team.status)}</div>
            <div class="tc-sub">${esc(team.lead || "—")} · ${esc(team.sector || "—")}</div>
          </div>
          <div class="tc-right">
            <b>${(team.speed ?? 0).toFixed(1)} km/h</b>
            <span>${fmtMinutesAgo(team.lastSeen)}</span>
          </div>
        </button>`;
    }).join("");
  };

  const updateTeamDetail = () => {
    const team = teamById(state.selectedTeamId);
    const badge = $("#detailStatus");
    if (!team) {
      setText("detailName", "Select a team");
      setText("detailSector", "Click a team on the map or list");
      setText("detailLead", "—"); setText("detailMembers", "—");
      setText("detailSpeed", "—"); setText("detailBattery", "—");
      setText("detailUpdated", "—"); setText("detailCoords", "—");
      if ($("#detailMonogram")) $("#detailMonogram").textContent = "—";
      if (badge) { badge.className = "badge badge-muted"; badge.textContent = "—"; }
      setText("mapSelectedLabel", "No team selected");
      return;
    }
    const meta = U.statusMeta[team.status] || U.statusMeta.standby;
    if ($("#detailMonogram")) $("#detailMonogram").textContent = teamMonogram(team);
    setText("detailName", team.name);
    setText("detailSector", `${team.sector || "Mt. Lantin area"} · ${team.kind || "Ground"} unit`);
    setText("detailLead", team.lead || "—");
    setText("detailMembers", `${team.members || 0} personnel`);
    setText("detailSpeed", `${(team.speed ?? 0).toFixed(1)} km/h`);
    setText("detailBattery", `${Math.round(team.battery ?? 0)}%`);
    setText("detailUpdated", fmtMinutesAgo(team.updatedAt || team.lastSeen));
    setText("detailCoords", `${team.lat?.toFixed(5)}, ${team.lng?.toFixed(5)}`);
    if (badge) { badge.className = `badge ${meta.badge}`; badge.textContent = meta.label; }
    setText("mapSelectedLabel", `${team.name} selected · ${team.sector || "Mt. Lantin"}`);
  };

  const focusSelectedTeam = (zoom = 15) => {
    const team = teamById(state.selectedTeamId);
    if (!team || !state.maps.admin) return;
    // Never call flyTo on a hidden (zero-size) map — Leaflet can
    // otherwise compute NaN coordinates.
    if (!$("#view-map")?.classList.contains("active")) return;
    state.maps.admin.invalidate();
    state.maps.admin.focus(team.lat, team.lng, zoom);
    if (state.showTrails) refreshSelectedTrail();
  };

  const selectTeam = (teamId, { jump = false } = {}) => {
    state.selectedTeamId = teamId;
    renderTeamList();
    updateTeamDetail();
    if (jump) {
      switchView("map");
      setTimeout(() => focusSelectedTeam(15), 220);
    } else {
      focusSelectedTeam(15);
    }
  };

  const refreshSelectedTrail = async () => {
    const team = teamById(state.selectedTeamId);
    if (!team || !state.maps.admin) return;
    const coords = await Tracking.getTrail(team.id, 40);
    coords.push([team.lat, team.lng]);
    state.maps.admin.showTrail(coords, team.status === "sos" ? "#ff5a6a" : "#a78bfa");
  };

  const clearTrail = () => {
    state.maps.admin?.clearTrail();
  };

  const populateAssignTargets = () => {
    const select = $("#assignTarget");
    if (!select) return;
    select.innerHTML = Routing.PLACES.map((p, i) => `<option value="${i}">${esc(p.name)} — ${esc(p.detail)}</option>`).join("");
  };

  const assignRoute = async () => {
    const team = teamById(state.selectedTeamId);
    if (!team) {
      toast("Select a team first, then choose a destination.", "warn", "No team selected");
      return;
    }
    const target = Routing.PLACES[Number($("#assignTarget")?.value || 0)];
    if (!target) return;
    const hint = $("#assignResult");
    if (hint) hint.textContent = "Calculating route…";
    const route = await Routing.getRoute([team.lat, team.lng], [target.lat, target.lng], "driving");
    if (!route.ok) {
      if (hint) hint.textContent = "Route could not be calculated.";
      return;
    }
    state.route = route;
    state.routeTeamId = team.id;
    state.maps.admin?.drawRoute(route);
    if (hint) {
      hint.innerHTML = `${U.formatDistance(route.distance)} · ${U.formatDuration(route.duration)} · ${route.source === "osrm" ? "road route" : "offline route"}`;
    }
    await DB.put("messages", {
      id: U.randomId("msg"),
      channel: team.id ? `team:${team.id}` : "command",
      senderId: state.user.id,
      senderName: "Command Center",
      text: `Route assigned: proceed to ${target.name} (${U.formatDistance(route.distance)}, ${U.formatDuration(route.duration)}).`,
      ts: Date.now(),
      readBy: [state.user.id],
    });
    await Auth.audit(state.user, "MISSION", `Routed ${team.name} to ${target.name}`);
    Tracking.notify("messages", { teamId: team.id });
    toast(`Route sent to ${team.name}.`, "success", "Route assigned");
  };

  /* ---------------- Missions ---------------- */
  const missionFilters = () => ({
    query: ($("#missionSearch")?.value || "").trim().toLowerCase(),
    status: $("#missionStatusFilter")?.value || "",
    priority: $("#missionPriorityFilter")?.value || "",
  });

  const renderMissions = () => {
    const body = $("#missionRows");
    if (!body) return;
    const { query, status, priority } = missionFilters();
    const list = [...state.missions]
      .filter((m) => {
        if (status && m.status !== status) return false;
        if (priority && m.priority !== priority) return false;
        if (!query) return true;
        return [m.name, m.code, m.lead, m.sector, m.type].some((v) => String(v || "").toLowerCase().includes(query));
      })
      .sort((a, b) => (MISSION_STATUS_ORDER[a.status] ?? 9) - (MISSION_STATUS_ORDER[b.status] ?? 9) || b.updatedAt - a.updatedAt);

    setText("missionActiveCount", state.missions.filter((m) => m.status === "In progress").length);
    setText("missionMonitoringCount", state.missions.filter((m) => m.status === "Monitoring").length);
    setText("missionCompletedCount", state.missions.filter((m) => m.status === "Completed").length);

    if (!list.length) {
      body.innerHTML = '<tr><td colspan="7"><div class="empty">No missions match this filter.</div></td></tr>';
      return;
    }
    body.innerHTML = list.map((m) => {
      const statusBadge = m.status === "Completed" ? "badge-green" : m.status === "Monitoring" ? "badge-blue" : m.status === "Planned" ? "badge-muted" : "badge-amber";
      const priorityCls = U.severityMeta[m.priority]?.badge || "badge-muted";
      return `
        <tr>
          <td class="strong">${esc(m.code)}<div class="e" style="color:var(--muted-2);font-size:10px">${esc(m.name)}</div></td>
          <td><span class="badge ${statusBadge}">${esc(m.status)}</span></td>
          <td><span class="badge ${priorityCls}">${esc(m.priority || "—")}</span></td>
          <td>${esc(m.lead || "—")}<div class="e" style="color:var(--muted-2);font-size:10px">${esc(teamById(m.teamId)?.name || "Unassigned")}</div></td>
          <td style="min-width:120px">
            <div class="mini-progress"><i style="width:${m.progress || 0}%"></i></div>
            <span class="tiny muted-2">${m.progress || 0}%</span>
          </td>
          <td class="mono tiny">${U.fmtDateTime(m.startedAt || m.createdAt)}</td>
          <td class="actions">
            <button class="tbtn" data-mission-view="${m.id}" title="View">${U.icon("eye")}</button>
            <button class="tbtn" data-mission-edit="${m.id}" title="Edit">${U.icon("edit")}</button>
            <button class="tbtn" data-mission-advance="${m.id}" title="Advance progress">${U.icon("check")}</button>
          </td>
        </tr>`;
    }).join("");
  };

  const nextMissionCode = () => {
    const year = new Date().getFullYear();
    const nums = state.missions
      .map((m) => Number(String(m.code || "").split("-").pop()))
      .filter((n) => Number.isFinite(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `MSN-${year}-${String(next).padStart(3, "0")}`;
  };

  const teamOptions = (selected) =>
    state.teams.map((t) => `<option value="${t.id}" ${t.id === selected ? "selected" : ""}>${esc(t.name)} · ${esc(t.lead || "—")}</option>`).join("");

  const openMissionModal = (mission = null) => {
    const editing = !!mission;
    const placeOptions = Routing.PLACES.map((p, i) =>
      `<option value="${i}" ${mission && Math.abs(p.lat - mission.lat) < 0.0001 ? "selected" : ""}>${esc(p.name)} — ${esc(p.detail)}</option>`
    ).join("");
    const m = U.modal({
      title: editing ? `Edit ${mission.code}` : "Dispatch new mission",
      subtitle: editing ? mission.name : "Create a mission and assign a team",
      wide: true,
      body: `
        <form id="missionForm" class="form-grid cols-2">
          <div class="field" style="grid-column:1/-1"><label for="msnName">Mission name</label><input class="input" id="msnName" required value="${editing ? esc(mission.name) : ""}" placeholder="e.g. Mt. Lantin Rescue"></div>
          <div class="field"><label for="msnType">Type</label>
            <select class="select" id="msnType">
              ${["Mountain SAR", "Search", "Landslide response", "Medevac", "Flood rescue", "Fire support", "Other"]
                .map((t) => `<option ${editing && mission.type === t ? "selected" : ""}>${t}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label for="msnPriority">Priority</label>
            <select class="select" id="msnPriority">
              ${["Critical", "High", "Medium", "Low"].map((p) => `<option ${editing ? (mission.priority === p ? "selected" : "") : (p === "High" ? "selected" : "")}>${p}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label for="msnStatus">Status</label>
            <select class="select" id="msnStatus">
              ${["Planned", "In progress", "Monitoring", "Completed"].map((s) => `<option ${editing ? (mission.status === s ? "selected" : "") : (s === "In progress" ? "selected" : "")}>${s}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label for="msnSector">Sector</label><input class="input" id="msnSector" value="${editing ? esc(mission.sector || "") : "Sector A"}" placeholder="Sector A"></div>
          <div class="field"><label for="msnTeam">Assigned team</label><select class="select" id="msnTeam">${teamOptions(editing ? mission.teamId : null)}</select></div>
          <div class="field"><label for="msnLead">Mission lead</label><input class="input" id="msnLead" value="${editing ? esc(mission.lead || "") : ""}" placeholder="Team lead name"></div>
          <div class="field"><label for="msnPlace">Staging / target location</label><select class="select" id="msnPlace">${placeOptions}</select></div>
          <div class="field"><label for="msnProgress">Progress (%)</label><input class="input" id="msnProgress" type="number" min="0" max="100" value="${editing ? mission.progress || 0 : 0}"></div>
          <div class="field"><label for="msnSubjects">Subjects / scope</label><input class="input" id="msnSubjects" value="${editing ? esc(mission.subjects || "") : ""}" placeholder="e.g. 2 lost hikers"></div>
          <div class="field" style="grid-column:1/-1"><label for="msnDesc">Briefing</label><textarea class="input" id="msnDesc" rows="3" placeholder="Operational brief for the field team">${editing ? esc(mission.description || "") : ""}</textarea></div>
          <div class="field" style="grid-column:1/-1"><label for="msnHazards">Hazards</label><input class="input" id="msnHazards" value="${editing ? esc(mission.hazards || "") : ""}" placeholder="e.g. Rockfall in Sector C"></div>
        </form>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-save>${editing ? "Save mission" : "Dispatch mission"}</button>`,
    });

    m.el.querySelector("[data-save]").addEventListener("click", async () => {
      const form = m.el.querySelector("#missionForm");
      if (!form.reportValidity()) return;
      const place = Routing.PLACES[Number(m.el.querySelector("#msnPlace").value || 0)];
      const teamId = m.el.querySelector("#msnTeam").value;
      const team = teamById(teamId);
      const payload = {
        name: m.el.querySelector("#msnName").value.trim(),
        type: m.el.querySelector("#msnType").value,
        priority: m.el.querySelector("#msnPriority").value,
        status: m.el.querySelector("#msnStatus").value,
        sector: m.el.querySelector("#msnSector").value.trim(),
        teamId,
        lead: m.el.querySelector("#msnLead").value.trim() || team?.lead || "",
        lat: place?.lat ?? 16.4037,
        lng: place?.lng ?? 120.6012,
        progress: U.clamp(Number(m.el.querySelector("#msnProgress").value || 0), 0, 100),
        subjects: m.el.querySelector("#msnSubjects").value.trim(),
        description: m.el.querySelector("#msnDesc").value.trim(),
        hazards: m.el.querySelector("#msnHazards").value.trim(),
      };
      if (editing) {
        Object.assign(mission, payload, { updatedAt: Date.now() });
        mission.timeline = mission.timeline || [];
        mission.timeline.push({ t: U.fmtTime(), text: `Brief updated by command` });
        await DB.put("missions", mission);
        await Auth.audit(state.user, "MISSION", `Updated ${mission.code}`);
        toast(`${mission.code} updated.`, "success", "Mission saved");
      } else {
        const code = nextMissionCode();
        const now = Date.now();
        const record = {
          id: U.randomId("msn"),
          code,
          ...payload,
          weather: "To be confirmed",
          lastSeen: place?.name || "—",
          startedAt: now,
          createdAt: now,
          updatedAt: now,
          checkpoints: [{ name: "Staging area", detail: place?.name || "—", time: U.fmtTime(), done: true, next: true }],
          timeline: [{ t: U.fmtTime(), text: `Mission dispatched to ${team?.name || "team"}` }],
          createdBy: state.user.id,
        };
        await DB.put("missions", record);
        if (team) {
          team.missionId = record.id;
          if (team.status === "standby") team.status = "enroute";
          team.updatedAt = now;
          await DB.put("teams", team);
        }
        await DB.put("messages", {
          id: U.randomId("msg"),
          channel: team ? `team:${team.id}` : "command",
          senderId: state.user.id,
          senderName: "Command Center",
          text: `New mission ${code}: ${record.name}. ${record.description || "Await further instructions."}`,
          ts: now,
          readBy: [state.user.id],
        });
        await Auth.audit(state.user, "MISSION", `Dispatched ${code} to ${team?.name || "unassigned"}`);
        Tracking.notify("missions", { missionId: record.id });
        toast(`${code} dispatched.`, "success", "Mission created");
      }
      m.close();
      await refresh();
    });
  };

  const openMissionDetail = (missionId) => {
    const m = state.missions.find((x) => x.id === missionId);
    if (!m) return;
    const team = teamById(m.teamId);
    const priorityCls = U.severityMeta[m.priority]?.badge || "badge-muted";
    const modal = U.modal({
      title: `${m.code} · ${m.name}`,
      subtitle: `${m.type} · ${m.sector || "—"} · ${team?.name || "Unassigned"}`,
      wide: true,
      body: `
        <div class="row between wrap" style="margin-bottom:14px">
          <span class="badge ${m.status === "Completed" ? "badge-green" : "badge-amber"}">${esc(m.status)}</span>
          <span class="badge ${priorityCls}">Priority: ${esc(m.priority)}</span>
          <span class="badge badge-blue">${m.progress || 0}% complete</span>
        </div>
        <div class="big-progress" style="margin-bottom:16px"><i style="width:${m.progress || 0}%"></i></div>
        <div class="brief-grid">
          <div class="brief-item"><div class="k">Lead</div><div class="v">${esc(m.lead || "—")}</div></div>
          <div class="brief-item"><div class="k">Team</div><div class="v">${esc(team?.name || "Unassigned")}</div></div>
          <div class="brief-item"><div class="k">Subjects</div><div class="v">${esc(m.subjects || "—")}</div></div>
          <div class="brief-item"><div class="k">Last seen</div><div class="v">${esc(m.lastSeen || "—")}</div></div>
          <div class="brief-item"><div class="k">Weather</div><div class="v">${esc(m.weather || "—")}</div></div>
          <div class="brief-item"><div class="k">Hazards</div><div class="v">${esc(m.hazards || "—")}</div></div>
        </div>
        <div class="divider" style="margin:16px 0"></div>
        <p class="small" style="color:var(--muted);line-height:1.7">${esc(m.description || "No briefing recorded.")}</p>
        <div class="grid grid-2" style="margin-top:16px">
          <div>
            <div class="tiny uppercase muted-2" style="margin-bottom:9px">Checkpoints</div>
            ${(m.checkpoints || []).map((c) => `
              <div class="checkpoint ${c.done ? "done" : c.next ? "next" : ""}">
                <span class="cp-dot"></span>
                <div class="cp-name">${esc(c.name)}</div>
                <div class="cp-meta">${esc(c.detail || "")} · ${esc(c.time || "")}</div>
              </div>`).join("") || '<div class="empty">No checkpoints.</div>'}
          </div>
          <div>
            <div class="tiny uppercase muted-2" style="margin-bottom:9px">Timeline</div>
            <div class="timeline">
              ${(m.timeline || []).map((t) => `<div class="tl-item"><div class="tl-time">${esc(t.t)}</div><div class="tl-text">${esc(t.text)}</div></div>`).join("")}
            </div>
          </div>
        </div>`,
      footer: `
        <button class="btn" data-close>Close</button>
        <button class="btn" data-edit>Edit</button>
        <button class="btn" data-advance>Advance 10%</button>
        <button class="btn btn-primary" data-complete>Mark complete</button>`,
    });
    modal.el.querySelector("[data-edit]").addEventListener("click", () => { modal.close(); openMissionModal(m); });
    modal.el.querySelector("[data-advance]").addEventListener("click", async () => {
      m.progress = U.clamp((m.progress || 0) + 10, 0, 100);
      m.updatedAt = Date.now();
      m.timeline = m.timeline || [];
      m.timeline.push({ t: U.fmtTime(), text: `Progress advanced to ${m.progress}%` });
      if (m.progress >= 100) m.status = "Completed";
      await DB.put("missions", m);
      await Auth.audit(state.user, "MISSION", `${m.code} advanced to ${m.progress}%`);
      modal.close();
      toast(`${m.code} now ${m.progress}%.`, "success", "Mission updated");
      await refresh();
    });
    modal.el.querySelector("[data-complete]").addEventListener("click", async () => {
      m.progress = 100;
      m.status = "Completed";
      m.updatedAt = Date.now();
      m.timeline = m.timeline || [];
      m.timeline.push({ t: U.fmtTime(), text: "Mission marked complete by command" });
      await DB.put("missions", m);
      if (team && team.missionId === m.id) {
        team.missionId = null;
        await DB.put("teams", team);
      }
      await Auth.audit(state.user, "MISSION", `${m.code} completed`);
      Tracking.notify("missions", { missionId: m.id });
      modal.close();
      toast(`${m.code} completed.`, "success", "Mission closed");
      await refresh();
    });
  };

  const advanceMission = async (missionId) => {
    const m = state.missions.find((x) => x.id === missionId);
    if (!m) return;
    m.progress = U.clamp((m.progress || 0) + 10, 0, 100);
    if (m.progress >= 100) m.status = "Completed";
    m.updatedAt = Date.now();
    m.timeline = m.timeline || [];
    m.timeline.push({ t: U.fmtTime(), text: `Progress advanced to ${m.progress}%` });
    await DB.put("missions", m);
    await Auth.audit(state.user, "MISSION", `${m.code} advanced to ${m.progress}%`);
    toast(`${m.code} now ${m.progress}%.`, "success", "Mission updated");
    await refresh();
  };

  /* ---------------- Personnel ---------------- */
  const renderPersonnel = () => {
    const body = $("#personnelRows");
    if (!body) return;
    const query = ($("#personnelSearch")?.value || "").trim().toLowerCase();
    const role = $("#personnelRoleFilter")?.value || "";
    const status = $("#personnelStatusFilter")?.value || "";

    const list = state.users.filter((u) => {
      if (role && u.role !== role) return false;
      if (status && u.status !== status) return false;
      if (!query) return true;
      return [u.name, u.email, u.responderId, u.team, u.title].some((v) => String(v || "").toLowerCase().includes(query));
    }).sort((a, b) => (a.role === b.role ? a.name.localeCompare(b.name) : a.role === "admin" ? -1 : 1));

    setText("personnelTotal", state.users.length);
    setText("personnelField", state.users.filter((u) => u.role === "user").length);
    setText("personnelSuspended", state.users.filter((u) => u.status !== "active").length);

    if (!list.length) {
      body.innerHTML = '<tr><td colspan="7"><div class="empty">No accounts match this filter.</div></td></tr>';
      return;
    }
    body.innerHTML = list.map((u) => {
      const active = u.status === "active";
      const isAdmin = u.role === "admin";
      return `
        <tr>
          <td>
            <div class="row-user">
              <div class="avatar ${isAdmin ? "" : "green"}" style="width:30px;height:30px;font-size:10px;${isAdmin ? "background:#251d3d;border-color:#45336b;color:var(--purple)" : ""}">${U.initials(u.name)}</div>
              <div><div class="n">${esc(u.name)}</div><div class="e">${esc(u.email)}</div></div>
            </div>
          </td>
          <td><span class="badge ${isAdmin ? "badge-purple" : "badge-blue"}">${isAdmin ? "Admin" : "Responder"}</span></td>
          <td>${esc(u.team || "Unassigned")}</td>
          <td class="mono tiny">${esc(u.responderId || "—")}</td>
          <td><span class="badge ${active ? "badge-green" : "badge-red"}">${active ? "Active" : "Suspended"}</span></td>
          <td class="tiny">${u.lastLogin ? U.fmtRelative(u.lastLogin) : "—"}</td>
          <td class="actions">
            <button class="tbtn" data-user-toggle="${u.id}" title="${active ? "Suspend" : "Activate"}">${U.icon(active ? "lock" : "power")}</button>
            <button class="tbtn" data-user-edit="${u.id}" title="Edit">${U.icon("edit")}</button>
            <button class="tbtn" data-user-delete="${u.id}" title="Delete">${U.icon("trash")}</button>
          </td>
        </tr>`;
    }).join("");
  };

  const renderTeamRoster = () => {
    const body = $("#teamRosterRows");
    if (!body) return;
    if (!state.teams.length) {
      body.innerHTML = '<tr><td colspan="7"><div class="empty">No teams registered.</div></td></tr>';
      return;
    }
    const interval = state.settings?.checkinMinutes || 15;
    body.innerHTML = state.teams.map((t) => {
      const meta = U.statusMeta[t.status] || U.statusMeta.standby;
      const overdue = (t.lastCheckin || 0) + interval * 60000 < Date.now() && t.status !== "sos";
      return `
        <tr>
          <td class="strong">${esc(t.name)} <span class="tiny muted-2">${esc(t.short || "")}</span></td>
          <td>${esc(t.kind || "Ground")}</td>
          <td>${esc(t.lead || "—")}</td>
          <td>${t.members || 0}</td>
          <td>${esc(t.sector || "—")}</td>
          <td><span class="badge ${meta.badge}">${meta.label}</span></td>
          <td class="${overdue ? "" : "tiny"}" style="${overdue ? "color:var(--warn)" : ""}">${t.lastCheckin ? U.fmtRelative(t.lastCheckin) : "never"}${overdue ? " · overdue" : ""}</td>
        </tr>`;
    }).join("");
  };

  const openPersonnelModal = (user = null) => {
    const editing = !!user;
    const m = U.modal({
      title: editing ? `Edit ${user.name}` : "Add responder",
      subtitle: editing ? user.email : "Create a field account",
      body: `
        <form id="personnelForm" class="form-grid cols-2">
          <div class="field" style="grid-column:1/-1"><label for="perName">Full name</label><input class="input" id="perName" required value="${editing ? esc(user.name) : ""}"></div>
          <div class="field"><label for="perEmail">Email</label><input class="input" id="perEmail" type="email" required ${editing ? "readonly" : ""} value="${editing ? esc(user.email) : ""}"></div>
          <div class="field"><label for="perPhone">Phone</label><input class="input" id="perPhone" value="${editing ? esc(user.phone || "") : ""}"></div>
          <div class="field"><label for="perRole">Role</label>
            <select class="select" id="perRole" ${editing ? "disabled" : ""}>
              <option value="user" ${editing && user.role === "user" ? "selected" : ""}>Responder</option>
              <option value="admin" ${editing && user.role === "admin" ? "selected" : ""}>Administrator</option>
            </select>
          </div>
          <div class="field"><label for="perTeam">Team</label><select class="select" id="perTeam">${teamOptions(editing ? user.teamId : null)}</select></div>
          <div class="field"><label for="perTitle">Title</label><input class="input" id="perTitle" value="${editing ? esc(user.title || "") : ""}" placeholder="Field Responder"></div>
          <div class="field"><label for="perCert">Certification</label><input class="input" id="perCert" value="${editing ? esc(user.cert || "") : ""}" placeholder="Wilderness First Responder"></div>
          ${editing ? "" : `<div class="field"><label for="perPass">Temporary password</label><input class="input" id="perPass" type="text" value="Rescue@2026" required></div>`}
        </form>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-save>${editing ? "Save changes" : "Create account"}</button>`,
    });
    m.el.querySelector("[data-save]").addEventListener("click", async () => {
      const form = m.el.querySelector("#personnelForm");
      if (!form.reportValidity()) return;
      const name = m.el.querySelector("#perName").value.trim();
      const email = m.el.querySelector("#perEmail").value.trim().toLowerCase();
      const phone = m.el.querySelector("#perPhone").value.trim();
      const role = editing ? user.role : m.el.querySelector("#perRole").value;
      const teamId = m.el.querySelector("#perTeam").value;
      const team = teamById(teamId);
      const title = m.el.querySelector("#perTitle").value.trim();
      const cert = m.el.querySelector("#perCert").value.trim();

      if (editing) {
        Object.assign(user, {
          name, phone, teamId: teamId || null, team: team?.name || user.team,
          title: title || user.title, cert,
        });
        await DB.put("users", user);
        await Auth.audit(state.user, "PERSONNEL", `Updated account ${user.email}`);
        toast(`${name} updated.`, "success", "Account saved");
      } else {
        if (!Auth.emailOk(email)) { toast("Enter a valid email address.", "error"); return; }
        if (state.users.some((u) => u.email.toLowerCase() === email)) {
          toast("An account with that email already exists.", "error"); return;
        }
        const password = m.el.querySelector("#perPass").value || "Rescue@2026";
        const { salt, hash, algo } = await U.hashPassword(password);
        const now = Date.now();
        const record = {
          id: U.randomId("u"), name, email, role,
          title: title || (role === "admin" ? "Administrator" : `Field Responder · ${team?.name || "Unassigned"}`),
          org: state.user.org || "Provincial Rescue Coordination Office",
          phone,
          teamId: role === "admin" ? "team_command" : (teamId || null),
          team: role === "admin" ? "Command Center" : (team?.name || "Unassigned"),
          status: "active",
          responderId: role === "admin"
            ? `ADM-${String(state.users.filter((u) => u.role === "admin").length + 1).padStart(4, "0")}`
            : `FR-${String(200 + state.users.filter((u) => u.role === "user").length + 1).padStart(4, "0")}`,
          cert, salt, hash, algo, createdAt: now, lastLogin: null,
        };
        await DB.put("users", record);
        await DB.put("settings", {
          userId: record.id, shareLocation: true, backgroundTracking: true,
          checkinMinutes: 15, notifications: { sos: true, checkin: true, messages: true, weather: true }, createdAt: now,
        });
        await Auth.audit(state.user, "PERSONNEL", `Created ${role} account ${email}`);
        toast(`${name} can sign in with the temporary password.`, "success", "Responder added");
      }
      m.close();
      await refresh();
    });
  };

  const toggleUser = async (userId) => {
    const u = state.users.find((x) => x.id === userId);
    if (!u) return;
    if (u.id === state.user.id) { toast("You cannot suspend your own account.", "warn"); return; }
    const suspend = u.status === "active";
    if (suspend) {
      const ok = await U.confirm({ title: `Suspend ${u.name}?`, message: "The account will be blocked from signing in until reactivated.", confirmText: "Suspend", danger: true });
      if (!ok) return;
    }
    u.status = suspend ? "suspended" : "active";
    await DB.put("users", u);
    await Auth.audit(state.user, "PERSONNEL", `${suspend ? "Suspended" : "Reactivated"} ${u.email}`);
    toast(`${u.name} ${suspend ? "suspended" : "reactivated"}.`, suspend ? "warn" : "success");
    await refresh();
  };

  const deleteUser = async (userId) => {
    const u = state.users.find((x) => x.id === userId);
    if (!u) return;
    if (u.id === state.user.id) { toast("You cannot delete your own account.", "warn"); return; }
    const ok = await U.confirm({ title: `Delete ${u.name}?`, message: "This removes the account and its settings from the local database. This cannot be undone.", confirmText: "Delete", danger: true });
    if (!ok) return;
    await DB.del("users", u.id);
    await DB.del("settings", u.id).catch(() => {});
    await Auth.audit(state.user, "PERSONNEL", `Deleted account ${u.email}`);
    toast(`${u.name} removed.`, "success");
    await refresh();
  };

  /* ---------------- Incidents ---------------- */
  const severityRank = { Critical: 0, High: 1, Medium: 2, Low: 3 };

  const renderIncidents = () => {
    const wrap = $("#incidentList");
    if (!wrap) return;
    const query = ($("#incidentSearch")?.value || "").trim().toLowerCase();
    const severity = $("#incidentSeverityFilter")?.value || "";
    const status = $("#incidentStatusFilter")?.value || "";
    const list = state.incidents.filter((i) => {
      if (severity && i.severity !== severity) return false;
      if (status && i.status !== status) return false;
      if (!query) return true;
      return [i.title, i.code, i.reporterName, i.sector, i.type].some((v) => String(v || "").toLowerCase().includes(query));
    }).sort((a, b) => (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9) || b.ts - a.ts);

    if (!list.length) {
      wrap.innerHTML = '<div class="empty">No incidents match this filter.</div>';
      return;
    }
    wrap.innerHTML = list.map((inc) => {
      const statusMeta = U.incidentStatusMeta[inc.status] || { badge: "badge-muted", label: inc.status };
      const team = teamById(inc.teamId);
      return `
        <div class="incident-card" style="border-radius:0;border-left:0;border-right:0;border-top:0">
          <div class="ic-head">
            <div>
              <div class="ic-title">${esc(inc.title)} <span class="severity-pill ${inc.severity}">${esc(inc.severity)}</span></div>
              <div class="ic-meta">
                <span>${U.icon("file")} ${esc(inc.code)}</span>
                <span>${U.icon("user")} ${esc(inc.reporterName || "field")}</span>
                <span>${U.icon("pin")} ${esc(inc.sector || "—")}</span>
                <span>${U.icon("clock")} ${U.fmtRelative(inc.ts)}</span>
                ${team ? `<span>${U.icon("users")} ${esc(team.name)}</span>` : ""}
              </div>
            </div>
            <span class="badge ${statusMeta.badge}">${statusMeta.label}</span>
          </div>
          <div class="ic-desc">${esc(inc.description || "")}</div>
          <div class="row wrap" style="gap:6px;margin-top:10px">
            ${inc.status === "open" ? `<button class="btn btn-sm" data-incident-status="acknowledged" data-incident-id="${inc.id}">Acknowledge</button>` : ""}
            ${inc.status !== "escalated" && inc.status !== "resolved" ? `<button class="btn btn-sm btn-danger" data-incident-status="escalated" data-incident-id="${inc.id}">Escalate</button>` : ""}
            ${inc.status !== "resolved" ? `<button class="btn btn-sm btn-primary" data-incident-status="resolved" data-incident-id="${inc.id}">Resolve</button>` : ""}
            <button class="btn btn-sm btn-ghost" data-incident-locate="${inc.id}">Show on map</button>
            <button class="btn btn-sm btn-ghost" data-incident-assign="${inc.id}">Assign team</button>
          </div>
        </div>`;
    }).join("");
  };

  const setIncidentStatus = async (incidentId, status) => {
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return;
    inc.status = status;
    inc.updatedAt = Date.now();
    await DB.put("incidents", inc);
    if (status === "resolved" && inc.type === "SOS" && inc.teamId) {
      await Tracking.clearSos(inc.teamId, state.user);
    }
    await Auth.audit(state.user, "INCIDENT", `${inc.code} marked ${status}`);
    Tracking.notify("incidents", { incidentId: inc.id });
    toast(`${inc.code} ${status}.`, status === "resolved" ? "success" : "info", "Incident updated");
    await refresh();
  };

  const assignIncidentTeam = async (incidentId) => {
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return;
    const m = U.modal({
      title: `Assign ${inc.code}`,
      subtitle: inc.title,
      body: `
        <div class="field"><label for="incTeam">Responding team</label>
          <select class="select" id="incTeam">${teamOptions(inc.teamId)}</select>
        </div>
        <div class="field" style="margin-top:12px"><label for="incNote">Instruction to team</label>
          <textarea class="input" id="incNote" rows="2" placeholder="Optional note sent with the assignment"></textarea>
        </div>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-save>Assign</button>`,
    });
    m.el.querySelector("[data-save]").addEventListener("click", async () => {
      const teamId = m.el.querySelector("#incTeam").value;
      const team = teamById(teamId);
      const note = m.el.querySelector("#incNote").value.trim();
      inc.teamId = teamId;
      inc.assignedTo = team?.name || "";
      inc.status = inc.status === "open" ? "acknowledged" : inc.status;
      inc.updatedAt = Date.now();
      await DB.put("incidents", inc);
      if (team) {
        await DB.put("messages", {
          id: U.randomId("msg"),
          channel: `team:${team.id}`,
          senderId: state.user.id,
          senderName: "Command Center",
          text: `Incident ${inc.code} assigned to ${team.name}. ${note || inc.title}`,
          ts: Date.now(),
          readBy: [state.user.id],
        });
        Tracking.notify("messages", { teamId: team.id });
      }
      await Auth.audit(state.user, "INCIDENT", `${inc.code} assigned to ${team?.name || "team"}`);
      m.close();
      toast(`${inc.code} assigned to ${team?.name || "team"}.`, "success", "Incident assigned");
      await refresh();
    });
  };

  /* ---------------- Messages / broadcast ---------------- */
  const renderBroadcast = () => {
    const feed = $("#broadcastFeed");
    const traffic = $("#teamTraffic");
    if (feed) {
      const command = state.messages.filter((m) => m.channel === "command").slice().reverse().slice(0, 40);
      setText("broadcastFeedCount", `${command.length} messages`);
      feed.innerHTML = command.length ? command.map((msg) => {
        const mine = msg.senderId === state.user.id;
        return `
          <div class="msg-preview">
            <div class="avatar ${mine ? "" : "green"}" style="width:28px;height:28px;font-size:9px;${mine ? "background:#251d3d;border-color:#45336b;color:var(--purple)" : ""}">${U.initials(msg.senderName || "CMD")}</div>
            <div class="mp-body">
              <div class="mp-head"><b>${esc(msg.senderName || "Field")}</b><span>${U.fmtRelative(msg.ts)}</span></div>
              <div class="mp-text">${msg.sos ? `<b style="color:var(--danger)">SOS</b> · ` : ""}${esc(msg.text)}</div>
            </div>
          </div>`;
      }).join("") : '<div class="empty">No command messages yet.</div>';
    }
    if (traffic) {
      const teamMsgs = state.messages.filter((m) => m.channel?.startsWith("team:")).slice().reverse().slice(0, 40);
      traffic.innerHTML = teamMsgs.length ? teamMsgs.map((msg) => {
        const teamId = msg.channel.split(":")[1];
        const team = teamById(teamId);
        return `
          <div class="msg-preview">
            <div class="team-avatar purple" style="width:28px;height:28px;font-size:9px">${teamMonogram(team)}</div>
            <div class="mp-body">
              <div class="mp-head"><b>${esc(msg.senderName || team?.name || "Team")}</b><span>${U.fmtRelative(msg.ts)}</span></div>
              <div class="mp-text">${esc(msg.text)}</div>
            </div>
          </div>`;
      }).join("") : '<div class="empty">No team traffic yet.</div>';
    }
  };

  const populateBroadcastChannels = () => {
    const select = $("#broadcastChannel");
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="command">Command · all teams</option>` +
      state.teams.map((t) => `<option value="team:${t.id}">${esc(t.name)} · direct</option>`).join("");
    if (current && [...select.options].some((o) => o.value === current)) select.value = current;
  };

  const sendBroadcast = async () => {
    const text = ($("#broadcastInput")?.value || "").trim();
    if (!text) { toast("Type a message before broadcasting.", "warn"); return; }
    const channel = $("#broadcastChannel")?.value || "command";
    const priority = $("#broadcastPriority")?.value || "normal";
    const message = {
      id: U.randomId("msg"),
      channel,
      senderId: state.user.id,
      senderName: "Command Center",
      text,
      priority,
      ts: Date.now(),
      readBy: [state.user.id],
      sos: priority === "emergency",
    };
    await DB.put("messages", message);
    await Auth.audit(state.user, "BROADCAST", `${priority === "normal" ? "" : priority.toUpperCase() + " "}${channel === "command" ? "All teams" : teamById(channel.split(":")[1])?.name || "team"}: ${text.slice(0, 80)}`);
    Tracking.notify("messages", { messageId: message.id });
    if ($("#broadcastInput")) $("#broadcastInput").value = "";
    setText("broadcastCount", "0 / 500 characters");
    toast("Broadcast sent to every open dashboard.", "success", "Message sent");
    await refresh();
  };

  const BROADCAST_TEMPLATES = {
    advance: "All teams, advance to your assigned waypoint and report on arrival. Maintain radio contact every 15 minutes.",
    checkin: "Check-in window is open. Send your position and status when you reach the next checkpoint.",
    weather: "Weather advisory: visibility is dropping in the upper sectors. Reduce speed, use the marked trail and confirm receipt.",
    sos: "Emergency: all available teams confirm availability to respond to an active SOS. Report ETA to command.",
  };

  /* ---------------- Reports ---------------- */
  const rangeDays = () => {
    const value = $("#reportRange")?.value || "30";
    return value === "all" ? null : Number(value);
  };

  const withinRange = (ts) => {
    const days = rangeDays();
    if (days == null) return true;
    return ts >= Date.now() - days * 86400000;
  };

  const renderReports = () => {
    const missions = state.missions.filter((m) => withinRange(m.startedAt || m.createdAt));
    const incidents = state.incidents.filter((i) => withinRange(i.ts));
    const checkins = state.checkins.filter((c) => withinRange(c.ts));
    const activeMissions = state.missions.filter((m) => m.status === "In progress").length;
    const openIncidents = state.incidents.filter((i) => i.status !== "resolved").length;
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const checkinsToday = state.checkins.filter((c) => c.ts >= todayStart).length;

    const ready = state.teams.filter((t) => t.status === "onsite" || t.status === "enroute").length;
    const readiness = state.teams.length ? Math.round((ready / state.teams.length) * 100) : 0;

    setText("reportMissions", missions.length);
    setText("reportMissionsActive", activeMissions);
    setText("reportIncidents", incidents.length);
    setText("reportIncidentsOpen", openIncidents);
    setText("reportCheckins", checkins.length);
    setText("reportCheckinsToday", checkinsToday);
    setText("reportReadiness", readiness);
    setText("reportTeamsReady", ready);

    /* Bar chart: incidents per day for the last 7 days. */
    const chart = $("#incidentTrendChart");
    if (chart) {
      const days = 7;
      const buckets = [];
      for (let i = days - 1; i >= 0; i--) {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - i);
        const start = day.getTime();
        const end = start + 86400000;
        const count = state.incidents.filter((inc) => inc.ts >= start && inc.ts < end).length;
        buckets.push({ label: new Intl.DateTimeFormat("en-PH", { weekday: "short" }).format(day), count });
      }
      const max = Math.max(1, ...buckets.map((b) => b.count));
      chart.innerHTML = buckets.map((b) => `
        <div class="bar-col">
          <span class="bv">${b.count}</span>
          <div class="bar ${b.count >= 3 ? "red" : b.count >= 2 ? "amber" : ""}" style="height:${Math.max(6, (b.count / max) * 100)}%"></div>
          <span class="bl">${b.label}</span>
        </div>`).join("");
      setText("trendHint", "Last 7 days");
    }

    /* Donut: team status mix. */
    const donut = $("#statusDonut");
    const legend = $("#statusLegend");
    if (donut && legend) {
      const colors = { onsite: "#3ddc97", enroute: "#f7bf4f", standby: "#46b8ff", sos: "#ff5a6a" };
      const counts = { onsite: 0, enroute: 0, standby: 0, sos: 0 };
      state.teams.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
      const total = state.teams.length || 1;
      let acc = 0;
      const stops = [];
      Object.entries(counts).forEach(([key, value]) => {
        if (!value) return;
        const from = (acc / total) * 100;
        acc += value;
        const to = (acc / total) * 100;
        stops.push(`${colors[key]} ${from}% ${to}%`);
      });
      donut.style.background = stops.length ? `conic-gradient(${stops.join(",")})` : "#1d3147";
      setText("donutTotal", state.teams.length);
      legend.innerHTML = Object.entries(counts).map(([key, value]) => `
        <span><i style="background:${colors[key]}"></i> ${U.statusMeta[key]?.label || key} <b>${value}</b></span>`).join("");
    }

    /* Summary table. */
    const body = $("#reportSummaryRows");
    if (body) {
      const statuses = ["In progress", "Monitoring", "Planned", "Completed"];
      body.innerHTML = statuses.map((status) => {
        const set = state.missions.filter((m) => m.status === status);
        const avg = set.length ? Math.round(set.reduce((s, m) => s + (m.progress || 0), 0) / set.length) : 0;
        const mix = ["Critical", "High", "Medium", "Low"]
          .map((p) => `${p.slice(0, 1)}:${set.filter((m) => m.priority === p).length}`).join(" · ");
        return `<tr>
          <td class="strong">${status}</td>
          <td>${set.length}</td>
          <td>${set.length ? avg + "%" : "—"}</td>
          <td class="tiny mono">${set.length ? mix : "—"}</td>
        </tr>`;
      }).join("");
    }
  };

  /* ---------------- Audit ---------------- */
  const renderAudit = () => {
    const body = $("#auditRows");
    if (!body) return;
    const query = ($("#auditSearch")?.value || "").trim().toLowerCase();
    const action = $("#auditActionFilter")?.value || "";
    const list = state.audit.filter((a) => {
      if (action && a.action !== action) return false;
      if (!query) return true;
      return [a.actorName, a.action, a.detail].some((v) => String(v || "").toLowerCase().includes(query));
    });
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="4"><div class="empty">No audit entries match this filter.</div></td></tr>';
      return;
    }
    const actionBadge = (a) => {
      if (a === "LOGIN" || a === "LOGOUT" || a === "REGISTER") return "badge-blue";
      if (a === "SOS") return "badge-red";
      if (a === "BROADCAST") return "badge-purple";
      if (a === "MISSION") return "badge-amber";
      return "badge-muted";
    };
    body.innerHTML = list.slice(0, 200).map((a) => `
      <tr>
        <td class="mono tiny">${U.fmtDateTime(a.ts)}<div class="e" style="font-size:9px;color:var(--muted-2)">${U.fmtRelative(a.ts)}</div></td>
        <td>${esc(a.actorName || "System")}</td>
        <td><span class="badge ${actionBadge(a.action)}">${esc(a.action)}</span></td>
        <td>${esc(a.detail || "")}</td>
      </tr>`).join("");
  };

  /* ---------------- Exports ---------------- */
  const exportMissions = () => {
    const rows = state.missions.map((m) => ({
      code: m.code, name: m.name, status: m.status, priority: m.priority, type: m.type,
      sector: m.sector, lead: m.lead, team: teamById(m.teamId)?.name || "", progress: m.progress,
      startedAt: new Date(m.startedAt || m.createdAt).toISOString(),
    }));
    U.download(`resqcoord-missions-${Date.now()}.csv`, U.toCSV(rows), "text/csv");
    markExport();
  };

  const exportPersonnel = () => {
    const rows = state.users.map((u) => ({
      name: u.name, email: u.email, role: u.role, title: u.title, team: u.team,
      responderId: u.responderId, status: u.status, phone: u.phone || "",
      lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString() : "",
    }));
    U.download(`resqcoord-personnel-${Date.now()}.csv`, U.toCSV(rows), "text/csv");
    markExport();
  };

  const exportIncidents = () => {
    const rows = state.incidents.map((i) => ({
      code: i.code, title: i.title, type: i.type, severity: i.severity, status: i.status,
      sector: i.sector, reporter: i.reporterName, team: teamById(i.teamId)?.name || "",
      description: i.description, reportedAt: new Date(i.ts).toISOString(),
    }));
    U.download(`resqcoord-incidents-${Date.now()}.csv`, U.toCSV(rows), "text/csv");
    markExport();
  };

  const exportAudit = () => {
    const rows = state.audit.map((a) => ({
      time: new Date(a.ts).toISOString(), actor: a.actorName, action: a.action, detail: a.detail,
    }));
    U.download(`resqcoord-activity-${Date.now()}.csv`, U.toCSV(rows), "text/csv");
    markExport();
  };

  const exportJson = async () => {
    const snapshot = await DB.exportAll();
    snapshot.exportedBy = state.user.email;
    U.download(`resqcoord-backup-${Date.now()}.json`, JSON.stringify(snapshot, null, 2), "application/json");
    await Auth.audit(state.user, "DATA", "Downloaded full database backup");
    markExport();
    toast("Database backup downloaded.", "success", "Backup ready");
    await refresh();
  };

  const markExport = () => {
    state.lastExport = Date.now();
    setText("settingsLastExport", U.fmtDateTime(state.lastExport));
  };

  const resetData = async () => {
    const ok = await U.confirm({
      title: "Reset demo database?",
      message: "All local missions, incidents, messages, accounts and positions will be replaced with the seeded demo data.",
      confirmText: "Reset everything",
      danger: true,
    });
    if (!ok) return;
    await DB.reset();
    await Auth.audit(state.user, "DATA", "Reset demo database to seed state");
    state.selectedTeamId = null;
    state.route = null;
    toast("Demo database restored.", "success", "Data reset");
    await refresh();
    populateBroadcastChannels();
  };

  /* ---------------- Settings ---------------- */
  const bindSettings = () => {
    $$(".settings-nav button").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".settings-nav button").forEach((b) => b.classList.toggle("active", b === button));
        const target = `#settings-${button.dataset.settings}`;
        const el = $(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    $("#adminProfileForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = await Auth.updateProfile({
        name: $("#setName").value.trim(),
        phone: $("#setPhone").value.trim(),
        title: $("#setTitle").value.trim(),
        org: $("#setOrg").value.trim(),
      });
      if (result.ok) {
        state.user = result.user;
        renderIdentity();
        toast("Profile updated.", "success", "Saved");
      } else {
        toast(result.error, "error");
      }
    });

    $("#adminPasswordForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = await Auth.changePassword($("#curPass").value, $("#newPass").value, $("#confPass").value);
      if (result.ok) {
        event.target.reset();
        toast("Password changed.", "success", "Security updated");
      } else {
        toast(result.error, "error");
      }
    });

    if ($("#setSimulation")) $("#setSimulation").checked = state.system.simulation;
    if ($("#setSosSound")) $("#setSosSound").checked = state.system.sosSound;
    if ($("#setStrictCheckin")) $("#setStrictCheckin").checked = state.system.strictCheckin;
    if ($("#setAccuracy")) $("#setAccuracy").checked = state.system.accuracy;

    $("#saveSystemBtn")?.addEventListener("click", async () => {
      state.system = {
        simulation: $("#setSimulation").checked,
        sosSound: $("#setSosSound").checked,
        strictCheckin: $("#setStrictCheckin").checked,
        accuracy: $("#setAccuracy").checked,
      };
      saveSystem();
      await Auth.audit(state.user, "SETTINGS", "System preferences updated");
      toast("System settings saved.", "success");
    });

    $("#exportJsonBtn2")?.addEventListener("click", exportJson);
    $("#resetDataBtn")?.addEventListener("click", resetData);
  };

  /* ---------------- System data panel ---------------- */
  const renderSystemInfo = async () => {
    const counts = await Promise.all(Object.keys(DB.STORES).map((s) => DB.count(s)));
    const total = counts.reduce((a, b) => a + b, 0);
    setText("settingsDbRecords", `${total} records`);
    setText("settingsLastExport", state.lastExport ? U.fmtDateTime(state.lastExport) : "Never");
  };

  /* ---------------- SOS sound ---------------- */
  const playSosTone = () => {
    if (!state.system.sosSound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 880;
      gain.gain.value = 0.05;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.frequency.setValueAtTime(620, ctx.currentTime + 0.25);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.5);
      setTimeout(() => { osc.stop(); ctx.close(); }, 800);
    } catch {
      /* audio blocked */
    }
  };

  /* ---------------- Navigation ---------------- */
  const viewTitles = {
    overview: "Overview",
    map: "Command Map",
    missions: "Missions",
    personnel: "Personnel",
    incidents: "Incidents",
    messages: "Broadcast",
    reports: "Reports",
    audit: "Activity Log",
    settings: "Settings",
  };

  const switchView = (view) => {
    if (!$(`#view-${view}`)) return;
    $$(".view").forEach((section) => section.classList.toggle("active", section.id === `view-${view}`));
    $$(".nav-item[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    setText("crumb", viewTitles[view] || view);
    state.views[view] = true;

    if (view === "overview") setTimeout(() => state.maps.overview?.invalidate(), 120);
    if (view === "map") setTimeout(() => {
      state.maps.admin?.invalidate();
      renderTeamList();
      updateTeamDetail();
      if (state.selectedTeamId) focusSelectedTeam(14);
    }, 120);
    if (view === "missions") renderMissions();
    if (view === "personnel") { renderPersonnel(); renderTeamRoster(); }
    if (view === "incidents") renderIncidents();
    if (view === "messages") { populateBroadcastChannels(); renderBroadcast(); }
    if (view === "reports") renderReports();
    if (view === "audit") renderAudit();
    if (view === "settings") renderSystemInfo();
    if (window.innerWidth <= 1080) $("#app")?.classList.remove("sidebar-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bindNavigation = () => {
    $$(".nav-item[data-view]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.view));
    });
    $$("[data-view-link]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.viewLink));
    });
    $("#sidebarToggle")?.addEventListener("click", () => $("#app")?.classList.toggle("sidebar-open"));
    $("#sideUser")?.addEventListener("click", () => switchView("settings"));
    $("#sideUser")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); switchView("settings"); }
    });
  };

  const bindActions = () => {
    document.addEventListener("click", async (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (actionEl) {
        const action = actionEl.dataset.action;
        if (action === "newMission") openMissionModal();
        if (action === "addPersonnel") openPersonnelModal();
        if (action === "broadcast") { switchView("messages"); setTimeout(() => $("#broadcastInput")?.focus(), 250); }
        if (action === "logout") {
          const ok = await U.confirm({ title: "Sign out?", message: "You will need your email and password to sign back in.", confirmText: "Sign out", danger: true });
          if (ok) await Auth.logout("../admin/login.html");
        }
        return;
      }

      const teamEl = event.target.closest("[data-team-id]");
      if (teamEl && !event.target.closest("[data-alert-action]")) {
        selectTeam(teamEl.dataset.teamId);
        return;
      }

      const alertEl = event.target.closest("[data-alert-action]");
      if (alertEl) {
        const kind = alertEl.dataset.alertAction;
        if (kind === "sos" || kind === "team") selectTeam(alertEl.dataset.teamId, { jump: true });
        if (kind === "incident") { switchView("incidents"); }
        return;
      }

      const missionView = event.target.closest("[data-mission-view]");
      if (missionView) { openMissionDetail(missionView.dataset.missionView); return; }
      const missionEdit = event.target.closest("[data-mission-edit]");
      if (missionEdit) {
        const m = state.missions.find((x) => x.id === missionEdit.dataset.missionEdit);
        if (m) openMissionModal(m);
        return;
      }
      const missionAdvance = event.target.closest("[data-mission-advance]");
      if (missionAdvance) { await advanceMission(missionAdvance.dataset.missionAdvance); return; }

      const userToggle = event.target.closest("[data-user-toggle]");
      if (userToggle) { await toggleUser(userToggle.dataset.userToggle); return; }
      const userEdit = event.target.closest("[data-user-edit]");
      if (userEdit) {
        const u = state.users.find((x) => x.id === userEdit.dataset.userEdit);
        if (u) openPersonnelModal(u);
        return;
      }
      const userDelete = event.target.closest("[data-user-delete]");
      if (userDelete) { await deleteUser(userDelete.dataset.userDelete); return; }

      const incStatus = event.target.closest("[data-incident-status]");
      if (incStatus) { await setIncidentStatus(incStatus.dataset.incidentId, incStatus.dataset.incidentStatus); return; }
      const incLocate = event.target.closest("[data-incident-locate]");
      if (incLocate) {
        const inc = state.incidents.find((x) => x.id === incLocate.dataset.incidentLocate);
        if (inc) { switchView("map"); setTimeout(() => state.maps.admin?.focus(inc.lat, inc.lng, 16), 220); }
        return;
      }
      const incAssign = event.target.closest("[data-incident-assign]");
      if (incAssign) { await assignIncidentTeam(incAssign.dataset.incidentAssign); return; }

      const template = event.target.closest("[data-template]");
      if (template) {
        const text = BROADCAST_TEMPLATES[template.dataset.template];
        if (text && $("#broadcastInput")) {
          $("#broadcastInput").value = text;
          setText("broadcastCount", `${text.length} / 500 characters`);
        }
        return;
      }
    });

    $("#broadcastForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      await sendBroadcast();
    });
    $("#broadcastInput")?.addEventListener("input", (event) => {
      setText("broadcastCount", `${event.target.value.length} / 500 characters`);
    });

    $("#fitTeamsBtn")?.addEventListener("click", () => {
      state.maps.admin?.fitTeams();
      toast("Map fitted to all tracked teams.", "info");
    });
    $("#toggleTrailsBtn")?.addEventListener("click", async () => {
      state.showTrails = !state.showTrails;
      $("#toggleTrailsBtn")?.classList.toggle("active", state.showTrails);
      if (state.showTrails) await refreshSelectedTrail();
      else clearTrail();
      toast(state.showTrails ? "Trails on for the selected team." : "Trails hidden.", "info");
    });
    $("#detailFocus")?.addEventListener("click", () => {
      const team = teamById(state.selectedTeamId);
      if (team) state.maps.admin?.focus(team.lat, team.lng, 16);
    });
    $("#detailTrail")?.addEventListener("click", refreshSelectedTrail);
    $("#detailClearTrail")?.addEventListener("click", clearTrail);
    $("#detailSos")?.addEventListener("click", async () => {
      const team = teamById(state.selectedTeamId);
      if (!team) return;
      if (team.status !== "sos") { toast(`${team.name} is not in an SOS state.`, "info"); return; }
      await Tracking.clearSos(team.id, state.user);
      toast(`SOS cleared for ${team.name}.`, "success", "Emergency cleared");
      await refresh();
    });
    $("#assignRouteBtn")?.addEventListener("click", assignRoute);
    $("#clearRouteBtn")?.addEventListener("click", () => {
      state.route = null;
      state.routeTeamId = null;
      state.maps.admin?.clearRoute();
      setText("assignResult", "Routes are drawn on the command map.");
    });

    ["#teamSearch", "#teamFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderTeamList);
      $(sel)?.addEventListener("change", renderTeamList);
    });
    ["#missionSearch", "#missionStatusFilter", "#missionPriorityFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderMissions);
      $(sel)?.addEventListener("change", renderMissions);
    });
    ["#personnelSearch", "#personnelRoleFilter", "#personnelStatusFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderPersonnel);
      $(sel)?.addEventListener("change", renderPersonnel);
    });
    ["#incidentSearch", "#incidentSeverityFilter", "#incidentStatusFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderIncidents);
      $(sel)?.addEventListener("change", renderIncidents);
    });
    ["#auditSearch", "#auditActionFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderAudit);
      $(sel)?.addEventListener("change", renderAudit);
    });
    $("#reportRange")?.addEventListener("change", renderReports);

    $$(".map-tool[data-layer]").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".map-tool[data-layer]").forEach((b) => b.classList.toggle("active", b === button));
        state.maps.admin?.setBaseLayer(button.dataset.layer);
      });
    });
    $("#sectorsToggle")?.addEventListener("click", () => {
      const visible = state.maps.admin?.toggleSectors();
      $("#sectorsToggle")?.classList.toggle("active", !!visible);
    });

    ["exportMissionsBtn", "exportMissionsBtn2"].forEach((id) => $(`#${id}`)?.addEventListener("click", exportMissions));
    ["exportPersonnelBtn", "exportPersonnelBtn2"].forEach((id) => $(`#${id}`)?.addEventListener("click", exportPersonnel));
    ["exportIncidentsBtn", "exportIncidentsBtn2"].forEach((id) => $(`#${id}`)?.addEventListener("click", exportIncidents));
    ["exportAuditBtn", "exportAuditBtn2"].forEach((id) => $(`#${id}`)?.addEventListener("click", exportAudit));
    $("#exportAllDataBtn")?.addEventListener("click", exportJson);
    $("#exportJsonBtn")?.addEventListener("click", exportJson);
  };

  /* ---------------- Clock / network ---------------- */
  const updateClock = () => {
    const time = `${U.fmtTime()} PHT`;
    clockIds.forEach((id) => setText(id, time));
  };

  const updateNetwork = () => {
    const online = navigator.onLine;
    const status = $("#netStatus");
    if (status) {
      status.classList.toggle("offline", !online);
      status.innerHTML = `<span class="dot"></span> ${online ? "Online" : "Offline"}`;
    }
    $("#offlineBanner")?.classList.toggle("show", !online);
  };

  /* ---------------- Refresh loop ---------------- */
  const refresh = async () => {
    if (!state.ready) return;
    try {
      await reload();
      renderOverview();
      renderAlerts();
      renderOverviewTeams();
      renderOverviewMissions();
      renderOverviewActivity();
      renderMarkers();
      renderTeamList();
      updateTeamDetail();
      if (state.views.missions) renderMissions();
      if (state.views.personnel) { renderPersonnel(); renderTeamRoster(); }
      if (state.views.incidents) renderIncidents();
      if (state.views.messages) renderBroadcast();
      if (state.views.reports) renderReports();
      if (state.views.audit) renderAudit();
      setSync();
    } catch (err) {
      console.warn("[ResQCoord] Admin refresh failed", err);
    }
  };

  const startTimers = () => {
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(refresh, 3200);
    setInterval(() => {
      if (state.views.settings) renderSystemInfo();
    }, 15000);

    Tracking.subscribe((event) => {
      if (!["teams", "messages", "checkins", "sos", "incidents", "missions"].includes(event.type)) return;
      if (event.type === "sos") {
        playSosTone();
        U.toast("An SOS was activated. Open the live map or incident triage.", { type: "warn", title: "Emergency alert" });
      }
      setTimeout(refresh, 250);
    });

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        state.maps.overview?.invalidate();
        state.maps.admin?.invalidate();
        refresh();
      }
    });
  };

  /* ---------------- Boot ---------------- */
  const boot = async () => {
    const user = await Auth.guard("admin");
    if (!user) return;
    state.user = user;
    loadSystem();
    await reload();
    renderIdentity();
    renderOverview();
    renderAlerts();
    renderOverviewTeams();
    renderOverviewMissions();
    renderOverviewActivity();
    renderMissions();
    renderPersonnel();
    renderTeamRoster();
    renderIncidents();
    renderAudit();
    renderReports();
    populateBroadcastChannels();
    populateAssignTargets();
    renderBroadcast();
    bindNavigation();
    bindActions();
    bindSettings();
    updateNetwork();

    initMaps();
    renderMarkers();

    if (state.teams.length) selectTeam(state.teams[0].id, { jump: false });
    state.ready = true;
    setSync();
    renderSystemInfo();

    await Tracking.startSimulation({
      intervalMs: 2600,
      onTick: (teams) => {
        if (!state.ready) return;
        state.teams = teams.sort((a, b) => a.name.localeCompare(b.name));
        renderMarkers();
        renderTeamList();
        updateTeamDetail();
      },
    });

    U.toast(`Signed in as ${user.name}. Command view is live.`, { title: "Command dashboard ready", type: "success" });
    console.info("[ResQCoord] Admin dashboard ready.", { db: DB.mode, teams: state.teams.length, missions: state.missions.length });
  };

  boot().catch((err) => {
    console.error("[ResQCoord] Failed to start the admin dashboard", err);
    U.toast("The command dashboard could not start. Check the browser console for details.", "error");
  });
})();
