/* ============================================================
   ResQCoord — mapkit.js
   Leaflet wrapper: base layers, sector overlays, team markers,
   position trails, route rendering and map interactions.
   ============================================================ */
"use strict";

const MapKit = (() => {
  const SECTORS = [
    {
      name: "SECTOR A",
      color: "#3ddc97",
      polygon: [
        [16.4055, 120.594], [16.413, 120.5965], [16.412, 120.6045],
        [16.406, 120.603], [16.4025, 120.5985],
      ],
      label: [16.4088, 120.5985],
    },
    {
      name: "SECTOR B",
      color: "#46b8ff",
      polygon: [
        [16.413, 120.604], [16.4168, 120.614], [16.4075, 120.615],
        [16.4045, 120.608], [16.406, 120.604],
      ],
      label: [16.4105, 120.6095],
    },
    {
      name: "SECTOR C",
      color: "#f7bf4f",
      polygon: [
        [16.402, 120.6], [16.404, 120.608], [16.397, 120.6125],
        [16.3915, 120.606], [16.3945, 120.5985],
      ],
      label: [16.398, 120.6045],
    },
  ];

  const BASEMAPS = {
    streets: {
      label: "Streets",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    },
    satellite: {
      label: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "&copy; Esri · Maxar · Earthstar Geographics",
      maxZoom: 19,
    },
    terrain: {
      label: "Terrain",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenTopoMap · OSM contributors",
      maxZoom: 17,
    },
  };

  const markerHtml = (team, isMe = false) => {
    const cls = isMe ? "me" : U.statusMeta[team.status]?.css || "standby";
    const label = isMe ? "YOU" : U.escapeHtml(team.short || team.name?.slice(0, 3) || "TM");
    return `<div class="mk ${cls}"><div class="mk-inner"><span>${label}</span></div></div>`;
  };

  const popupHtml = (team, isMe = false) => {
    const meta = U.statusMeta[team.status] || U.statusMeta.standby;
    return `
      <div style="min-width:172px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <b>${U.escapeHtml(isMe ? "My location" : team.name)}</b>
          <span class="badge ${meta.badge}" style="height:19px;font-size:9px">${meta.label}</span>
        </div>
        <div style="color:#8a9cb1;margin-top:5px">${U.escapeHtml(team.sector || "Mt. Lantin area")}</div>
        <div style="display:grid;gap:2px;margin-top:7px;font-size:11px;color:#8a9cb1">
          <span><b style="color:#e9f0f9">${team.members || 1}</b> personnel</span>
          <span>Speed <b style="color:#e9f0f9">${(team.speed ?? 0).toFixed(1)} km/h</b></span>
          <span>Battery <b style="color:#e9f0f9">${team.battery ?? "—"}%</b></span>
          <span>Updated <b style="color:#e9f0f9">${U.fmtRelative(team.updatedAt || Date.now())}</b></span>
        </div>
        <div style="margin-top:7px;font-family:var(--mono);font-size:10px;color:#62748a">
          ${team.lat?.toFixed(5)}, ${team.lng?.toFixed(5)}
        </div>
      </div>`;
  };

  const create = (container, opts = {}) => {
    if (typeof L === "undefined") {
      container.innerHTML =
        '<div class="empty">Map library failed to load. Check that assets/vendor/leaflet is present.</div>';
      return null;
    }
    const map = L.map(container, {
      center: opts.center || [16.4037, 120.6012],
      zoom: opts.zoom || 14,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    const base = {};
    Object.entries(BASEMAPS).forEach(([key, def]) => {
      base[key] = L.tileLayer(def.url, {
        attribution: def.attribution,
        maxZoom: def.maxZoom,
        crossOrigin: true,
      });
    });
    let activeBase = opts.layers || "streets";
    base[activeBase]?.addTo(map);

    const sectorLayer = L.layerGroup().addTo(map);
    const teamLayer = L.layerGroup().addTo(map);
    const trailLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);
    const markerLayer = L.layerGroup().addTo(map);

    let tileErrorNotified = false;
    Object.values(base).forEach((layer) => {
      layer.on("tileerror", () => {
        if (tileErrorNotified) return;
        tileErrorNotified = true;
        if (opts.onTileError) opts.onTileError();
      });
    });

    /* Sector overlays */
    let sectorsVisible = true;
    SECTORS.forEach((sector) => {
      L.polygon(sector.polygon, {
        color: sector.color,
        weight: 1.2,
        opacity: 0.5,
        dashArray: "5 6",
        fillColor: sector.color,
        fillOpacity: 0.035,
        interactive: false,
      }).addTo(sectorLayer);
      L.marker(sector.label, {
        icon: L.divIcon({
          className: "sector-label",
          html: sector.name,
          iconSize: [90, 14],
          iconAnchor: [45, 7],
        }),
        interactive: false,
      }).addTo(sectorLayer);
    });

    const markers = new Map();
    let meMarker = null;
    let meAccuracy = null;
    let routeLine = null;
    let meTrail = null;

    const teamIcon = (team, isMe) =>
      L.divIcon({
        className: "team-marker-wrap",
        html: markerHtml(team, isMe),
        iconSize: [34, 40],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30],
      });

    const hasSize = () => {
      const el = map.getContainer();
      return !!(el && el.clientWidth > 0 && el.clientHeight > 0);
    };

    const validLatLng = (lat, lng) => {
      const a = Number(lat);
      const b = Number(lng);
      return Number.isFinite(a) && Number.isFinite(b) && a >= -90 && a <= 90 && b >= -180 && b <= 180;
    };

    const addTeam = (team, isMe = false) => {
      if (!team || !validLatLng(team.lat, team.lng)) return null;
      const marker = L.marker([team.lat, team.lng], {
        icon: teamIcon(team, isMe),
        zIndexOffset: isMe ? 1000 : team.status === "sos" ? 900 : 0,
        keyboard: true,
      });
      marker.bindPopup(popupHtml(team, isMe), { closeButton: true, maxWidth: 270 });
      marker.bindTooltip(`${isMe ? "You" : team.name} · ${U.statusMeta[team.status]?.label || ""}`, {
        direction: "top",
        offset: [0, -28],
        opacity: 0.95,
      });
      marker.on("click", () => {
        if (opts.onTeamClick) opts.onTeamClick(team, isMe);
      });
      marker.addTo(teamLayer);
      if (isMe) {
        meMarker = marker;
        markers.set("me", marker);
      } else {
        markers.set(team.id, marker);
      }
      return marker;
    };

    const updateTeam = (team, isMe = false) => {
      const key = isMe ? "me" : team.id;
      if (!team || !validLatLng(team.lat, team.lng)) return;
      const marker = markers.get(key);
      if (!marker) {
        addTeam(team, isMe);
        return;
      }
      marker.setLatLng([team.lat, team.lng]);
      marker.setIcon(teamIcon(team, isMe));
      marker.setPopupContent(popupHtml(team, isMe));
      marker.setTooltipContent(`${isMe ? "You" : team.name} · ${U.statusMeta[team.status]?.label || ""}`);
      marker.setZIndexOffset(isMe ? 1000 : team.status === "sos" ? 900 : 0);
    };

    const removeTeam = (id) => {
      const marker = markers.get(id);
      if (marker) {
        marker.remove();
        markers.delete(id);
      }
    };

    const clearTeams = () => {
      markers.forEach((marker) => marker.remove());
      markers.clear();
      meMarker = null;
    };

    const setAccuracy = (lat, lng, radius) => {
      if (meAccuracy) {
        meAccuracy.setLatLng([lat, lng]).setRadius(radius);
        return;
      }
      meAccuracy = L.circle([lat, lng], {
        radius,
        color: "#3ddc97",
        weight: 1,
        opacity: 0.4,
        fillColor: "#3ddc97",
        fillOpacity: 0.08,
        interactive: false,
      }).addTo(map);
    };

    const setMyTrail = (coords) => {
      if (meTrail) {
        meTrail.setLatLngs(coords);
        return;
      }
      meTrail = L.polyline(coords, {
        color: "#3ddc97",
        weight: 2,
        opacity: 0.5,
        dashArray: "3 5",
        interactive: false,
      }).addTo(map);
    };

    const showTrail = (coords, color = "#46b8ff") => {
      trailLayer.clearLayers();
      if (!coords || coords.length < 2) return;
      L.polyline(coords, {
        color,
        weight: 2.5,
        opacity: 0.55,
        dashArray: "4 6",
        interactive: false,
      }).addTo(trailLayer);
    };

    const clearTrail = () => trailLayer.clearLayers();

    const drawRoute = (route, { fit = true } = {}) => {
      routeLayer.clearLayers();
      routeLine = null;
      if (!route?.coords?.length) return;
      const offline = route.source === "offline";
      routeLine = L.polyline(route.coords, {
        color: offline ? "#f7bf4f" : "#46b8ff",
        weight: 5,
        opacity: 0.92,
        lineJoin: "round",
        dashArray: offline ? "8 8" : null,
      }).addTo(routeLayer);
      L.polyline(route.coords, {
        color: "#04121c",
        weight: 9,
        opacity: 0.28,
        interactive: false,
      }).addTo(routeLayer).bringToBack();
      const start = route.coords[0];
      const end = route.coords[route.coords.length - 1];
      L.circleMarker(start, {
        radius: 6, color: "#3ddc97", weight: 2, fillColor: "#0b1a28", fillOpacity: 1,
      }).addTo(routeLayer).bindTooltip("Start", { direction: "top" });
      L.circleMarker(end, {
        radius: 7, color: "#46b8ff", weight: 3, fillColor: "#0b1a28", fillOpacity: 1,
      }).addTo(routeLayer).bindTooltip("Destination", { direction: "top" });
      if (fit) {
        if (!hasSize()) return;
        map.fitBounds(routeLine.getBounds(), { padding: [46, 46], maxZoom: 16 });
      }
    };

    const clearRoute = () => {
      routeLayer.clearLayers();
      routeLine = null;
    };

    const moveMe = (lat, lng, { pan = true } = {}) => {
      if (meMarker) {
        meMarker.setLatLng([lat, lng]);
        if (pan) map.panTo([lat, lng], { animate: true, duration: 0.4 });
      }
    };

    const setBaseLayer = (key) => {
      if (!base[key] || key === activeBase) return;
      map.removeLayer(base[activeBase]);
      base[key].addTo(map);
      base[key].bringToBack();
      activeBase = key;
    };

    const toggleSectors = (force) => {
      sectorsVisible = typeof force === "boolean" ? force : !sectorsVisible;
      if (sectorsVisible) sectorLayer.addTo(map);
      else map.removeLayer(sectorLayer);
      return sectorsVisible;
    };

    if (opts.onMapClick) map.on("click", (e) => opts.onMapClick(e.latlng, e));

    return {
      map,
      addTeam,
      updateTeam,
      removeTeam,
      clearTeams,
      setAccuracy,
      setMyTrail,
      showTrail,
      clearTrail,
      drawRoute,
      clearRoute,
      moveMe,
      setBaseLayer,
      toggleSectors,
      get activeBase() { return activeBase; },
      get markers() { return markers; },
      focus: (lat, lng, zoom = 16) => {
        if (!validLatLng(lat, lng)) return false;
        const a = Number(lat);
        const b = Number(lng);
        let tries = 0;
        const go = () => {
          // A hidden view has a zero-size container; projecting into it yields
          // NaN LatLngs. Wait for layout instead of calling flyTo too early.
          if (!hasSize()) {
            if (tries++ < 12) return setTimeout(go, 120);
            return false;
          }
          map.invalidateSize();
          map.flyTo([a, b], zoom, { duration: 0.7 });
          return true;
        };
        return go();
      },
      fitTeams: () => {
        if (!hasSize()) return;
        const latlngs = Array.from(markers.values()).map((m) => m.getLatLng());
        if (latlngs.length > 1) map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50], maxZoom: 16 });
      },
      addWaypoint: (lat, lng, label = "Destination") => {
        markerLayer.clearLayers();
        L.marker([lat, lng], {
          icon: L.divIcon({
            className: "team-marker-wrap",
            html: `<div class="mk standby"><div class="mk-inner"><span>◎</span></div></div>`,
            iconSize: [34, 40],
            iconAnchor: [17, 34],
          }),
        }).addTo(markerLayer).bindTooltip(label, { direction: "top", offset: [0, -28] }).openTooltip();
      },
      clearWaypoint: () => markerLayer.clearLayers(),
      addCircleAt: (lat, lng, radius = 250, color = "#f7bf4f") =>
        L.circle([lat, lng], {
          radius, color, weight: 1.5, opacity: 0.7, fillColor: color, fillOpacity: 0.08,
        }).addTo(markerLayer),
      invalidate: () => setTimeout(() => map.invalidateSize(), 60),
      fitSector: (name) => {
        const sector = SECTORS.find((s) => s.name.toLowerCase().includes(String(name).toLowerCase()));
        if (sector && hasSize()) map.fitBounds(L.latLngBounds(sector.polygon), { padding: [30, 30] });
      },
      clearAllOverlays: () => {
        clearRoute();
        clearTrail();
        markerLayer.clearLayers();
      },
    };
  };

  return { create, SECTORS, BASEMAPS };
})();
