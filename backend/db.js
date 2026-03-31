const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'inventory.db');

const db = new Database(DB_PATH);

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    description TEXT,
    ha_supported INTEGER NOT NULL DEFAULT 0
  )
`);

// Migration: add ha_supported column to existing databases
const cols = db.pragma('table_info(products)');
if (!cols.some(c => c.name === 'ha_supported')) {
  db.exec('ALTER TABLE products ADD COLUMN ha_supported INTEGER NOT NULL DEFAULT 0');
  // All existing seeded products in this store support Home Assistant
  db.exec('UPDATE products SET ha_supported = 1');
}

// Seed with 20 products if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, sku, description, ha_supported) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

    const seedProducts = [
    // HVAC & Climate Control
    ['Daikin Altherma 3 R HT 14kW', 'HVAC & Climate Control', 4999.00, 8, 'SN-001', 'High-temperature air-to-water heat pump, HA-compatible via Daikin Onecta integration, up to A+++ rated', 1],
    ['Mitsubishi Ecodan Air Source Heat Pump 8.5kW', 'HVAC & Climate Control', 3299.00, 12, 'SN-002', 'Air-to-water heat pump with MELCloud WiFi module, native Home Assistant integration via MELCloud', 1],
    ['Sensibo Sky Smart AC Controller', 'HVAC & Climate Control', 99.00, 45, 'SN-003', 'Retrofit IR controller for any AC unit, official Home Assistant integration, scheduling and presence detection', 1],
    ['Airzone AIDOO Control for Daikin/Mitsubishi', 'HVAC & Climate Control', 189.00, 30, 'SN-004', 'Zone-by-zone HVAC management gateway with native Home Assistant HVAC entities over local API', 1],

    // Geothermal & Heat Pumps
    ['NIBE F1145-6 Ground Source Heat Pump', 'Geothermal & Heat Pumps', 5499.00, 5, 'SN-005', '6 kW ground-source heat pump, NIBE Uplink cloud + local Modbus, full Home Assistant climate entity support', 1],
    ['Vaillant geoTHERM 6kW VWS 60/2', 'Geothermal & Heat Pumps', 4799.00, 6, 'SN-006', 'Brine-to-water ground heat pump, integrated VR900 eBUS interface for Home Assistant via multiMATIC add-on', 1],
    ['NIBE SMO 40 Controller Module', 'Geothermal & Heat Pumps', 649.00, 18, 'SN-007', 'Smart control module for NIBE heat pump systems, exposes Modbus TCP for direct Home Assistant polling', 1],

    // Solar & Inverters
    ['SolarEdge SE10K HD-Wave Inverter', 'Solar & Inverters', 1299.00, 15, 'SN-008', '10 kW single-phase string inverter with SetApp commissioning, integrates with HA via SolarEdge Modbus or cloud API', 1],
    ['Fronius Symo GEN24 10.0 Plus Inverter', 'Solar & Inverters', 1549.00, 12, 'SN-009', 'Hybrid 10 kW inverter with integrated battery backup port, local Modbus TCP + SunSpec for Home Assistant', 1],
    ['Huawei SUN2000-10KTL-M2 Inverter', 'Solar & Inverters', 1199.00, 18, 'SN-010', '10 kW three-phase inverter, Modbus TCP over WiFi dongle, seamlessly mapped as HA solar_production sensor', 1],
    ['Resol DeltaSol BX Plus Solar Controller', 'Solar & Inverters', 199.00, 30, 'SN-011', 'Solar thermal controller for flat-plate/evacuated-tube collectors, RS-485 Modbus bridge to Home Assistant', 1],

    // Energy Storage
    ['Tesla Powerwall 3 (13.5 kWh)', 'Energy Storage', 8999.00, 7, 'SN-012', 'All-in-one battery + inverter, integrates with HA via Tesla custom integration or local Gateway REST API', 1],
    ['Victron Energy MultiPlus-II 48/5000', 'Energy Storage', 1899.00, 14, 'SN-013', 'Bidirectional inverter/charger, Venus OS GX exposes full Modbus TCP; official Victron HA integration', 1],
    ['BYD Battery-Box Premium HVS 10.2 kWh', 'Energy Storage', 4499.00, 9, 'SN-014', 'High-voltage stackable lithium battery, pairs with Fronius/SolarEdge inverters, HA state-of-charge via Modbus', 1],

    // Home Assistant Hardware
    ['Home Assistant Yellow (CM4 Kit)', 'Home Assistant Hardware', 129.00, 55, 'SN-015', 'Official HA hub with Zigbee, Thread/Matter, M.2 NVMe slot; plug-and-play for local smart home control', 1],
    ['Home Assistant Green', 'Home Assistant Hardware', 99.00, 70, 'SN-016', 'Entry-level HA hub, no soldering needed, 16 GB eMMC, USB ports for Z-Wave/Zigbee sticks', 1],
    ['Aeotec Z-Stick 7 (Z-Wave 700 USB)', 'Home Assistant Hardware', 49.00, 80, 'SN-017', 'Z-Wave Plus 700-series USB stick, works with HA Z-Wave JS integration out of the box', 1],
    ['HUSBZB-1 Dual Zigbee + Z-Wave USB Stick', 'Home Assistant Hardware', 59.00, 60, 'SN-018', 'Combo Zigbee + Z-Wave USB coordinator, single dongle for full HA Zigbee2MQTT + Z-Wave JS stack', 1],

    // Sensors & Monitoring
    ['SMA Sunny Home Manager 2.0', 'Sensors & Monitoring', 299.00, 22, 'SN-019', 'Whole-home energy manager with Speedwire/Modbus; integrates solar, battery and grid data into HA energy dashboard', 1],
    ['Shelly Pro 3EM Three-Phase Energy Meter', 'Sensors & Monitoring', 109.00, 65, 'SN-020', '3-phase 120 A clamp energy monitor, local REST/MQTT API, native Home Assistant integration with auto-discovery', 1],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(...item);
    }
  });

  insertMany(seedProducts);
  console.log('Database seeded with 20 products.');
}

module.exports = db;
