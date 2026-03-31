# SmartNest Pro — Professional Home Automation Inventory

A modern full-stack inventory management web app for a professional home automation company.
The product catalogue focuses on HVAC, geothermal heat pumps, solar panels/inverters, energy storage batteries, and the hardware & sensors needed to integrate all of these seamlessly into **Home Assistant**.

## Features
- 📦 Browse 20 pre-loaded professional HA products across 6 categories
- 🔍 Search by product name or SKU
- ��️ Filter by category (HVAC, Geothermal, Solar, Energy Storage, HA Hardware, Sensors)
- ➕ Add new products with a modal form
- ��️ Delete products with confirmation dialog
- 🔢 Update product quantities with +/− controls or direct input
- 📊 Live stats: total products, inventory value, low-stock and out-of-stock counts

## Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3), auto-seeded with 20 products on first run

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
| HVAC & Climate Control | Daikin Altherma, Mitsubishi Ecodan, Sensibo Sky, Airzone AIDOO |
| Geothermal & Heat Pumps | NIBE F1145, Vaillant geoTHERM, NIBE SMO 40 controller |
| Solar & Inverters | SolarEdge HD-Wave, Fronius Symo GEN24, Huawei SUN2000, Resol DeltaSol |
| Energy Storage | Tesla Powerwall 3, Victron MultiPlus-II, BYD Battery-Box |
| Home Assistant Hardware | HA Yellow, HA Green, Aeotec Z-Stick 7, HUSBZB-1 Combo dongle |
| Sensors & Monitoring | SMA Sunny Home Manager 2.0, Shelly Pro 3EM Energy Meter |

All products include notes on how they connect to **Home Assistant** (local Modbus TCP, official integrations, cloud APIs, or MQTT auto-discovery).
