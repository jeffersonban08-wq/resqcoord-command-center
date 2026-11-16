# ResQCoord — Step-by-Step Guide (1 → end)

This guide takes you from an unopened folder to a fully working command center, then walks through every major feature in order. Follow the numbers.

**Project folder used in this guide**

```text
C:\Users\Jefferson\Documents\Default Project\ResQCoord
```

If you unzip the project somewhere else, use that path instead.

---

## Part A — Before you start

**1.** Install **Node.js LTS** (version 18 or newer) from <https://nodejs.org>. The installer includes npm, but the project has **no npm dependencies**.

**2.** Open a terminal and confirm Node is available:

```bat
node -v
```

You should see a version such as `v20.x` or `v26.x`.

**3.** Confirm the project folder contains `index.html`, `server.js`, `admin/`, `user/`, `assets/`, and `docs/`.

**4.** Use a modern browser: Chrome, Edge, Firefox, or Brave. Keep it updated; the app uses IndexedDB, Web Crypto, and Web Locks.

**5.** Check that you have internet access if you want map tiles and OSRM road routes. The app still works offline with a local map background and a direct-route fallback.

---

## Part B — Start the app

**6.** Open the project folder in File Explorer.

**7.** Double-click **`start.bat`**.

A command window opens and prints:

```text
ResQCoord command center is running
Local URL:   http://localhost:3000
Landing:     http://localhost:3000/index.html
Responder:   http://localhost:3000/user/login.html
Admin:       http://localhost:3000/admin/login.html

Demo accounts
Admin:       admin@resqcoord.ph / Admin@123
Responder:   j.reyes@resqcoord.ph / User@123
```

The default browser opens the landing page automatically.

**Alternative (manual start):**

```bat
cd "C:\Users\Jefferson\Documents\Default Project\ResQCoord"
node server.js
```

For another port:

```bat
node server.js 8080
```

Then open `http://localhost:8080`.

**8.** Do **not** double-click the HTML files. Always use the local URL. `http://localhost` is required for IndexedDB, real GPS, and PBKDF2 password hashing.

**9.** You should now see the ResQCoord landing page with the dark command-center design, the live map preview, and links to both portals.

---

## Part C — Responder portal

### Sign in

**10.** Click **Responder sign in**, or open:

```text
http://localhost:3000/user/login.html
```

**11.** Use the demo responder account:

| Field | Value |
| --- | --- |
| Email | `j.reyes@resqcoord.ph` |
| Password | `User@123` |

**12.** Click **Sign in**. You should land on:

```text
http://localhost:3000/user/dashboard.html
```

**13.** A toast should say **“Field dashboard ready”**. The left sidebar shows Dashboard, My Mission, Live Map, Messages, Report Incident, and Settings.

### Dashboard

**14.** On **Dashboard**, review the four KPI cards:

- Deployed team: Team Alpha with 12 personnel.
- Mission progress: 70% and 7 of 10 grid cells.
- Next check-in: a countdown window.
- My status: On site, GPS locked, ±8 m accuracy.

**15.** Review the mission card, checkpoint list, recent activity, and quick actions.

**16.** Use the **status selector** to change your field status to En route or Standby. The dashboard updates immediately and writes the change to the database.

### Live map and tracking

**17.** Click **Live Map**. You should see the Leaflet map centered on Mt. Lantin with sector polygons and team markers.

**18.** Click **Streets**, **Satellite**, or **Terrain** to switch base layers. Click **Sectors** to hide or show the sector overlays.

**19.** Click **Demo movement**. A toast confirms the simulation started, the button changes to **Stop demo**, and the GPS badge changes to **Demo live**.

**20.** Watch the Latitude, Longitude, Speed, and Source fields. Every 2.2 seconds the position changes and a trail point is stored.

**21.** Click **Stop demo** when you finish. The button returns to **Demo movement**.

**22.** Optional real GPS: click **Use my GPS** and allow the browser location prompt. If permission is denied, the app shows the exact reason and tells you to use demo movement.

### Route planning

**23.** On the Live Map toolbar, click **Route**. The route panel opens.

**24.** Leave **From** as *My current position*.

