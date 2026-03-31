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
    description TEXT
  )
`);

// Seed with 20 products if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
  );

    const products = [
    ['Philips Hue White & Color Starter Kit', 'Smart Lighting', 199.99, 42, 'SN-001', 'Includes 3 color-changing A19 bulbs and the Hue Bridge for full smart control'],
    ['Lutron Caseta Wireless Dimmer Switch', 'Smart Lighting', 59.99, 85, 'SN-002', 'In-wall dimmer switch with Pico remote, works with Alexa and Google Home'],
    ['Govee RGBIC LED Strip Lights 16ft', 'Smart Lighting', 34.99, 130, 'SN-003', 'Wi-Fi enabled multicolor LED strip with app and voice control'],
    ['Google Nest Learning Thermostat', 'Smart Climate', 249.99, 38, 'SN-004', 'Self-learning thermostat that programs itself and saves up to 15% on energy bills'],
    ['Ecobee SmartThermostat Premium', 'Smart Climate', 219.99, 30, 'SN-005', 'Built-in Alexa, room sensors, and air quality monitor for whole-home comfort'],
    ['Honeywell Home T6 Pro Smart Thermostat', 'Smart Climate', 119.99, 55, 'SN-006', 'Flexible scheduling and geo-fencing via smartphone app'],
    ['Ring Video Doorbell Pro 2', 'Smart Security', 249.99, 28, 'SN-007', 'Head-to-toe HD video, 3D motion detection, and two-way talk'],
    ['Arlo Pro 4 Outdoor Security Camera', 'Smart Security', 199.99, 50, 'SN-008', '2K HDR color night vision, wire-free, spotlight and siren built-in'],
    ['Google Nest Cam Indoor (Wired)', 'Smart Security', 99.99, 60, 'SN-009', '1080p HDR indoor camera with intelligent alerts and 3-hour event history'],
    ['Wyze Cam v3 Indoor/Outdoor Camera', 'Smart Security', 35.99, 120, 'SN-010', '1080p color night vision, IP65 weatherproof, works with Alexa and Google'],
    ['August Wi-Fi Smart Lock Pro', 'Smart Access', 229.99, 22, 'SN-011', 'Retrofit smart lock with auto-lock/unlock, DoorSense, and remote access'],
    ['Yale Assure Lock 2 Touchscreen', 'Smart Access', 189.99, 18, 'SN-012', 'Keypad and app entry, Matter compatible, up to 250 unique access codes'],
    ['Amazon Echo Show 10 (3rd Gen)', 'Hubs & Controllers', 249.99, 35, 'SN-013', '10.1" HD display that moves to face you, built-in Alexa smart home hub'],
    ['Samsung SmartThings Hub v3', 'Hubs & Controllers', 129.99, 40, 'SN-014', 'Central hub for Zigbee, Z-Wave, and Wi-Fi smart home devices'],
    ['Hubitat Elevation Home Automation Hub', 'Hubs & Controllers', 149.99, 25, 'SN-015', 'Local processing hub supporting Zigbee, Z-Wave, and LAN integrations'],
    ['TP-Link Kasa Smart Plug EP25 (4-pack)', 'Smart Energy', 49.99, 95, 'SN-016', 'Energy monitoring smart outlet with scheduling and voice control support'],
    ['Emporia Vue 2 Energy Monitor', 'Smart Energy', 89.99, 32, 'SN-017', 'Real-time whole-home energy monitoring with 16 circuit-level sensors'],
    ['Google Nest Protect Smoke & CO Alarm', 'Smart Sensors', 119.99, 48, 'SN-018', 'Smart smoke and carbon monoxide alarm with phone alerts and self-testing'],
    ['Fibaro Motion Sensor Z-Wave', 'Smart Sensors', 59.99, 70, 'SN-019', 'Multisensor measuring motion, temperature, light intensity, and vibration'],
    ['Aeotec MultiSensor 7 (6-in-1)', 'Smart Sensors', 69.99, 55, 'SN-020', 'Detects motion, temperature, humidity, light, UV, and vibration via Z-Wave Plus'],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(...item);
    }
  });

  insertMany(products);
  console.log('Database seeded with 20 products.');
}

module.exports = db;
