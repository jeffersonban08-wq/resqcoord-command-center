/* ============================================================
   ResQCoord — user-app.js
   Field responder dashboard: mission, live map, GPS, routing,
   messages, incidents, check-ins, SOS and settings.
   ============================================================ */
"use strict";

(() => {
  const $ = U.qs;
  const state = {
    user: null,
    team: null,
    teams: [],
    mission: null,
    settings: null,
    messages: [],
    incidents: [],
    maps: { mini: null, full: null },
    activeThread: "command",
    route: null,
    routeTargets: [],
    routeFollow: null,
    picking: false,
    ready: false,
    lastSync: Date.now(),
    msgSig: "",
    follow: true,
    navigation: null,
  };

  const clockIds = ["clock", "missionClock", "mapClock", "msgClock", "incidentClock", "settingsClock"];

  const intervalMinutes = () => state.settings?.checkinMinutes || 15;

  const statusLabel = (status) => U.statusMeta[status]?.label || "On site";

  const visibleMessages = () => {
    const channels = ["command"];
    if (state.team?.id) channels.push(`team:${state.team.id}`);
    return state.messages.filter((m) => channels.includes(m.channel));
  };

  const isUnread = (message) => !(message.readBy || []).includes(state.user?.id);
  const unreadCount = () => visibleMessages().filter(isUnread).length;

  const setSync = () => {
    state.lastSync = Date.now();
    const text = `Synced ${U.fmtTimeSec(state.lastSync)}`;
    if ($("#lastSync")) $("#lastSync").textContent = text;
    if ($("#footerSync")) $("#footerSync").textContent = text;
  };

  /* ---------------- Data ---------------- */
  const reload = async () => {
    const [teams, missions, messages, incidents, checkins, settings] = await Promise.all([
      DB.getAll("teams"),
      DB.getAll("missions"),
      DB.getAll("messages"),
      DB.getAll("incidents"),
      DB.byIndex("checkins", "userId", state.user.id),
      DB.get("settings", state.user.id),
    ]);
    state.teams = teams;
    state.settings = settings || {
      shareLocation: true,
      backgroundTracking: true,
      checkinMinutes: 15,
      notifications: { sos: true, checkin: true, messages: true, weather: true },
    };
    state.team =
      teams.find((t) => t.id === state.user.teamId) ||
      teams.find((t) => t.name === state.user.team) ||
      teams[0];
    if (state.team) state.user.teamId = state.team.id;

    state.mission =
      missions.find((m) => m.teamId === state.team?.id && m.status !== "Completed") ||
      missions.find((m) => m.id === state.team?.missionId) ||
      missions.find((m) => m.status === "In progress") ||
      null;

    state.messages = messages.sort((a, b) => a.ts - b.ts);
    state.incidents = incidents.sort((a, b) => b.ts - a.ts);
    state.checkins = checkins.sort((a, b) => b.ts - a.ts);
    return { checkins };
  };

  /* ---------------- Identity ---------------- */
  const renderIdentity = () => {
    const u = state.user;
    const initials = U.initials(u.name);
    ["sidebarName", "topName", "settingsName"].forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = u.name;
    });
    ["sidebarRole", "settingsRole"].forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = u.title || `Field Responder · ${u.team}`;
    });
    if ($("#topRole")) $("#topRole").textContent = u.role === "admin" ? "Administrator" : "Field Responder";
    ["sidebarAvatar", "topAvatar", "settingsAvatar"].forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = initials;
    });
    if ($("#settingsResponderId")) $("#settingsResponderId").textContent = u.responderId || "—";
    if ($("#profName")) $("#profName").value = u.name || "";
    if ($("#profPhone")) $("#profPhone").value = u.phone || "";
    if ($("#profEmail")) $("#profEmail").value = u.email || "";
    if ($("#profTeam")) $("#profTeam").value = state.team?.name || u.team || "";
    if ($("#profOrg")) $("#profOrg").value = u.org || "";
    if ($("#profCert")) $("#profCert").value = u.cert || "";
    if ($("#profTitle")) $("#profTitle").value = u.title || "";
    if ($("#autoReporter")) $("#autoReporter").textContent = `${u.name} · ${u.title || "Field responder"}`;
    if ($("#autoTeam")) $("#autoTeam").textContent = state.team?.name || u.team || "—";
    if ($("#autoMission")) $("#autoMission").textContent = state.mission?.code || "—";
    if ($("#storageMode")) $("#storageMode").textContent = DB.mode === "idb" ? "IndexedDB (local)" : "localStorage fallback";
    if ($("#dataMode")) $("#dataMode").textContent = DB.mode === "idb" ? "IndexedDB" : "localStorage";
  };

  /* ---------------- Dashboard ---------------- */
  const renderDashboard = () => {
    const team = state.team;
    const mission = state.mission;
    if (!team) return;

    const meta = U.statusMeta[team.status] || U.statusMeta.onsite;
    const last = team.lastCheckin || Date.now();
    const interval = intervalMinutes();
    const due = last + interval * 60000;
    const diffMin = Math.round((due - Date.now()) / 60000);
    const dueText = `${U.fmtTime(due)} PHT`;
    const remaining =
      diffMin > 0 ? `${diffMin} min` : diffMin === 0 ? "due now" : `${Math.abs(diffMin)} min overdue`;

    const setText = (id, value) => {
      const el = $(`#${id}`);
      if (el) el.textContent = value;
    };
    setText("dashSub", `${team.name} · ${team.sector || "Mt. Lantin"}`);
    setText("statusValue", statusLabel(team.status));
    setText("kpiStatus", statusLabel(team.status));
    setText("kpiTeam", team.members || 1);
    setText("kpiTeamName", team.name);
    setText("kpiAccuracy", `±${team.accuracy || 8} m`);
    setText("heroTeam", `${team.name} · ${team.members || 1}`);
    setText("heroMission", mission?.name || "No active mission");
    setText("heroLastCheckin", team.lastCheckin ? U.fmtRelative(team.lastCheckin) : "—");
    setText("nextCheckin", `${U.fmtTime(due)} · ${remaining}`);
    setText("checkinDue", dueText);
    setText("kpiCheckin", U.fmtTime(due));
    setText("kpiCheckinIn", remaining);

    const dot = $("#statusValue")?.parentElement?.querySelector(".dot-big");
    if (dot) {
      dot.style.background = meta.css === "sos" ? "var(--danger)" : meta.css === "enroute" ? "var(--warn)" : meta.css === "standby" ? "var(--accent-2)" : "var(--accent)";
    }
    const select = $("#statusSelect");
    if (select) {
      if (team.status === "sos") {
        select.value = "onsite";
        select.disabled = true;
        select.title = "Clear the SOS alert first";
      } else {
        select.disabled = false;
        select.value = team.status;
      }
    }

    if (mission) {
      const done = (mission.checkpoints || []).filter((c) => c.done).length;
      const total = (mission.checkpoints || []).length || 1;
      setText("kpiProgress", mission.progress ?? Math.round((done / total) * 100));
      setText("kpiSector", mission.sector || "N-2");
      setText("dashMissionStatus", mission.status);
      setText("dashMissionCode", mission.code);
      setText("dashMissionTitle", mission.name);
      setText("dashMissionSector", `${mission.type} · Sector ${mission.sector}`);
      setText("dashMissionPct", `${mission.progress ?? 0}%`);
      setText("dashMissionLead", mission.lead || "—");
      setText("dashMissionCp", `${done} of ${total} reached`);
      setText("dashMissionNext", mission.checkpoints?.find((c) => !c.done)?.name || "All checkpoints cleared");
      const bar = $("#dashMissionBar");
      if (bar) bar.style.width = `${mission.progress ?? 0}%`;
    }

    renderMiniMessages();
    renderTeamList();
    renderRecentReports();
    updateUnread();
    if ($("#autoAccuracy")) $("#autoAccuracy").textContent = `±${team.accuracy || 8} m`;
    if ($("#autoTime")) $("#autoTime").textContent = `${U.fmtTime()} PHT`;
  };

  const renderMiniMessages = () => {
    const wrap = $("#dashMessages");
    if (!wrap) return;
    const recent = visibleMessages().slice(-3).reverse();
    if (!recent.length) {
      wrap.innerHTML = `<div class="empty">No messages yet. Command will reach you here.</div>`;
      return;
    }
    wrap.innerHTML = recent
      .map(
        (m) => `
        <div class="msg-preview">
          <div class="avatar avatar-sm ${m.sos ? "red" : "green"}">${U.initials(m.senderName)}</div>
          <div class="mp-body">
            <div class="mp-head"><b>${U.escapeHtml(m.senderName)}</b><time>${U.fmtTime(m.ts)}</time></div>
            <div class="mp-text">${U.escapeHtml(m.text)}</div>
          </div>
        </div>`
      )
      .join("");
  };

  const renderTeamList = () => {
    const wrap = $("#dashTeam");
    if (!wrap) return;
    const related = state.teams
      .filter((t) => t.id !== state.team?.id)
      .slice(0, 4);
    const rows = [
      `<div class="list-row">
        <div class="team-avatar green">${U.escapeHtml(state.team?.short || "TA")}</div>
        <div class="meta">
          <div class="name">${U.escapeHtml(state.team?.name || "Team Alpha")} <span class="badge badge-green" style="font-size:8.5px;height:18px">You</span></div>
          <div class="sub">${U.escapeHtml(state.team?.lead || "—")} · ${state.team?.members || 0} personnel</div>
        </div>
        <span class="badge ${U.statusMeta[state.team?.status]?.badge || "badge-green"}">${statusLabel(state.team?.status)}</span>
      </div>`,
      ...related.map(
        (t) => `
        <div class="list-row">
          <div class="team-avatar ${t.status === "sos" ? "red" : t.status === "enroute" ? "amber" : "purple"}">${U.escapeHtml(t.short)}</div>
          <div class="meta">
            <div class="name">${U.escapeHtml(t.name)}</div>
            <div class="sub">${U.escapeHtml(t.sector || t.kind)} · ${t.members} personnel</div>
          </div>
          <span class="badge ${U.statusMeta[t.status]?.badge}">${statusLabel(t.status)}</span>
        </div>`
      ),
    ];
    wrap.innerHTML = rows.join("");
    if ($("#dashTeamMeta")) $("#dashTeamMeta").textContent = `${state.teams.length} units deployed`;
  };

  /* ---------------- Mission ---------------- */
  const renderMission = () => {
    const mission = state.mission;
    if (!mission) {
      if ($("#missionTitle")) $("#missionTitle").textContent = "No active mission";
      return;
    }
    const setText = (id, value) => {
      const el = $(`#${id}`);
      if (el) el.textContent = value;
    };
    setText("missionBadge", mission.status);
    setText("missionSub", `Assigned mission · ${mission.name}`);
    setText("missionCode", mission.code);
    setText("missionTitle", mission.name);
    setText("missionType", `Priority: ${mission.priority} · ${mission.type} · Sector ${mission.sector}`);
    setText("missionSector", mission.sector);
    setText("missionPct", `${mission.progress}%`);
    setText("missionDispatched", `Dispatched ${U.fmtTime(mission.startedAt)} PHT`);
    setText("briefSubjects", mission.subjects);
    setText("briefLastSeen", mission.lastSeen);
    setText("briefWeather", mission.weather);
    setText("briefHazards", mission.hazards);
    setText("briefLead", mission.lead);
    setText("briefTeam", state.team?.name || "—");
    setText("briefDescription", mission.description);

    const elapsedMin = Math.max(0, Math.round((Date.now() - mission.startedAt) / 60000));
    setText("missionElapsed", `${Math.floor(elapsedMin / 60)}h ${U.pad(elapsedMin % 60)}m`);
    const done = (mission.checkpoints || []).filter((c) => c.done).length;
    const total = (mission.checkpoints || []).length || 1;
    setText("missionCells", `${Math.round((mission.progress / 100) * 10) || 0} of 10 grid cells cleared`);
    setText("cpSummary", `${done} of ${total} reached`);
    const bar = $("#missionBar");
    if (bar) bar.style.width = `${mission.progress}%`;

    const tl = $("#missionTimeline");
    if (tl) {
      tl.innerHTML = (mission.timeline || [])
        .map(
          (item) => `
          <div class="tl-item">
            <div class="tl-time">${U.escapeHtml(item.t)}</div>
            <div class="tl-text">${U.escapeHtml(item.text)}</div>
          </div>`
        )
        .join("");
    }

    const cp = $("#missionCheckpoints");
    if (cp) {
      cp.innerHTML = (mission.checkpoints || [])
        .map((c, i) => {
          const cls = c.done ? "done" : c.next ? "next" : "";
          return `
            <div class="checkpoint ${cls}">
              <div class="cp-dot">${c.done ? "✓" : i + 1}</div>
              <div class="grow">
                <div class="cp-name">${U.escapeHtml(c.name)} <span class="muted-2" style="font-weight:400;font-size:10.5px">· ${U.escapeHtml(c.detail)}</span></div>
                <div class="cp-meta">${U.escapeHtml(c.time)}${c.done ? " · reached" : ""}</div>
              </div>
              ${c.done ? "" : `<button class="btn btn-sm" data-checkpoint="${i}">Mark reached</button>`}
            </div>`;
        })
        .join("");
    }

    const grid = $("#sectorGrid");
    if (grid) {
      const cleared = Math.max(0, Math.min(10, Math.round((mission.progress / 100) * 10)));
      grid.innerHTML = Array.from({ length: 10 })
        .map((_, i) => {
          const cls = i < cleared ? "cleared" : i === cleared ? "active" : "";
          return `<div class="sector-cell ${cls}">${i + 1}</div>`;
        })
        .join("");
    }
  };

  const completeCheckpoint = async (index) => {
    const mission = state.mission;
    if (!mission?.checkpoints?.[index]) return;
    const checkpoint = mission.checkpoints[index];
    if (checkpoint.done) return;
    checkpoint.done = true;
    checkpoint.time = `${U.fmtTime()} PHT`;
    checkpoint.next = false;
    const next = mission.checkpoints.find((c) => !c.done);
    if (next) next.next = true;
    const done = mission.checkpoints.filter((c) => c.done).length;
    mission.progress = Math.round((done / mission.checkpoints.length) * 100);
    mission.timeline = mission.timeline || [];
    mission.timeline.push({ t: U.fmtTime(), text: `Checkpoint reached: ${checkpoint.name}` });
    mission.updatedAt = Date.now();
    await DB.put("missions", mission);
    await Auth.audit(state.user, "CHECKPOINT", `${mission.code}: ${checkpoint.name}`);
    Tracking.notify("missions", { missionId: mission.id });
    U.toast(`${checkpoint.name} marked as reached.`, "success");
    renderMission();
    renderDashboard();
  };

  /* ---------------- Messages ---------------- */
  const threadDefs = () => {
    const threads = [
      {
        id: "command",
        name: "Command Center",
        sub: "Broadcast · all teams",
        avatar: "C",
        cls: "green",
        messages: state.messages.filter((m) => m.channel === "command"),
      },
    ];
    if (state.team?.id) {
      threads.push({
        id: `team:${state.team.id}`,
        name: state.team.name,
        sub: `Team channel · ${state.team.members} personnel`,
        avatar: state.team.short || "TA",
        cls: "green",
        messages: state.messages.filter((m) => m.channel === `team:${state.team.id}`),
      });
    }
    return threads;
  };

  const renderMessages = () => {
    const threads = threadDefs();
    const list = $("#threadList");
    if (list) {
      list.innerHTML = threads
        .map((t) => {
          const last = t.messages[t.messages.length - 1];
          const unread = t.messages.filter(isUnread).length;
          return `
            <div class="msg-thread ${state.activeThread === t.id ? "active" : ""}" data-thread="${U.escapeHtml(t.id)}">
              <div class="avatar avatar-sm ${t.cls}">${U.escapeHtml(t.avatar)}</div>
              <div class="meta">
                <div class="name">${U.escapeHtml(t.name)} <time>${last ? U.fmtTime(last.ts) : ""}</time></div>
                <div class="preview">${last ? U.escapeHtml(last.text) : "No messages yet"}</div>
              </div>
              ${unread ? `<span class="unread"></span>` : ""}
            </div>`;
        })
        .join("");
    }

    const thread = threads.find((t) => t.id === state.activeThread) || threads[0];
    if (!thread) return;
    state.activeThread = thread.id;
    if ($("#chatTitle")) $("#chatTitle").textContent = thread.name;
    if ($("#chatSub")) $("#chatSub").textContent = thread.sub;
    if ($("#chatAvatar")) {
      $("#chatAvatar").textContent = thread.avatar;
      $("#chatAvatar").className = `avatar ${thread.cls}`;
    }

    const signature = `${thread.id}:${thread.messages.map((m) => `${m.id}${m.ts}`).join("|")}`;
    if (signature === state.msgSig) {
      updateUnread();
      return;
    }
    state.msgSig = signature;

    const body = $("#chatBody");
    if (!body) return;
    if (!thread.messages.length) {
      body.innerHTML = `<div class="empty">No messages in this channel yet. Say hello to command.</div>`;
    } else {
      body.innerHTML =
        `<div class="chat-date">Today · ${U.fmtDate()}</div>` +
        thread.messages
          .map((m) => {
            const me = m.senderId === state.user.id;
            return `
              <div class="bubble ${me ? "me" : ""}">
                <div class="sender">${U.escapeHtml(me ? "You" : m.senderName)}</div>
                <div class="text">${U.escapeHtml(m.text).replace(/\n/g, "<br>")}</div>
                <div class="at">${U.fmtTime(m.ts)} PHT${m.sos ? " · SOS" : ""}</div>
              </div>`;
          })
          .join("");
      body.scrollTop = body.scrollHeight;
    }
    updateUnread();
  };

  const updateUnread = () => {
    const count = unreadCount();
    const badge = $("#msgUnread");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count ? "grid" : "none";
    }
  };

  const markThreadRead = async (threadId) => {
    const affected = state.messages.filter(
      (m) => m.channel === threadId && !(m.readBy || []).includes(state.user.id)
    );
    for (const message of affected) {
      message.readBy = [...(message.readBy || []), state.user.id];
      await DB.put("messages", message);
    }
    if (affected.length) Tracking.notify("messages", { read: true });
    updateUnread();
  };

  const openThread = async (id) => {
    state.activeThread = id;
    state.msgSig = "";
    await markThreadRead(id);
    renderMessages();
    renderMiniMessages();
  };

  const sendMessage = async (text) => {
    const clean = text.trim();
    if (!clean) return;
    const message = {
      id: U.randomId("msg"),
      channel: state.activeThread,
      senderId: state.user.id,
      senderName: state.team ? `${state.user.name} · ${state.team.name}` : state.user.name,
      text: clean.slice(0, 600),
      ts: Date.now(),
      readBy: [state.user.id],
    };
    await DB.put("messages", message);
    state.messages.push(message);
    await Auth.audit(state.user, "MESSAGE", `Sent a message on ${message.channel}`);
    Tracking.notify("messages", { messageId: message.id });
    state.msgSig = "";
    renderMessages();
    renderMiniMessages();
    U.toast("Message sent on the secure channel.", "success");
  };

  /* ---------------- Incidents ---------------- */
  const renderRecentReports = () => {
    const wrap = $("#recentReports");
    if (!wrap) return;
    const rows = state.incidents
      .filter((i) => i.teamId === state.team?.id || i.reporterId === state.user.id)
      .slice(0, 4);
    if (!rows.length) {
      wrap.innerHTML = `<div class="empty">No incident reports from your team yet.</div>`;
      return;
    }
    wrap.innerHTML = rows
      .map((incident) => {
        const sev = U.severityMeta[incident.severity] || U.severityMeta.Medium;
        const st = U.incidentStatusMeta[incident.status] || U.incidentStatusMeta.open;
        return `
          <div class="list-row">
            <div class="ai-icon ${incident.severity === "Critical" ? "" : incident.severity === "High" ? "amber" : "blue"}" style="width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:${incident.severity === "Critical" ? "var(--danger-dim)" : "var(--warn-dim)"};color:${sev.color}">
              ${U.icon("alert")}
            </div>
            <div class="meta">
              <div class="name">${U.escapeHtml(incident.title)}</div>
              <div class="sub">${U.fmtTime(incident.ts)} · ${U.escapeHtml(incident.type)}</div>
            </div>
            <span class="badge ${st.badge}">${st.label}</span>
          </div>`;
      })
      .join("");
  };

  const refreshIncidentLocation = () => {
    if (!state.team) return;
    const text = `${state.team.lat.toFixed(5)} N, ${state.team.lng.toFixed(5)} E · ${state.team.sector || "Mt. Lantin area"}`;
    if ($("#incLoc")) $("#incLoc").value = text;
    if ($("#autoAccuracy")) $("#autoAccuracy").textContent = `±${state.team.accuracy || 8} m`;
    if ($("#autoTime")) $("#autoTime").textContent = `${U.fmtTime()} PHT`;
  };

  const submitIncident = async () => {
    const desc = $("#incDesc")?.value.trim() || "";
    if (desc.length < 10) {
      U.toast("Add a short description (at least 10 characters).", "warn");
      return;
    }
    const severity = $("#incSeverity")?.value || "High";
    const type = $("#incType")?.value || "Hazard";
    const team = state.team;
    const titleMap = {
      "Injured person": "Injured person reported",
      Hazard: "Field hazard reported",
      "Missing person": "Missing person report",
      Equipment: "Equipment issue",
      Weather: "Weather hazard",
      Other: "Field report",
    };
    const incident = {
      id: U.randomId("inc"),
      code: `INC-${String(Math.floor(1000 + Math.random() * 9000))}`,
      type,
      severity,
      title: `${titleMap[type] || "Field report"} · ${team?.sector || "Sector"}`,
      status: "open",
      description: desc.slice(0, 500),
      lat: team?.lat,
      lng: team?.lng,
      sector: team?.sector || "Mt. Lantin",
      reporterId: state.user.id,
      reporterName: state.user.name,
      teamId: team?.id,
      ts: Date.now(),
      updatedAt: Date.now(),
    };
    await DB.put("incidents", incident);
    state.incidents.unshift(incident);

    const message = {
      id: U.randomId("msg"),
      channel: "command",
      senderId: state.user.id,
      senderName: `${state.user.name} · ${team?.name || "Field"}`,
      text: `[${severity}] ${incident.title} — ${desc.slice(0, 180)}`,
      ts: Date.now(),
      readBy: [state.user.id],
      incidentId: incident.id,
    };
    await DB.put("messages", message);
    state.messages.push(message);

    if (severity === "Critical" && team) {
      team.status = "sos";
      team.sosAt = Date.now();
      team.sosReason = `${incident.code}: ${incident.title}`;
      await DB.put("teams", team);
    }

    await Auth.audit(state.user, "INCIDENT", `${incident.code} ${severity} — ${incident.title}`);
    Tracking.notify("incidents", { incidentId: incident.id });
    Tracking.notify("messages", { messageId: message.id });

    U.toast(
      severity === "Critical"
        ? "Critical report filed and an SOS alert was raised for the nearest team."
        : "Incident report submitted to command.",
      { type: severity === "Critical" ? "error" : "success", title: incident.code }
    );

    $("#incidentForm")?.reset();
    if ($("#sevPicker")) {
      U.qsa(".sev-opt", $("#sevPicker")).forEach((b) => b.classList.toggle("active", b.dataset.sev === "High"));
    }
    if ($("#incSeverity")) $("#incSeverity").value = "High";
    if ($("#incDescCount")) $("#incDescCount").textContent = "0 / 500 characters";
    localStorage.removeItem(`resqcoord.draft.${state.user.id}`);
    await reload();
    renderDashboard();
    renderRecentReports();
    renderMission();
    refreshIncidentLocation();
    state.msgSig = "";
    renderMessages();
    renderMarkers();
  };

  /* ---------------- Maps ---------------- */
  const initMaps = () => {
    const team = state.team;
    if (!team) return;
    const common = {
      center: [team.lat, team.lng],
      zoom: 15,
      onTileError: () => {
        console.warn("[ResQCoord] Map tiles unavailable — running on the local grid.");
      },
    };

    state.maps.mini = MapKit.create($("#userMiniMap"), { ...common, zoom: 15 });
    state.maps.full = MapKit.create($("#userMap"), {
      ...common,
      zoom: 15,
      onMapClick: async (latlng) => {
        if (!state.picking) return;
        state.picking = false;
        const container = $("#userMap");
        if (container) container.style.cursor = "";
        await applyLocation(latlng.lat, latlng.lng, "map-pick");
      },
    });

    [state.maps.mini, state.maps.full].forEach((map) => {
      if (!map) return;
      map.addTeam(team, true);
      map.setAccuracy(team.lat, team.lng, team.accuracy || 12);
    });

    if (state.maps.full) {
      state.maps.full.invalidate();
      setTimeout(() => state.maps.full?.invalidate(), 400);
    }
    refreshTrail();
  };

  const renderMarkers = () => {
    const team = state.team;
    if (!team) return;
    [state.maps.mini, state.maps.full].forEach((map) => {
      if (!map) return;
      map.updateTeam(team, true);
      map.setAccuracy(team.lat, team.lng, Math.max(team.accuracy || 10, 10));
    });
    const coords = `${team.lat.toFixed(5)}, ${team.lng.toFixed(5)} · <b>±${team.accuracy || 8} m</b>`;
    if ($("#miniCoords")) $("#miniCoords").innerHTML = coords;
    if ($("#mapCoords")) $("#mapCoords").innerHTML = coords;
    if ($("#gpsLat")) $("#gpsLat").textContent = team.lat.toFixed(5);
    if ($("#gpsLng")) $("#gpsLng").textContent = team.lng.toFixed(5);
    if ($("#gpsAccuracy")) $("#gpsAccuracy").textContent = `±${team.accuracy || 8} m`;
    if ($("#gpsSpeed")) $("#gpsSpeed").textContent = `${(team.speed || 0).toFixed(1)} km/h`;
    if ($("#gpsSource")) {
      $("#gpsSource").textContent = Tracking.gpsActive
        ? "Device GPS"
        : Tracking.demoActive
        ? "Demo tracker"
        : "Team simulation";
    }
    if ($("#gpsUpdated")) $("#gpsUpdated").textContent = U.fmtRelative(team.updatedAt || Date.now());
    if ($("#trackingMode")) {
      $("#trackingMode").textContent = Tracking.gpsActive
        ? "Live device GPS"
        : Tracking.demoActive
        ? "Demo movement"
        : "Team simulation";
    }
    if ($("#latInput") && document.activeElement !== $("#latInput")) $("#latInput").value = team.lat.toFixed(5);
    if ($("#lngInput") && document.activeElement !== $("#lngInput")) $("#lngInput").value = team.lng.toFixed(5);

    if (state.follow && $("#view-map")?.classList.contains("active") && state.maps.full && !state.picking) {
      state.maps.full.map.panTo([team.lat, team.lng], { animate: true, duration: 0.4, noMoveStart: true });
    }
  };

  const refreshTrail = async () => {
    if (!state.team) return;
    try {
      const trail = await Tracking.getTrail(state.team.id, 40);
      const distance = Routing.pathDistance(trail);
      if ($("#trailCount")) $("#trailCount").textContent = `${trail.length} points`;
      if ($("#trailDistance")) $("#trailDistance").textContent = U.formatDistance(distance);
      if (state.maps.full && trail.length > 1) state.maps.full.setMyTrail(trail);
      if (state.maps.mini && trail.length > 1) state.maps.mini.setMyTrail(trail);
    } catch (err) {
      console.warn("[ResQCoord] Trail unavailable", err);
    }
  };

  const setGpsBadges = (status, label) => {
    const cls = status === "live" ? "" : status === "searching" ? "searching" : "off";
    ["mapGpsBadge", "gpsBadge", "miniGpsBadge", "incidentGpsBadge"].forEach((id) => {
      const el = $(`#${id}`);
      if (!el) return;
      el.className = `gps-badge ${cls}`;
      el.innerHTML = `${U.icon("gps")} ${U.escapeHtml(label)}`;
    });
  };

  const applyLocation = async (lat, lng, source = "manual") => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      U.toast("Enter a valid latitude (-90 to 90) and longitude (-180 to 180).", "warn");
      return;
    }
    const team = await Tracking.setTeamPosition(state.team.id, lat, lng, { source });
    if (!team) return;
    state.team = team;
    const distance = U.haversine(
      [team.lat, team.lng],
      [16.4027, 120.5973]
    );
    if (distance > 20000) {
      U.toast("Location updated — note this is outside the Mt. Lantin operational area.", "info");
    } else {
      U.toast(`Location updated to ${lat.toFixed(5)}, ${lng.toFixed(5)}.`, "success");
    }
    await Auth.audit(state.user, "LOCATION", `Position changed manually (${source})`);
    renderMarkers();
    renderDashboard();
    refreshIncidentLocation();
    if (state.maps.full) state.maps.full.focus(lat, lng, 16);
    refreshTrail();
  };

  const setLocation = () => {
    const lat = parseFloat($("#latInput")?.value);
    const lng = parseFloat($("#lngInput")?.value);
    applyLocation(lat, lng, "manual");
  };

  /* ---------------- GPS / demo ---------------- */
  const startGps = async () => {
    if (!state.team) return;
    Tracking.gpsTeam = state.team.id;
    const started = Tracking.startGps({
      teamId: state.team.id,
      onStatus: (status) => {
        if (status === "searching") {
          setGpsBadges("searching", "Searching…");
          if ($("#gpsBtnLabel")) $("#gpsBtnLabel").textContent = "Stop GPS";
          U.toast("Requesting a GPS fix from this device…", "info");
        }
        if (status === "live") {
          setGpsBadges("live", "Live GPS");
          if ($("#gpsBtnLabel")) $("#gpsBtnLabel").textContent = "Stop GPS";
        }
        if (status === "denied" || status === "error") {
          setGpsBadges("off", "GPS unavailable");
          if ($("#gpsBtnLabel")) $("#gpsBtnLabel").textContent = "Use my GPS";
        }
      },
      onFix: (fix) => {
        if ($("#gpsAccuracy")) $("#gpsAccuracy").textContent = `±${Math.round(fix.accuracy)} m`;
        if ($("#gpsSpeed")) $("#gpsSpeed").textContent = `${fix.speed.toFixed(1)} km/h`;
        if ($("#gpsSource")) $("#gpsSource").textContent = "Device GPS";
        const coords = `${fix.lat.toFixed(5)}, ${fix.lng.toFixed(5)} · <b>±${Math.round(fix.accuracy)} m</b>`;
        if ($("#mapCoords")) $("#mapCoords").innerHTML = coords;
        if ($("#miniCoords")) $("#miniCoords").innerHTML = coords;
        if (state.maps.full) {
          state.maps.full.moveMe(fix.lat, fix.lng);
          state.maps.full.setAccuracy(fix.lat, fix.lng, fix.accuracy);
          state.maps.full.addCircleAt(fix.lat, fix.lng, Math.max(fix.accuracy, 20));
        }
        refreshIncidentLocation();
        setSync();
      },
      onError: (message, error) => {
        U.toast(message, "error");
        if (error?.code === 1) {
          setGpsBadges("off", "Permission denied");
        }
      },
    });

    if (!started) {
      U.toast("GPS is not available in this browser. Use demo movement instead.", "warn");
      return;
    }
  };

  const stopGps = async () => {
    await Tracking.stopGps();
    if ($("#gpsBtnLabel")) $("#gpsBtnLabel").textContent = "Use my GPS";
    setGpsBadges("live", "GPS off");
    await reload();
    renderMarkers();
    renderDashboard();
    U.toast("Live GPS tracking stopped.", "info");
  };

  const toggleGps = async () => {
    if (Tracking.gpsActive) await stopGps();
    else await startGps();
  };

  const toggleDemo = async () => {
    if (!state.team) return;
    if (Tracking.demoActive) {
      await Tracking.stopDemoMovement();
      if ($("#demoBtnLabel")) $("#demoBtnLabel").textContent = "Demo movement";
      setGpsBadges("off", "Demo stopped");
      await reload();
      renderMarkers();
      renderDashboard();
      U.toast("Demo movement stopped.", "info");
      return;
    }
    Tracking.gpsTeam = state.team.id;
    const ok = await Tracking.startDemoMovement({
      teamId: state.team.id,
      onFix: async (fix) => {
        const team = await DB.get("teams", state.team.id);
        if (team) {
          state.team = team;
          renderMarkers();
          renderDashboard();
          if (state.maps.full && state.follow) {
            state.maps.full.moveMe(fix.lat, fix.lng);
            state.maps.full.setAccuracy(fix.lat, fix.lng, fix.accuracy);
          }
        }
        setSync();
      },
    });
    if (ok) {
      if ($("#demoBtnLabel")) $("#demoBtnLabel").textContent = "Stop demo";
      setGpsBadges("live", "Demo live");
      U.toast("Demo movement started — your marker will patrol the sector every 2.2 s.", {
        title: "Live simulation",
        type: "success",
      });
      if (state.maps.full) state.maps.full.invalidate();
    }
  };

  /* ---------------- Routing ---------------- */
  const setRouteTargets = (places) => {
    state.routeTargets = places;
    const select = $("#routeTo");
    if (!select) return;
    select.innerHTML = places
      .map(
        (p, i) =>
          `<option value="${i}">${U.escapeHtml(p.name)}${p.detail ? ` · ${U.escapeHtml(p.detail)}` : ""}</option>`
      )
      .join("");
  };

  const renderNearbyPlaces = () => {
    const wrap = $("#nearbyPlaces");
    if (!wrap || !state.team) return;
    const places = Routing.PLACES
      .map((p) => ({ ...p, distance: U.haversine([state.team.lat, state.team.lng], [p.lat, p.lng]) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6);
    wrap.innerHTML = places
      .map(
        (p) => `
        <button type="button" class="list-row clickable" data-place="${U.escapeHtml(p.name)}" style="width:100%;border-left:0;border-right:0;border-top:0;background:transparent;text-align:left">
          <div class="team-avatar blue" style="color:var(--accent-2);background:#102638;border-color:#24445e">${U.icon("pin")}</div>
          <div class="meta">
            <div class="name">${U.escapeHtml(p.name)}</div>
            <div class="sub">${U.escapeHtml(p.detail)}</div>
          </div>
          <div class="right">
            <div class="small" style="color:var(--text)">${U.formatDistance(p.distance)}</div>
            <div class="tiny muted-2">route</div>
          </div>
        </button>`
      )
      .join("");
  };

  const originCoords = () => {
    const from = $("#routeFrom")?.value || "me";
    if (from === "me") return [state.team.lat, state.team.lng];
    if (from === "base") {
      const base = Routing.PLACES.find((p) => p.name === "Base Camp");
      return [base.lat, base.lng];
    }
    const trailhead = Routing.PLACES.find((p) => p.name === "Trailhead");
    return [trailhead.lat, trailhead.lng];
  };

  const getRoute = async () => {
    const target = state.routeTargets[Number($("#routeTo")?.value || 0)];
    if (!target) {
      U.toast("Choose a destination first.", "warn");
      return;
    }
    const button = $("#routeBtn");
    if (button) {
      button.disabled = true;
      button.textContent = "Calculating…";
    }
    const direct = $("#routeDirect")?.checked;
    const route = await Routing.getRoute(originCoords(), [target.lat, target.lng], direct ? "direct" : "driving");
    if (button) {
      button.disabled = false;
      button.innerHTML = `${U.icon("route")} Get route`;
    }
    if (!route.ok) {
      U.toast(route.error || "Could not calculate a route.", "error");
      return;
    }
    state.route = route;
    if (state.maps.full) {
      state.maps.full.drawRoute(route);
      state.maps.full.addWaypoint(target.lat, target.lng, target.name);
      state.maps.full.invalidate();
    }
    const panel = $("#routeResult");
    if (panel) {
      panel.style.display = "grid";
      panel.innerHTML = `
        <div class="rp-stat-row"><span>Distance</span><b>${U.formatDistance(route.distance)}</b></div>
        <div class="rp-stat-row"><span>Est. travel time</span><b>${U.formatDuration(route.duration)}</b></div>
        <div class="rp-stat-row"><span>Destination</span><b>${U.escapeHtml(target.name)}</b></div>
        <div class="rp-stat-row"><span>Source</span><b style="color:${route.source === "osrm" ? "var(--accent)" : "var(--warn)"}">${route.source === "osrm" ? "OSRM / OSM" : "Offline fallback"}</b></div>
        <div class="rp-steps">
          ${(route.steps || []).map((s) => `<div class="rp-step"><i></i><span>${U.escapeHtml(s.text)}${s.distance ? ` · ${U.formatDistance(s.distance)}` : ""}</span></div>`).join("")}
        </div>
        <div class="row" style="gap:6px;margin-top:5px">
          <button class="btn btn-sm btn-primary grow" data-nav-route>Start navigation</button>
          <button class="btn btn-sm" data-clear-route>Clear</button>
        </div>
        ${route.note ? `<div class="field-hint">${U.escapeHtml(route.note)}</div>` : ""}
      `;
    }
    if (route.source === "offline") {
      U.toast("Road routing unavailable — drew the offline direct route instead.", "warn");
    } else {
      U.toast(`Route ready: ${U.formatDistance(route.distance)} · ${U.formatDuration(route.duration)}.`, "success");
    }
  };

  const startNavigation = () => {
    const route = state.route;
    if (!route || !state.maps.full) return;
    if (state.navigation) {
      state.navigation.stop();
      state.navigation = null;
      U.toast("Navigation stopped.", "info");
      return;
    }
    const btn = $("[data-nav-route]");
    if (btn) btn.textContent = "Stop navigation";
    const durationMs = U.clamp(route.distance / 8, 16000, 46000);
    state.navigation = Routing.followRoute(route.coords, {
      durationMs,
      onMove: (point) => {
        if (state.maps.full) {
          state.maps.full.moveMe(point.lat, point.lng);
          state.maps.full.map.panTo([point.lat, point.lng], { animate: true, duration: 0.4 });
        }
        if ($("#mapCoords")) $("#mapCoords").innerHTML = `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)} · <b>${U.formatDistance(point.remaining)} left</b>`;
        if ($("#gpsSpeed")) $("#gpsSpeed").textContent = "18.0 km/h";
        if ($("#gpsSource")) $("#gpsSource").textContent = "Route navigation";
      },
      onDone: async () => {
        state.navigation = null;
        const last = route.coords[route.coords.length - 1];
        await Tracking.setTeamPosition(state.team.id, last[0], last[1], { source: "navigation", speed: 0 });
        await reload();
        renderMarkers();
        renderDashboard();
        refreshTrail();
        if ($("#routeResult")) {
          const old = $("#routeResult");
          old.innerHTML = `<div class="rp-stat-row"><span>Arrived</span><b style="color:var(--accent)">Destination reached</b></div>
            <div class="rp-stat-row"><span>Final position</span><b class="mono">${last[0].toFixed(5)}, ${last[1].toFixed(5)}</b></div>
            <button class="btn btn-sm" data-clear-route>Clear route</button>`;
        }
        U.toast("You have arrived at the destination. Position saved.", "success");
      },
    });
    U.toast("Navigation started — following the route on the map.", "info");
  };

  const clearRoute = () => {
    if (state.navigation) {
      state.navigation.stop();
      state.navigation = null;
    }
    state.route = null;
    state.maps.full?.clearRoute();
    state.maps.full?.clearWaypoint();
    const panel = $("#routeResult");
    if (panel) {
      panel.style.display = "none";
      panel.innerHTML = "";
    }
  };

  const searchRoute = async () => {
    const query = $("#routeSearch")?.value.trim();
    if (!query) {
      U.toast("Type a place to search.", "warn");
      return;
    }
    const btn = $("#routeSearchBtn");
    if (btn) btn.textContent = "…";
    const results = await Routing.geocode(query);
    if (btn) btn.textContent = "Find";
    if (!results.length) {
      U.toast("No places found (or geocoding is offline). Try one of the preset destinations.", "warn");
      return;
    }
    const merged = [
      ...results.map((r) => ({ name: r.name, detail: r.detail.slice(0, 70), lat: r.lat, lng: r.lng })),
      ...Routing.PLACES,
    ];
    setRouteTargets(merged);
    U.toast(`Found ${results.length} place${results.length > 1 ? "s" : ""}. Choose one and get the route.`, "success");
  };

  /* ---------------- Check-in / status / SOS ---------------- */
  const openCheckin = () => {
    const team = state.team;
    if (!team) return;
    const modal = U.modal({
      title: "Field check-in",
      subtitle: `Send your position to command · ${team.name}`,
      body: `
        <div class="stack">
          <div class="card" style="background:var(--panel-2)">
            <div class="card-body" style="padding:13px 15px">
              <div class="row between">
                <div><div class="tiny uppercase muted-2">Current position</div>
                <div class="mono" style="margin-top:4px">${team.lat.toFixed(5)}, ${team.lng.toFixed(5)}</div></div>
                <span class="gps-badge">${U.icon("gps")} ±${team.accuracy || 8} m</span>
              </div>
              <div class="kv-list" style="margin-top:8px">
                <div class="kv"><span class="k">Team</span><span class="v">${U.escapeHtml(team.name)}</span></div>
                <div class="kv"><span class="k">Mission</span><span class="v">${U.escapeHtml(state.mission?.code || "—")}</span></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label for="checkinStatus">Status</label>
            <select class="select" id="checkinStatus">
              <option value="onsite" ${team.status === "onsite" ? "selected" : ""}>On site</option>
              <option value="enroute" ${team.status === "enroute" ? "selected" : ""}>En route</option>
              <option value="standby" ${team.status === "standby" ? "selected" : ""}>Standby</option>
            </select>
          </div>
          <div class="field">
            <label for="checkinNote">Check-in note <span class="label-optional">(optional)</span></label>
            <textarea class="textarea" id="checkinNote" placeholder="e.g. All clear at the saddle, moving to ridge marker"></textarea>
          </div>
          <div class="field-hint">Your position, status and note are stored locally and synced to the admin dashboard instantly.</div>
        </div>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="doCheckin">Send check-in</button>`,
    });
    modal.el.querySelector("#doCheckin").addEventListener("click", async () => {
      const status = modal.el.querySelector("#checkinStatus").value;
      const note = modal.el.querySelector("#checkinNote").value.trim();
      const record = await Tracking.checkIn(state.user, {
        lat: state.team.lat,
        lng: state.team.lng,
        note: note || `Check-in · ${statusLabel(status)}`,
        status,
      });
      modal.close();
      state.team.lastCheckin = record.ts;
      state.team.status = status;
      await reload();
      renderDashboard();
      renderMission();
      setSync();
      U.toast("Check-in sent. Command can see your position and status.", {
        title: "You're checked in",
        type: "success",
      });
    });
  };

  const openStatus = () => {
    const team = state.team;
    if (!team) return;
    const isSos = team.status === "sos";
    const modal = U.modal({
      title: "Update my status",
      subtitle: `${team.name} · this is visible to command`,
      body: `
        <div class="stack">
          ${isSos ? `<div class="incident-card" style="border-color:rgba(255,90,106,.35)">
            <div class="ic-head"><div class="ic-title" style="color:var(--danger)">SOS is active</div><span class="badge badge-red">Emergency</span></div>
            <div class="ic-desc">Command has been alerted. Clear the SOS only if the emergency is over or it was raised by mistake.</div>
          </div>` : ""}
          <div class="field">
            <label for="statusChoice">Status</label>
            <select class="select" id="statusChoice">
              <option value="onsite">On site</option>
              <option value="enroute">En route</option>
              <option value="standby">Standby</option>
            </select>
          </div>
          <div class="field">
            <label for="statusNote">Note <span class="label-optional">(optional)</span></label>
            <input class="input" id="statusNote" placeholder="e.g. At ridge marker, GPS locked">
          </div>
        </div>`,
      footer: `${isSos ? '<button class="btn btn-danger" id="clearSos">Clear SOS</button>' : ""}
        <button class="btn" data-close>Cancel</button>
        <button class="btn btn-primary" id="saveStatus">Save status</button>`,
    });
    if (isSos) {
      modal.el.querySelector("#clearSos").addEventListener("click", async () => {
        await Tracking.clearSos(team.id, state.user);
        modal.close();
        await reload();
        renderDashboard();
        setGpsBadges("live", "GPS locked");
        U.toast("SOS cleared. Command has been notified.", "success");
      });
    }
    modal.el.querySelector("#saveStatus").addEventListener("click", async () => {
      const status = modal.el.querySelector("#statusChoice").value;
      const note = modal.el.querySelector("#statusNote").value.trim();
      team.status = status;
      team.updatedAt = Date.now();
      if (note) team.note = note;
      await DB.put("teams", team);
      await Auth.audit(state.user, "STATUS", `Status set to ${status}${note ? " — " + note : ""}`);
      Tracking.notify("teams", { teamId: team.id });
      modal.close();
      renderDashboard();
      U.toast(`Status updated to “${statusLabel(status)}”.`, "success");
    });
  };

  const openSos = () => {
    const team = state.team;
    if (!team) return;
    const modal = U.modal({
      title: "Activate SOS alert",
      subtitle: "This immediately notifies the command center",
      body: `
        <div class="incident-card" style="border-color:rgba(255,90,106,.35);background:rgba(255,90,106,.04)">
          <div class="ic-head"><div class="ic-title" style="color:var(--danger)">Emergency assistance</div><span class="badge badge-red">Critical</span></div>
          <div class="ic-desc">An SOS sets ${U.escapeHtml(team.name)} to emergency status, creates a critical incident, and broadcasts your position to command.</div>
        </div>
        <div class="field" style="margin-top:14px">
          <label for="sosReason">What is the emergency?</label>
          <textarea class="textarea" id="sosReason" placeholder="e.g. Hiker with leg injury, need medic at the gully crossing">${team.sosReason ? U.escapeHtml(team.sosReason) : ""}</textarea>
        </div>
        <div class="field-hint" style="margin-top:10px">Only use this for a real emergency. You can clear the alert from Update status.</div>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-danger" id="confirmSos">${U.icon("sos")} Activate SOS now</button>`,
    });
    modal.el.querySelector("#confirmSos").addEventListener("click", async () => {
      const reason = modal.el.querySelector("#sosReason").value.trim() || "Emergency assistance requested";
      modal.close();
      const result = await Tracking.triggerSos(state.user, reason);
      if (result) {
        state.team = result.team;
        await reload();
        renderDashboard();
        renderMarkers();
        renderRecentReports();
        setGpsBadges("live", "SOS active");
        state.msgSig = "";
        renderMessages();
        U.toast("SOS ACTIVATED. Command has your position and a critical incident was created.", {
          title: "Emergency alert sent",
          type: "error",
          duration: 9000,
        });
      }
    });
  };

  /* ---------------- Settings ---------------- */
  const saveSettings = async (patch) => {
    state.settings = { ...state.settings, ...patch };
    await DB.put("settings", { ...state.settings, userId: state.user.id });
    U.toast("Settings saved.", "success");
  };

  const bindSettings = () => {
    U.qsa("#settingsNav button").forEach((button) => {
      button.addEventListener("click", () => {
        U.qsa("#settingsNav button").forEach((b) => b.classList.toggle("active", b === button));
        U.qsa(".settings-section").forEach((section) => {
          section.style.display = section.dataset.section === button.dataset.settings ? "" : "none";
        });
      });
    });

    $("#profileForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = await Auth.updateProfile({
        name: $("#profName").value.trim(),
        phone: $("#profPhone").value.trim(),
        org: $("#profOrg").value.trim(),
        cert: $("#profCert").value.trim(),
        title: $("#profTitle").value.trim() || state.user.title,
      });
      if (!result.ok) {
        U.toast(result.error || "Could not save your profile.", "error");
        return;
      }
      state.user = result.user;
      renderIdentity();
      U.toast("Profile updated.", "success");
    });

    U.qsa(".notif-toggle").forEach((input) => {
      input.checked = state.settings.notifications?.[input.dataset.notif] !== false;
      input.addEventListener("change", () => {
        const notifications = { ...(state.settings.notifications || {}), [input.dataset.notif]: input.checked };
        saveSettings({ notifications });
      });
    });

    if ($("#shareLocation")) {
      $("#shareLocation").checked = state.settings.shareLocation !== false;
      $("#shareLocation").addEventListener("change", () => {
        saveSettings({ shareLocation: $("#shareLocation").checked });
        if (!state.settings.shareLocation) U.toast("Location sharing is off — command will see your last position only.", "warn");
      });
    }
    if ($("#backgroundTracking")) {
      $("#backgroundTracking").checked = state.settings.backgroundTracking !== false;
      $("#backgroundTracking").addEventListener("change", () => saveSettings({ backgroundTracking: $("#backgroundTracking").checked }));
    }
    if ($("#checkinInterval")) {
      $("#checkinInterval").value = String(intervalMinutes());
      $("#checkinInterval").addEventListener("change", () => {
        saveSettings({ checkinMinutes: Number($("#checkinInterval").value) });
        renderDashboard();
      });
    }

    $("#passwordForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = await Auth.changePassword($("#curPw").value, $("#newPw").value, $("#confirmPw").value);
      if (!result.ok) {
        U.toast(result.error, "error");
        return;
      }
      $("#passwordForm").reset();
      U.toast("Password changed. Use the new password next time you sign in.", "success");
    });
  };

  /* ---------------- Navigation ---------------- */
  const viewTitles = {
    dashboard: "Dashboard",
    mission: "My Mission",
    map: "Live Map",
    messages: "Messages",
    incident: "Report Incident",
    settings: "Settings",
  };

  const switchView = (view) => {
    if (!$(`#view-${view}`)) return;
    U.qsa(".view").forEach((section) => section.classList.toggle("active", section.id === `view-${view}`));
    U.qsa(".nav-item[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    if ($("#crumb")) $("#crumb").textContent = viewTitles[view] || view;
    if (view === "map") {
      setTimeout(() => {
        state.maps.full?.invalidate();
        if (state.team) state.maps.full?.focus(state.team.lat, state.team.lng, 15);
      }, 120);
    }
    if (view === "dashboard") {
      setTimeout(() => state.maps.mini?.invalidate(), 120);
    }
    if (view === "incident") refreshIncidentLocation();
    if (view === "messages") renderMessages();
    if (view === "mission") renderMission();
    if (window.innerWidth <= 1080) $("#app")?.classList.remove("sidebar-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bindNavigation = () => {
    U.qsa(".nav-item[data-view]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.view));
    });
    U.qsa("[data-view-link]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.viewLink));
    });
    $("#sidebarToggle")?.addEventListener("click", () => $("#app")?.classList.toggle("sidebar-open"));
    $("#sideUser")?.addEventListener("click", () => switchView("settings"));
    $("#sideUser")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        switchView("settings");
      }
    });
  };

  const bindActions = () => {
    document.addEventListener("click", async (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (actionEl) {
        const action = actionEl.dataset.action;
        if (action === "checkin") openCheckin();
        if (action === "status") openStatus();
        if (action === "sos") openSos();
        if (action === "report") switchView("incident");
        if (action === "message") {
          switchView("messages");
          setTimeout(() => $("#chatInput")?.focus(), 250);
        }
        if (action === "backup") {
          const message = {
            id: U.randomId("msg"),
            channel: "command",
            senderId: state.user.id,
            senderName: `${state.user.name} · ${state.team?.name || "Field"}`,
            text: `Backup requested at ${state.team?.sector || "my sector"}. Position ${state.team?.lat.toFixed(5)}, ${state.team?.lng.toFixed(5)}.`,
            ts: Date.now(),
            readBy: [state.user.id],
          };
          await DB.put("messages", message);
          state.messages.push(message);
          Tracking.notify("messages", { messageId: message.id });
          state.msgSig = "";
          renderMessages();
          renderMiniMessages();
          U.toast("Backup request sent to command with your position.", "success");
        }
        if (action === "logout") {
          const ok = await U.confirm({
            title: "Sign out?",
            message: "You will need your email and password to sign back in.",
            confirmText: "Sign out",
            danger: true,
          });
          if (ok) await Auth.logout("../user/login.html");
        }
        return;
      }

      const checkpoint = event.target.closest("[data-checkpoint]");
      if (checkpoint) {
        await completeCheckpoint(Number(checkpoint.dataset.checkpoint));
        return;
      }

      const thread = event.target.closest("[data-thread]");
      if (thread) {
        await openThread(thread.dataset.thread);
        return;
      }

      const place = event.target.closest("[data-place]");
      if (place) {
        const target = Routing.PLACES.find((p) => p.name === place.dataset.place);
        if (target) {
          const idx = state.routeTargets.findIndex((p) => p.name === target.name);
          if (idx >= 0 && $("#routeTo")) $("#routeTo").value = String(idx);
          switchView("map");
          setTimeout(getRoute, 350);
        }
        return;
      }

      if (event.target.closest("[data-nav-route]")) {
        startNavigation();
        return;
      }
      if (event.target.closest("[data-clear-route]")) {
        clearRoute();
      }
    });

    $("#statusSelect")?.addEventListener("change", async (event) => {
      const team = state.team;
      if (!team) return;
      team.status = event.target.value;
      team.updatedAt = Date.now();
      await DB.put("teams", team);
      await Auth.audit(state.user, "STATUS", `Status set to ${team.status}`);
      Tracking.notify("teams", { teamId: team.id });
      renderDashboard();
      U.toast(`Status updated to “${statusLabel(team.status)}”.`, "success");
    });

    $("#chatForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = $("#chatInput");
      const text = input.value;
      input.value = "";
      await sendMessage(text);
    });
    $("#chatInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        $("#chatForm")?.requestSubmit();
      }
    });

    $("#threadSearchBtn")?.addEventListener("click", () => {
      const query = $("#threadSearch")?.value.trim().toLowerCase();
      U.qsa("#threadList .msg-thread").forEach((el) => {
        el.style.display = !query || el.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    });
    $("#threadSearch")?.addEventListener("input", U.debounce(() => $("#threadSearchBtn")?.click(), 250));

    /* Incident form */
    U.qsa("#sevPicker .sev-opt").forEach((button) => {
      button.addEventListener("click", () => {
        U.qsa("#sevPicker .sev-opt").forEach((b) => b.classList.toggle("active", b === button));
        if ($("#incSeverity")) $("#incSeverity").value = button.dataset.sev;
      });
    });
    $("#incDesc")?.addEventListener("input", (event) => {
      if ($("#incDescCount")) $("#incDescCount").textContent = `${event.target.value.length} / 500 characters`;
    });
    $("#incLocRefresh")?.addEventListener("click", refreshIncidentLocation);
    $("#addPhoto")?.addEventListener("click", () => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = `IMG_04${Math.floor(14 + Math.random() * 80)}`;
      $("#addPhoto")?.before(chip);
      U.toast("Photo reference attached to the draft.", "info");
    });
    $("#incidentForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $("#submitIncident");
      if (button) button.disabled = true;
      try {
        await submitIncident();
      } finally {
        if (button) button.disabled = false;
      }
    });
    $("#saveDraft")?.addEventListener("click", () => {
      const draft = {
        type: $("#incType")?.value,
        severity: $("#incSeverity")?.value,
        description: $("#incDesc")?.value,
        savedAt: Date.now(),
      };
      localStorage.setItem(`resqcoord.draft.${state.user.id}`, JSON.stringify(draft));
      U.toast("Draft saved locally on this device.", "success");
    });
    $("#incidentSos")?.addEventListener("click", openSos);
    $("#incidentForm")?.addEventListener("reset", () => {
      setTimeout(() => {
        if ($("#incDescCount")) $("#incDescCount").textContent = "0 / 500 characters";
        U.qsa("#sevPicker .sev-opt").forEach((b) => b.classList.toggle("active", b.dataset.sev === "High"));
        if ($("#incSeverity")) $("#incSeverity").value = "High";
        refreshIncidentLocation();
      }, 0);
    });

    /* Map controls */
    U.qsa(".map-tool[data-layer]").forEach((button) => {
      button.addEventListener("click", () => {
        U.qsa(".map-tool[data-layer]").forEach((b) => b.classList.toggle("active", b === button));
        state.maps.full?.setBaseLayer(button.dataset.layer);
      });
    });
    $("#sectorsToggle")?.addEventListener("click", () => {
      const visible = state.maps.full?.toggleSectors();
      $("#sectorsToggle")?.classList.toggle("active", !!visible);
    });
    $("#centerBtn")?.addEventListener("click", () => {
      if (!state.team) return;
      state.maps.full?.focus(state.team.lat, state.team.lng, 16);
      U.toast("Centered on your live position.", "info");
    });
    $("#gpsBtn")?.addEventListener("click", toggleGps);
    $("#gpsFixBtn")?.addEventListener("click", toggleGps);
    $("#demoBtn")?.addEventListener("click", toggleDemo);
    $("#simToggle")?.addEventListener("change", (event) => {
      state.follow = event.target.checked;
      if (state.follow && state.team) state.maps.full?.focus(state.team.lat, state.team.lng, 16);
    });
    $("#recenterTrail")?.addEventListener("click", () => {
      refreshTrail();
      if (state.team && state.maps.full) state.maps.full.focus(state.team.lat, state.team.lng, 16);
    });
    $("#applyLocation")?.addEventListener("click", setLocation);
    $("#pickMapBtn")?.addEventListener("click", () => {
      state.picking = true;
      const container = $("#userMap");
      if (container) container.style.cursor = "crosshair";
      switchView("map");
      U.toast("Click anywhere on the map to move your position.", "info");
    });
    $("#routeBtn")?.addEventListener("click", getRoute);
    $("#routeSearchBtn")?.addEventListener("click", searchRoute);
    $("#routeSearch")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        searchRoute();
      }
    });
    $("#routeClose")?.addEventListener("click", () => {
      $("#routePanel")?.style.setProperty("display", "none");
      $("#routeToggle")?.classList.remove("active");
    });
    $("#routeToggle")?.addEventListener("click", () => {
      const panel = $("#routePanel");
      if (!panel) return;
      const hidden = panel.style.display === "none";
      panel.style.display = hidden ? "" : "none";
      $("#routeToggle")?.classList.toggle("active", hidden);
    });
    $("#routeTo")?.addEventListener("change", () => {
      const target = state.routeTargets[Number($("#routeTo")?.value || 0)];
      if (target && state.maps.full) {
        state.maps.full.addWaypoint(target.lat, target.lng, target.name);
        state.maps.full.focus(target.lat, target.lng, 15);
      }
    });
    $("#latInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") setLocation();
    });
    $("#lngInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") setLocation();
    });
  };

  /* ---------------- Windows / timers ---------------- */
  const updateClock = () => {
    const time = `${U.fmtTime()} PHT`;
    clockIds.forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = time;
    });
    if (state.ready) {
      const team = state.team;
      if (team) {
        const due = (team.lastCheckin || Date.now()) + intervalMinutes() * 60000;
        const diff = Math.round((due - Date.now()) / 60000);
        const remaining = diff > 0 ? `${diff} min` : diff === 0 ? "due now" : `${Math.abs(diff)} min overdue`;
        if ($("#kpiCheckinIn")) $("#kpiCheckinIn").textContent = remaining;
        if ($("#nextCheckin")) $("#nextCheckin").textContent = `${U.fmtTime(due)} · ${remaining}`;
      }
      if (state.mission) {
        const mins = Math.max(0, Math.round((Date.now() - state.mission.startedAt) / 60000));
        if ($("#missionElapsed")) $("#missionElapsed").textContent = `${Math.floor(mins / 60)}h ${U.pad(mins % 60)}m`;
      }
      if ($("#gpsUpdated") && state.team) $("#gpsUpdated").textContent = U.fmtRelative(state.team.updatedAt || Date.now());
    }
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

  const refresh = async () => {
    if (!state.ready) return;
    try {
      await reload();
      renderDashboard();
      renderMission();
      renderMessages();
      renderMarkers();
      refreshIncidentLocation();
      setSync();
    } catch (err) {
      console.warn("[ResQCoord] Refresh failed", err);
    }
  };

  const startTimers = () => {
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(refresh, 3200);
    setInterval(refreshTrail, 9000);
    setInterval(() => {
      renderNearbyPlaces();
      setSync();
    }, 8000);

    Tracking.subscribe((event) => {
      if (["teams", "messages", "checkins", "sos", "incidents", "missions"].includes(event.type)) {
        if (event.type === "sos") {
          U.toast("SOS state changed — check the live map and your status.", {
            type: "warn",
            title: "Emergency update",
          });
        }
        if (event.type === "messages") {
          state.msgSig = "";
        }
        setTimeout(refresh, 250);
      }
    });

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        state.maps.mini?.invalidate();
        state.maps.full?.invalidate();
        refresh();
      }
    });
  };

  /* ---------------- Boot ---------------- */
  const boot = async () => {
    const user = await Auth.guard("user");
    if (!user) return;
    state.user = user;
    await reload();
    renderIdentity();
    renderDashboard();
    renderMission();
    renderMessages();
    renderRecentReports();
    renderNearbyPlaces();
    refreshIncidentLocation();
    initMaps();
    renderMarkers();
    setRouteTargets(Routing.PLACES);
    bindNavigation();
    bindActions();
    bindSettings();
    updateNetwork();

    const draft = localStorage.getItem(`resqcoord.draft.${user.id}`);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        if (data.description && $("#incDesc") && !$("#incDesc").value) {
          $("#incDesc").value = data.description;
          if ($("#incType") && data.type) $("#incType").value = data.type;
          if ($("#incDescCount")) $("#incDescCount").textContent = `${data.description.length} / 500 characters`;
          if (data.severity && $("#incSeverity")) $("#incSeverity").value = data.severity;
          U.toast("An unsaved incident draft was restored.", "info");
        }
      } catch {
        /* ignore malformed draft */
      }
    }

    state.ready = true;
    setSync();
    if ($("#simToggle")) $("#simToggle").checked = true;

    await Tracking.startSimulation({
      intervalMs: 2600,
      onTick: (teams) => {
        if (!state.ready) return;
        state.teams = teams;
        const own = teams.find((t) => t.id === state.team?.id);
        if (own) {
          state.team = own;
          renderMarkers();
        }
        setSync();
      },
    });

    U.toast(`Signed in as ${user.name}.`, {
      title: "Field dashboard ready",
      type: "success",
    });

    console.info("[ResQCoord] User dashboard ready.", { db: DB.mode, team: state.team?.name, mission: state.mission?.code });
  };

  boot().catch((err) => {
    console.error("[ResQCoord] Failed to start the dashboard", err);
    U.toast("The dashboard could not start. Check the browser console for details.", "error");
  });
})();
