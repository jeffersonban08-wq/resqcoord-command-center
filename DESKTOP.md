# ResQCoord — Desktop (Electron)

This repository contains both the browser app and the Electron desktop wrapper.

## Download

Use the repository's **Releases** page:

- `ResQCoord 1.0.0.exe` — portable app, no installation
- `ResQCoord Setup 1.0.0.exe` — installer with shortcuts

The build is not code-signed, so Windows SmartScreen may warn once. Choose **More info → Run anyway**.

## Run from source

1. Install Node.js 18 or newer.
2. Double-click **`start-desktop.bat`**.

Or manually, from the repository root:

```bat
npm install
npm start
```

The first `npm install` downloads Electron and can take a few minutes.

## Build a Windows app

```bat
npm run dist
```

Outputs in `release\`:

- `ResQCoord Setup 1.0.0.exe` — installer
- `ResQCoord 1.0.0.exe` — portable app

## Important

- The desktop app always uses `http://127.0.0.1:31777`.
- Keep that port unchanged, or the app will see an empty IndexedDB database.
- Desktop data is stored in `%APPDATA%\resqcoord`, separate from Edge/Chrome.
- Allow Windows location access for real GPS: **Settings → Privacy & security → Location**.
- The browser version still runs with `node server.js 3000`.

## Multi-computer note

This desktop wrapper still stores data locally. It does **not** synchronize responders on different PCs. Multi-PC live tracking needs a shared backend (Node/Express + WebSocket + SQLite/PostgreSQL).
