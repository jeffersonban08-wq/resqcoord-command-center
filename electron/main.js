/* ============================================================
   ResQCoord — Electron desktop entry
   Starts the existing local server on a fixed loopback port,
   then opens the web app in a native desktop window.
   ============================================================ */
"use strict";

const { app, BrowserWindow, session, shell, dialog } = require("electron");
const { server } = require("../server.js");

const HOST = "127.0.0.1";
const PORT = 31777;
const BASE = `http://${HOST}:${PORT}`;

let win = null;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });

  app.whenReady().then(start).catch((err) => {
    dialog.showErrorBox(
      "ResQCoord could not start",
      `Port ${PORT} may already be in use.\n\n${err.message}`
    );
    app.quit();
  });
}

function listen() {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, resolve);
  });
}

async function start() {
  await listen();

  session.defaultSession.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      callback(
        permission === "geolocation" ||
        permission === "notifications" ||
        permission === "persistent-storage"
      );
    }
  );

  session.defaultSession.setPermissionCheckHandler(
    (_webContents, permission) => {
      return (
        permission === "geolocation" ||
        permission === "notifications" ||
        permission === "persistent-storage"
      );
    }
  );

  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: "#0b1220",
    title: "ResQCoord",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadURL(`${BASE}/`);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(BASE)) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(BASE)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.on("window-all-closed", () => {
  app.quit();
});

app.on("before-quit", () => {
  try {
    server.close();
  } catch {
    /* server was never started */
  }
});