**25.** Choose a destination such as **Ridge Marker — Km 7.5 · checkpoint 4**.

**26.** Click **Get route**. After a moment the map draws the route, and the result panel shows:

- Distance (for example 2.53 km)
- Estimated travel time
- Destination
- Source: **OSRM / OSM** when online, **Offline fallback** when offline
- Turn-by-turn steps

**27.** Click **Start navigation**. Your marker follows the route and the coordinate strip shows the remaining distance. Click **Stop navigation** to stop, or let it reach the destination; the final position is saved.

**28.** Use the **Find** box to search for a place by name. If Nominatim is unreachable, the built-in Mt. Lantin places still work.

### Check-in

**29.** Open **Dashboard** and click **Check in now**, or use the sidebar **Check in** action.

**30.** Choose a status, add a note such as “All clear at the saddle”, and click **Send check-in**.

**31.** You should see **“Check-in sent”**, the last check-in changes to **just now**, and the check-in count increases. The record includes your live coordinates, team, note, and timestamp.

### Report an incident

**32.** Open **Report Incident** from the sidebar.

**33.** Choose an incident type (for example **Hazard**), choose a severity (**High**), and write a description such as “Loose rockfall above the gully crossing”.

**34.** The location field is filled from your current GPS position. Click **Refresh GPS** if needed.

**35.** Click **Submit report**. A toast shows the new incident number (for example **INC-9383**). The incident is stored as `open` and appears on the admin dashboard.

### Messages

**36.** Open **Messages**. The secure channel shows command broadcasts plus your own field messages and incident notifications.

**37.** Type a reply and press **Send** (or Enter). The message is stored and the unread counter clears.

### SOS

**38.** Click **SOS Alert** in the sidebar, or **Activate SOS** on the mission view.

**39.** Describe the emergency and click **Activate SOS now**.

**40.** Expected results: your team status becomes **SOS**, a critical incident is created, command is notified, and the SOS toast appears. Only use this for a real emergency in production; here it is a safe demo.

**41.** Clear the alert from **Update status → Clear SOS**. The status returns to On site and a confirmation toast appears.

### Settings

**42.** Open **Settings**. Review the profile details, security panel, preferences, and data information.

**43.** Edit your phone, organization, certification, or title, then click **Save changes**. A **“Settings saved”** toast appears.

**44.** Change **Check-in interval** and toggle **Share location** / **Background tracking**. These preferences are written to the settings store.

**45.** To test password security, use **Change password** with a current/new/confirm combination. The new password works on the next login; PBKDF2-SHA256 hashes are stored, never plain text.

**46.** Click the settings **Sign out** button to return to the responder login page.

---

## Part D — Admin portal

### Sign in

**47.** Open:

```text
http://localhost:3000/admin/login.html
```

**48.** Use the demo admin account:

| Field | Value |
| --- | --- |
| Email | `admin@resqcoord.ph` |
| Password | `Admin@123` |

**49.** Click **Enter command center**. You should land on:

```text
http://localhost:3000/admin/dashboard.html
```

**50.** Confirm the sidebar shows Overview, Live Map, Missions, Personnel, Incidents, Broadcast, Reports, Activity Log, and Settings. A **“Command dashboard ready”** toast appears.

### Overview

**51.** Review the KPI cards (deployed teams, active missions, open incidents, personnel) and the readiness/alert panels.

**52.** Review the SOS alert list, active mission list, incident feed, and recent activity. Any responder check-in, incident, or SOS from Part C is visible here.

### Live map

**53.** Open **Live Map**. All teams are plotted and continue to patrol their sectors.

**54.** Click a team card in **Deployed teams**, for example **Team Alpha**.

**55.** The **Team detail** panel shows lead, personnel, speed, battery, last update, and coordinates.

**56.** Click **Focus** to fly to the team. Click **Show trail** to draw its recent path; click **Clear trail** to remove it.

**57.** Choose a destination in **Assign a destination** and click **Route team**. The command map draws the route and the result line shows something like “179 m · 1 min · road route”. The assignment is stored for the team.

**58.** Toggle **Trails**, switch base layers, toggle **Sectors**, and click **Fit all teams** to verify every map control.

