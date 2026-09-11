const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'shopverse.db');

let db = null;
let SQL = null;

async function getDb() {
  if (db) return db;

  if (!SQL) {
    SQL = await initSqlJs();
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
      initSchema();
      saveDb();
      return db;
    } catch (err) {
      console.error('Error loading existing db file, initializing fresh:', err);
    }
  }

  db = new SQL.Database();
  initSchema();
  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

function initSchema() {
  if (!db) return;

  try {
    const cols = db.prepare("PRAGMA table_info(orders);");
    const existing = [];
    while (cols.step()) { existing.push(cols.getAsObject().name); }
    cols.free();
    if (existing.length > 0 && !existing.includes('payment_status')) {
      db.run("DROP TABLE IF EXISTS orders;");
      db.run("DROP TABLE IF EXISTS order_items;");
    }
  } catch (e) {}

  const schema = `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image TEXT,
      parent_id INTEGER NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      logo TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS category_brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      brand_id INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
      FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE CASCADE,
      UNIQUE(category_id, brand_id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      subcategory_id INTEGER NULL,
      brand_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      price REAL NOT NULL,
      mrp REAL NOT NULL,
      discount REAL DEFAULT 0,
      rating REAL DEFAULT 4.2,
      review_count INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 15,
      sku TEXT UNIQUE,
      thumbnail TEXT,
      badge TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id),
      FOREIGN KEY (subcategory_id) REFERENCES categories (id),
      FOREIGN KEY (brand_id) REFERENCES brands (id)
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      variant_name TEXT NOT NULL,
      value TEXT NOT NULL,
      price REAL,
      stock INTEGER DEFAULT 10,
      sku TEXT,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_specs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      spec_key TEXT NOT NULL,
      spec_value TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'guest',
      customer_name TEXT,
      phone TEXT,
      email TEXT,
      shipping_address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      subtotal REAL NOT NULL,
      delivery_charge REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      items TEXT NOT NULL,
      payment_gateway TEXT DEFAULT 'razorpay',
      payment_order_id TEXT,
      payment_id TEXT,
      payment_status TEXT DEFAULT 'PENDING',
      order_status TEXT DEFAULT 'PAYMENT_PENDING',
      idempotency_key TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      variant_id INTEGER NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    CREATE TABLE IF NOT EXISTS inventory_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      change_amount INTEGER NOT NULL,
      reason TEXT,
      order_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    CREATE INDEX IF NOT EXISTS idx_products_cat ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_subcat ON products(subcategory_id);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
    CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders(payment_status);
  `;
  db.run(schema);
}

function sanitizeParams(params) {
  if (!params || !Array.isArray(params)) return [];
  return params.map(p => (p === undefined ? null : p));
}

function query(sql, params = []) {
  if (!db) throw new Error('Database not initialized. Call getDb() first.');
  const sanitized = sanitizeParams(params);
  let stmt;
  try {
    stmt = db.prepare(sql);
    if (sanitized && sanitized.length > 0) {
      stmt.bind(sanitized);
    }
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    return results;
  } catch (err) {
    const msg = typeof err === 'string' ? err : (err?.message || 'Database query error');
    console.error(`[DB QUERY ERROR] SQL: ${sql} | Params: ${JSON.stringify(sanitized)} | Error: ${msg}`);
    throw new Error(msg);
  } finally {
    if (stmt) {
      try { stmt.free(); } catch (_) {}
    }
  }
}

function queryOne(sql, params = []) {
  const res = query(sql, params);
  return res.length > 0 ? res[0] : null;
}

function run(sql, params = []) {
  if (!db) throw new Error('Database not initialized. Call getDb() first.');
  const sanitized = sanitizeParams(params);
  let stmt;
  try {
    if (sanitized && sanitized.length > 0) {
      stmt = db.prepare(sql);
      stmt.bind(sanitized);
      stmt.step();
    } else {
      db.run(sql);
    }
    saveDb();
  } catch (err) {
    const msg = typeof err === 'string' ? err : (err?.message || 'Database run error');
    console.error(`[DB EXEC ERROR] SQL: ${sql} | Params: ${JSON.stringify(sanitized)} | Error: ${msg}`);
    throw new Error(msg);
  } finally {
    if (stmt) {
      try { stmt.free(); } catch (_) {}
    }
  }
}

module.exports = {
  getDb,
  saveDb,
  initSchema,
  query,
  queryOne,
  run,
  DB_FILE,
};
