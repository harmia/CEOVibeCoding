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
    ['Apple iPhone 15', 'Electronics', 999.99, 45, 'SKU-001', 'Latest Apple smartphone with A16 Bionic chip'],
    ['Samsung 4K TV 55"', 'Electronics', 649.99, 12, 'SKU-002', '55-inch 4K Ultra HD Smart TV'],
    ['Sony WH-1000XM5 Headphones', 'Electronics', 349.99, 30, 'SKU-003', 'Industry-leading noise cancelling wireless headphones'],
    ['Nike Air Max 270', 'Footwear', 129.99, 75, 'SKU-004', 'Comfortable running shoes with Max Air unit'],
    ['Levi\'s 501 Jeans', 'Clothing', 59.99, 120, 'SKU-005', 'Classic straight fit jeans'],
    ['Patagonia Fleece Jacket', 'Clothing', 149.99, 40, 'SKU-006', 'Recycled polyester fleece jacket'],
    ['KitchenAid Stand Mixer', 'Kitchen', 449.99, 18, 'SKU-007', '5-quart tilt-head stand mixer'],
    ['Instant Pot Duo 7-in-1', 'Kitchen', 99.99, 55, 'SKU-008', 'Multi-use programmable pressure cooker'],
    ['LEGO Star Wars Millennium Falcon', 'Toys', 849.99, 8, 'SKU-009', '7541-piece building set'],
    ['Dyson V15 Vacuum', 'Home', 699.99, 20, 'SKU-010', 'Detect cordless vacuum cleaner'],
    ['Vitamix Blender E310', 'Kitchen', 349.99, 25, 'SKU-011', 'Professional-grade blender'],
    ['Kindle Paperwhite', 'Electronics', 139.99, 60, 'SKU-012', 'Waterproof e-reader with 6.8" display'],
    ['Adidas Ultraboost 22', 'Footwear', 189.99, 50, 'SKU-013', 'High-performance running shoes'],
    ['Lodge Cast Iron Skillet 12"', 'Kitchen', 49.99, 90, 'SKU-014', 'Pre-seasoned cast iron skillet'],
    ['Apple AirPods Pro', 'Electronics', 249.99, 35, 'SKU-015', 'Active noise cancellation earbuds'],
    ['Hydroflask 32oz Water Bottle', 'Sports', 44.99, 110, 'SKU-016', 'Double-wall vacuum insulated bottle'],
    ['The North Face Backpack', 'Sports', 99.99, 42, 'SKU-017', '30L hiking daypack'],
    ['Monopoly Board Game', 'Toys', 24.99, 65, 'SKU-018', 'Classic property trading board game'],
    ['Yoga Mat Premium', 'Sports', 79.99, 38, 'SKU-019', 'Non-slip 6mm thick yoga mat'],
    ['Philips Hue Starter Kit', 'Home', 199.99, 28, 'SKU-020', 'Smart LED bulbs with bridge and app control'],
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