### Missions

**59.** Open **Missions**. The register lists seeded missions with code, status, priority, lead, team, progress, and date.

**60.** Click **New mission** (or the sidebar **New mission** action).

**61.** Fill in the mission name, type, priority, status, sector, assigned team, lead, staging place, progress, subjects, brief, and hazards, then click **Dispatch mission**.

**62.** Confirm the new row appears with a new mission code (for example MSN-2026-015) and an **“Mission created”** toast.

**63.** Use the row **advance** action to raise progress (for example 15% → 25%). Use the **edit** action to change details. Click a mission to open its detail panel.

**64.** Click **Missions CSV** to download the register as a CSV file.

### Personnel

**65.** Open **Personnel**. The table lists admins and responders with responder IDs and statuses.

**66.** Click **Add responder**. Fill in name, email, phone, role, team, title, certification, and temporary password, then click **Create account**.

**67.** Confirm the new row appears and the total increases. The new account can sign in through the responder portal.

**68.** Use the row **Edit** action to update details.

**69.** Use the row **Suspend** action and confirm. Status changes to **Suspended**, and that account is blocked from signing in. Click again to reactivate.

**70.** Use the row **Delete** action and confirm removal. Deleted accounts cannot sign in.

**71.** Click **Personnel CSV** to export the directory.

### Incidents

**72.** Open **Incidents**. Each card shows the incident code, reporter, sector, age, assigned team, status, and description.

**73.** On an open incident, click **Acknowledge**. The status changes and a toast confirms the update.

**74.** Click **Escalate** to raise the incident for command attention.

**75.** Click **Resolve**, add a resolution note if the dialog appears, and confirm. The open count drops and the card shows Resolved.

**76.** Click **Assign team**, choose a team, add an instruction, and click **Assign**. The card shows the assigned team and an audit entry is written.

**77.** Click **Show on map** to jump to the command map and locate the incident.

**78.** Click **Incidents CSV** to export the incident register.

### Broadcast

**79.** Open **Broadcast** (or Messages → Broadcast). Choose a channel, choose a priority, type a message (maximum 500 characters), and click **Send broadcast**.

**80.** Confirm the message appears at the top of the channel feed and a **“Broadcast sent”** toast appears.

**81.** If a responder dashboard is open in another tab or window, the message appears there through the shared database and cross-tab notification.

### Reports and exports

**82.** Open **Reports**. Review mission totals/active counts, incident totals/unresolved counts, check-ins, and team readiness.

**83.** Switch the range between **Last 7 days**, **Last 30 days**, **Last 90 days**, and **All data**. The incident trend chart and summary tables update.

**84.** Use **Export snapshot** to download missions, personnel, incidents, or the activity log as CSV, or **Full database JSON** for a complete backup.

**85.** In a spreadsheet app, confirm the CSV opens with headers and one row per record.

### Activity log

**86.** Open **Activity Log**. Confirm entries for logins, broadcasts, mission changes, incident updates, personnel changes, SOS, and data operations.

**87.** Click **Export CSV** to download the audit trail.

### Settings

**88.** Open **Settings**. In the **Command profile** card, update your name, phone, title, or organization, then click **Save changes**.

**89.** In **Security**, change the admin password if desired. Remember the new password or change it back to `Admin@123` for the demo.

**90.** In **System**, toggle **Live simulation**, **SOS sound**, **Strict check-in**, and **GPS accuracy overlay**, and confirm the switches save.

**91.** Review **Storage engine** (IndexedDB or localStorage fallback), **Records** count, **Last export**, and the admin access code.

**92.** Click **Download full JSON backup** and keep the file if you want a snapshot of the database.

**93.** Click **Reset demo database**, read the confirmation, and click **Reset everything**. The seeded accounts, teams, missions, incidents, and messages are restored. Your current admin session survives the reset.

---

## Part E — Registration flows

**94.** Sign out, open the responder registration page:

```text
http://localhost:3000/user/register.html
```

**95.** Enter a name, organization, new email, team, password (at least 8 characters with letters and a number), confirmation, and phone.

