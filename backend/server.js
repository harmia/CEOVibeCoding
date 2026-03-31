const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Apply rate limiting to all API routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// GET all products
app.get('/api/products', (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];

  const conditions = [];
  if (search) {
    conditions.push('(name LIKE ? OR sku LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category && category !== 'All') {
    conditions.push('category = ?');
    params.push(category);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY name ASC';

  const products = db.prepare(query).all(...params);
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product
app.post('/api/products', (req, res) => {
  const { name, category, price, quantity, sku, description } = req.body;

  if (!name || !category || price == null || quantity == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price, quantity, sku' });
  }

  try {
    const result = db.prepare(
      'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, category, price, quantity, sku, description || '');
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PATCH update product quantity
app.patch('/api/products/:id/quantity', (req, res) => {
  const { quantity } = req.body;
  if (quantity == null || quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  const result = db.prepare('UPDATE products SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(product);
});

// PATCH update product
app.patch('/api/products/:id', (req, res) => {
  const { name, category, price, quantity, sku, description } = req.body;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const updated = {
    name: name ?? product.name,
    category: category ?? product.category,
    price: price ?? product.price,
    quantity: quantity ?? product.quantity,
    sku: sku ?? product.sku,
    description: description ?? product.description,
  };

  try {
    db.prepare(
      'UPDATE products SET name=?, category=?, price=?, quantity=?, sku=?, description=? WHERE id=?'
    ).run(updated.name, updated.category, updated.price, updated.quantity, updated.sku, updated.description, req.params.id);
    const result = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
});

// GET all home devices (joined with product info)
app.get('/api/home-devices', (req, res) => {
  const devices = db.prepare(`
    SELECT hd.id, hd.room, hd.added_at,
           p.id as product_id, p.name, p.category, p.price, p.sku, p.description, p.quantity
    FROM home_devices hd
    JOIN products p ON hd.product_id = p.id
    ORDER BY hd.room ASC, p.name ASC
  `).all();
  res.json(devices);
});

// POST add device to home
app.post('/api/home-devices', (req, res) => {
  const { product_id, room } = req.body;
  if (!product_id) {
    return res.status(400).json({ error: 'Missing required field: product_id' });
  }
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const result = db.prepare(
    'INSERT INTO home_devices (product_id, room) VALUES (?, ?)'
  ).run(product_id, room?.trim() || 'General');

  const device = db.prepare(`
    SELECT hd.id, hd.room, hd.added_at,
           p.id as product_id, p.name, p.category, p.price, p.sku, p.description, p.quantity
    FROM home_devices hd
    JOIN products p ON hd.product_id = p.id
    WHERE hd.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(device);
});

// DELETE remove device from home
app.delete('/api/home-devices/:id', (req, res) => {
  const result = db.prepare('DELETE FROM home_devices WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Home device not found' });
  res.json({ message: 'Device removed from home successfully' });
});

// GET categories
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
  res.json(categories.map(c => c.category));
});

app.listen(PORT, () => {
  console.log(`Inventory API running on http://localhost:${PORT}`);
});
