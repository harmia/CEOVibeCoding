# SmartNest — Home Automation Inventory Management

A modern full-stack web app for managing inventory of a home automation retail store.

## Features
- 📦 Browse 20 pre-loaded home automation products across 7 categories
- �� Search by product name or SKU
- 🏷️ Filter by category (Smart Lighting, Smart Climate, Smart Security, etc.)
- ➕ Add new products with a modal form
- 🗑️ Delete products with confirmation dialog
- 🔢 Update product quantities with +/− controls or direct input
- 📊 Live stats: total products, inventory value, low-stock and out-of-stock counts

## Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3), auto-seeded with 20 products

## Getting Started

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Start the backend (port 3001)
```bash
npm run dev:backend
```

### 3. Start the frontend (port 5173)
```bash
npm run dev:frontend
```

Open **http://localhost:5173** in your browser.

## Product Categories
| Category | Examples |
|---|---|
| Smart Lighting | Philips Hue, Lutron Caseta, Govee LED |
| Smart Climate | Nest Thermostat, Ecobee, Honeywell |
| Smart Security | Ring Doorbell, Arlo Camera, Nest Cam, Wyze |
| Smart Access | August Smart Lock, Yale Assure Lock |
| Hubs & Controllers | Echo Show, SmartThings Hub, Hubitat |
| Smart Energy | Kasa Smart Plug, Emporia Vue |
| Smart Sensors | Nest Protect, Fibaro, Aeotec MultiSensor |