**96.** Click **Create responder account**. You are signed in automatically and redirected to the field dashboard. The new responder ID (for example FR-0205) appears in Settings.

**97.** Sign out, open the admin registration page:

```text
http://localhost:3000/admin/register.html
```

**98.** Fill in the admin details. Use the access code **`RESQ-ADMIN-2026`**.

**99.** First try a wrong code; the form shows **“Invalid admin access code”** and does not create the account.

**100.** Enter the correct code and click **Create admin account**. You are redirected to the command dashboard with a new admin ID such as ADM-0002.

---

## Part F — Verify persistence and role security

**101.** Reload the dashboard with **F5**. Your session, profile changes, mission/incident updates, positions, and settings should still be there.

**102.** Close the browser completely, reopen `http://localhost:3000`, and sign in again. The data remains in IndexedDB.

**103.** While signed in as a responder, open the admin dashboard URL directly. The role guard redirects you to the responder dashboard.

**104.** While signed in as an admin, open the responder dashboard URL directly. The role guard redirects you to the admin dashboard.

**105.** Try signing in to the responder portal with the admin email. The portal refuses with **“Administrators must sign in through the admin portal.”**

**106.** Suspend a responder account in **Personnel**, then try to sign in with it. The login is blocked with a suspension message.

---

## Part G — Stop, restart, and reset

**107.** To stop the server, click the command window and press **Ctrl+C**.

**108.** To restart, run `start.bat` again, or `node server.js`.

**109.** If port 3000 is busy, run `node server.js 3001` and use `http://localhost:3001`.

**110.** To wipe all local data, open Admin → Settings → **Reset demo database**.

**111.** For a hard browser reset, open DevTools → **Application** → **Storage** → **Clear site data**, then reload. The app reseeds on the next load.

**112.** Note that storage is tied to the origin. `http://localhost:3000` and `http://localhost:3001` have separate databases.

---

## Part H — Customize the demo

**113.** Change the organization name, logo, and copy in `index.html` and the four portal pages.

**114.** Change design colors and spacing in `assets/css/base.css` (tokens) and `assets/css/app.css` (layout/components).

**115.** Change the admin access code in `assets/js/db.js` (`DEMO.adminCode`) and in the registration hint/settings markup.

**116.** Change seeded users, teams, missions, incidents, and messages in the `seed()` function inside `assets/js/db.js`.

**117.** Change map center, sectors, and base layers in `assets/js/mapkit.js`.

**118.** Change place presets and routing endpoints in `assets/js/routing.js`.

**119.** After editing, hard-reload with **Ctrl+F5** so the browser fetches the new CSS/JS.

---

## Part I — Deploy or share

**120.** To share on a local network, run `node server.js 3000`, find your computer's LAN IP with `ipconfig`, and open `http://YOUR-IP:3000` from another device on the same network.

**121.** For an online static host (GitHub Pages, Netlify, Cloudflare Pages), upload the entire folder. The app is static, so no server-side runtime is required.

**122.** HTTPS is required for real GPS and Web Crypto on a hosted domain. `localhost` is treated as secure automatically.

**123.** Keep the `assets/vendor/leaflet` folder with the site; the map library is loaded locally, not from a CDN.

---

## Part J — Final checklist

**124.** Landing page opens and both portal links work.

**125.** Responder login with `j.reyes@resqcoord.ph` / `User@123` works.

**126.** Admin login with `admin@resqcoord.ph` / `Admin@123` works.

**127.** Demo movement changes coordinates and the map marker.

**128.** Route planning draws a route with distance, ETA, and steps.

**129.** Check-in, incident report, message, and SOS each create records.

**130.** Admin sees the responder's records, can acknowledge/resolve incidents, assign routes, and broadcast.

**131.** Mission creation, progress advance, and CSV export work.

**132.** Personnel create/suspend/delete works.

**133.** Reports charts render and JSON export downloads.

**134.** Activity Log records the actions.

**135.** Reset demo database restores the seeded state.

**136.** Reloading the browser keeps the data.

**137.** No red console errors appear during normal use.

You have completed the full ResQCoord walkthrough. For the complete source of every file, open [`ALL-CODE.md`](ALL-CODE.md).
