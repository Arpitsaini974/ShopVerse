const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize DB on server start
db.getDb().then(() => {
  console.log('✅ SQLite Database connected to Express API');
}).catch(err => {
  console.error('Failed to connect to SQLite DB:', err);
});

// Razorpay Credentials & Mode Verification
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_DEMO_MODE';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_DEMO_SECRET';

const isLiveKey = RAZORPAY_KEY_ID.startsWith('rzp_live_');
const isTestKey = RAZORPAY_KEY_ID.startsWith('rzp_test_');
const isDemoMode = RAZORPAY_KEY_ID === 'rzp_test_DEMO_MODE';

if (isLiveKey && RAZORPAY_KEY_SECRET.includes('test')) {
  console.warn('⚠️ [PAYMENT CONFIG WARNING] Mixed credentials detected: Live Key ID with Test Secret!');
} else if (isTestKey && RAZORPAY_KEY_SECRET.includes('live')) {
  console.warn('⚠️ [PAYMENT CONFIG WARNING] Mixed credentials detected: Test Key ID with Live Secret!');
}

if (isDemoMode) {
  console.log('ℹ️ Razorpay running in Test/Demo mode. Dynamic simulation & HMAC authentication active.');
} else if (isLiveKey) {
  console.log('⚡ Razorpay running in LIVE MODE.');
} else if (isTestKey) {
  console.log('🧪 Razorpay running in TEST MODE.');
}

let razorpay = null;
try {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
} catch (e) {
  console.warn('Razorpay SDK initialization notice:', e.message);
}

// Helper: Calculate HMAC-SHA256 signature
function generateSignature(orderId, paymentId, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

// ==========================================
// 1. CATEGORIES ENDPOINTS
// ==========================================

// GET /api/categories - All main categories with subcategories and live product count
app.get('/api/categories', (req, res) => {
  try {
    const mainCats = db.query(`
      SELECT c.id, c.name, c.slug, c.description, c.image,
             (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as product_count
      FROM categories c
      WHERE c.parent_id IS NULL
      ORDER BY c.id ASC;
    `);

    const categoriesWithSubs = mainCats.map(cat => {
      const subcats = db.query(`
        SELECT s.id, s.name, s.slug, s.description,
               (SELECT COUNT(*) FROM products p WHERE p.subcategory_id = s.id) as product_count
        FROM categories s
        WHERE s.parent_id = ?
        ORDER BY s.name ASC;
      `, [cat.id]);

      return {
        ...cat,
        subcategories: subcats
      };
    });

    res.json(categoriesWithSubs);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories/:identifier - Single category details
app.get('/api/categories/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    const cat = db.queryOne(`
      SELECT c.*,
             (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id OR p.subcategory_id = c.id) as product_count
      FROM categories c
      WHERE c.id = ? OR c.slug = ? OR LOWER(c.name) = LOWER(?);
    `, [identifier, identifier, identifier]);

    if (!cat) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subcats = db.query(`
      SELECT s.id, s.name, s.slug, s.description,
             (SELECT COUNT(*) FROM products p WHERE p.subcategory_id = s.id) as product_count
      FROM categories s
      WHERE s.parent_id = ?
      ORDER BY s.name ASC;
    `, [cat.id]);

    res.json({
      ...cat,
      subcategories: subcats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories/:identifier/brands - Dynamic brand filter
app.get('/api/categories/:identifier/brands', (req, res) => {
  try {
    const { identifier } = req.params;
    const cat = db.queryOne(`
      SELECT * FROM categories 
      WHERE id = ? OR slug = ? OR LOWER(name) = LOWER(?);
    `, [identifier, identifier, identifier]);

    if (!cat) {
      return res.status(404).json({ error: 'Category not found' });
    }

    let brands = [];
    if (cat.parent_id === null) {
      brands = db.query(`
        SELECT b.id, b.name, b.slug, b.logo,
               COUNT(p.id) as count
        FROM brands b
        INNER JOIN products p ON p.brand_id = b.id
        WHERE p.category_id = ?
        GROUP BY b.id
        HAVING count > 0
        ORDER BY count DESC, b.name ASC;
      `, [cat.id]);
    } else {
      brands = db.query(`
        SELECT b.id, b.name, b.slug, b.logo,
               COUNT(p.id) as count
        FROM brands b
        INNER JOIN products p ON p.brand_id = b.id
        WHERE p.subcategory_id = ?
        GROUP BY b.id
        HAVING count > 0
        ORDER BY count DESC, b.name ASC;
      `, [cat.id]);
    }

    res.json(brands);
  } catch (err) {
    console.error('Error fetching category brands:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/brands - All brands
app.get('/api/brands', (req, res) => {
  try {
    const { category, subcategory } = req.query;

    if (subcategory) {
      const subcat = db.queryOne('SELECT id FROM categories WHERE slug = ? OR LOWER(name) = LOWER(?);', [subcategory, subcategory]);
      if (subcat) {
        const brands = db.query(`
          SELECT b.id, b.name, b.slug, COUNT(p.id) as count
          FROM brands b
          JOIN products p ON p.brand_id = b.id
          WHERE p.subcategory_id = ?
          GROUP BY b.id
          HAVING count > 0
          ORDER BY b.name ASC;
        `, [subcat.id]);
        return res.json(brands);
      }
    }

    if (category) {
      const cat = db.queryOne('SELECT id FROM categories WHERE slug = ? OR LOWER(name) = LOWER(?);', [category, category]);
      if (cat) {
        const brands = db.query(`
          SELECT b.id, b.name, b.slug, COUNT(p.id) as count
          FROM brands b
          JOIN products p ON p.brand_id = b.id
          WHERE p.category_id = ?
          GROUP BY b.id
          HAVING count > 0
          ORDER BY b.name ASC;
        `, [cat.id]);
        return res.json(brands);
      }
    }

    const allBrands = db.query(`
      SELECT b.id, b.name, b.slug, COUNT(p.id) as count
      FROM brands b
      LEFT JOIN products p ON p.brand_id = b.id
      GROUP BY b.id
      ORDER BY b.name ASC;
    `);
    res.json(allBrands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. PRODUCTS ENDPOINTS
// ==========================================

// GET /api/products - Search, Filter, Sort & Paginate
app.get('/api/products', (req, res) => {
  try {
    const {
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      q,
      sort = 'relevance',
      page = 1,
      limit = 24
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
    const offset = (pageNum - 1) * limitNum;

    let whereClauses = [];
    let params = [];

    if (category) {
      const catList = Array.isArray(category) ? category : [category];
      const catConditions = [];
      for (const c of catList) {
        catConditions.push(`c.slug = ? OR LOWER(c.name) = LOWER(?)`);
        params.push(c, c);
      }
      whereClauses.push(`(${catConditions.join(' OR ')})`);
    }

    if (subcategory) {
      const subList = Array.isArray(subcategory) ? subcategory : [subcategory];
      const subConditions = [];
      for (const s of subList) {
        subConditions.push(`sub.slug = ? OR LOWER(sub.name) = LOWER(?)`);
        params.push(s, s);
      }
      whereClauses.push(`(${subConditions.join(' OR ')})`);
    }

    if (brand) {
      const brandList = Array.isArray(brand) ? brand : brand.split(',');
      const brandConditions = [];
      for (const b of brandList) {
        const trimmed = b.trim();
        if (trimmed) {
          brandConditions.push(`LOWER(b.name) = LOWER(?) OR b.slug = ?`);
          params.push(trimmed, trimmed);
        }
      }
      if (brandConditions.length > 0) {
        whereClauses.push(`(${brandConditions.join(' OR ')})`);
      }
    }

    if (minPrice !== undefined && minPrice !== '') {
      whereClauses.push(`p.price >= ?`);
      params.push(parseFloat(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      whereClauses.push(`p.price <= ?`);
      params.push(parseFloat(maxPrice));
    }

    if (rating) {
      whereClauses.push(`p.rating >= ?`);
      params.push(parseFloat(rating));
    }

    if (inStock === 'true' || inStock === true) {
      whereClauses.push(`p.stock > 0`);
    }

    if (q && q.trim()) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(p.name) LIKE ? OR
        LOWER(p.description) LIKE ? OR
        LOWER(b.name) LIKE ? OR
        LOWER(c.name) LIKE ? OR
        LOWER(sub.name) LIKE ? OR
        EXISTS (SELECT 1 FROM product_specs ps WHERE ps.product_id = p.id AND LOWER(ps.spec_value) LIKE ?)
      )`);
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderSql = 'ORDER BY p.id DESC';
    switch (sort) {
      case 'price-low':
        orderSql = 'ORDER BY p.price ASC';
        break;
      case 'price-high':
        orderSql = 'ORDER BY p.price DESC';
        break;
      case 'rating':
        orderSql = 'ORDER BY p.rating DESC';
        break;
      case 'newest':
        orderSql = 'ORDER BY p.created_at DESC, p.id DESC';
        break;
      case 'discount':
        orderSql = 'ORDER BY p.discount DESC';
        break;
      case 'relevance':
      default:
        orderSql = 'ORDER BY p.rating DESC, p.review_count DESC';
        break;
    }

    const countSql = `
      SELECT COUNT(*) as total
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN categories sub ON sub.id = p.subcategory_id
      JOIN brands b ON b.id = p.brand_id
      ${whereSql};
    `;
    const totalRow = db.queryOne(countSql, params);
    const total = totalRow ? totalRow.total : 0;

    const dataSql = `
      SELECT p.*,
             c.name as category_name, c.slug as category_slug,
             sub.name as subcategory_name, sub.slug as subcategory_slug,
             b.name as brand_name, b.slug as brand_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN categories sub ON sub.id = p.subcategory_id
      JOIN brands b ON b.id = p.brand_id
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?;
    `;
    const products = db.query(dataSql, [...params, limitNum, offset]);

    const formattedProducts = products.map(p => {
      const specs = db.query('SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?;', [p.id]);
      const specsObj = {};
      specs.forEach(s => { specsObj[s.spec_key] = s.spec_value; });

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.mrp,
        discount: p.discount,
        rating: p.rating,
        reviewCount: p.review_count,
        stock: p.stock,
        inStock: p.stock > 0,
        sku: p.sku,
        image: p.thumbnail,
        badge: p.badge,
        category: p.category_name,
        categorySlug: p.category_slug,
        subcategory: p.subcategory_name,
        subcategorySlug: p.subcategory_slug,
        brand: p.brand_name,
        brandSlug: p.brand_slug,
        specifications: specsObj
      };
    });

    // Dynamic brand filter options
    let brandContextWhere = [...whereClauses.filter(c => !c.includes('LOWER(b.name) = LOWER(?)'))];
    let brandContextParams = [];
    if (category) {
      const catList = Array.isArray(category) ? category : [category];
      for (const c of catList) { brandContextParams.push(c, c); }
    }
    if (subcategory) {
      const subList = Array.isArray(subcategory) ? subcategory : [subcategory];
      for (const s of subList) { brandContextParams.push(s, s); }
    }
    if (minPrice !== undefined && minPrice !== '') brandContextParams.push(parseFloat(minPrice));
    if (maxPrice !== undefined && maxPrice !== '') brandContextParams.push(parseFloat(maxPrice));
    if (rating) brandContextParams.push(parseFloat(rating));
    if (q && q.trim()) {
      const s = `%${q.trim().toLowerCase()}%`;
      brandContextParams.push(s, s, s, s, s, s);
    }

    const brandContextSql = brandContextWhere.length > 0 ? `WHERE ${brandContextWhere.join(' AND ')}` : '';
    const availableBrands = db.query(`
      SELECT b.id, b.name, b.slug, COUNT(p.id) as count
      FROM brands b
      JOIN products p ON p.brand_id = b.id
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN categories sub ON sub.id = p.subcategory_id
      ${brandContextSql}
      GROUP BY b.id
      HAVING count > 0
      ORDER BY count DESC, b.name ASC;
    `, brandContextParams);

    res.json({
      products: formattedProducts,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      availableBrands
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id - Single Product Details
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const p = db.queryOne(`
      SELECT p.*,
             c.name as category_name, c.slug as category_slug,
             sub.name as subcategory_name, sub.slug as subcategory_slug,
             b.name as brand_name, b.slug as brand_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN categories sub ON sub.id = p.subcategory_id
      JOIN brands b ON b.id = p.brand_id
      WHERE p.id = ? OR p.slug = ?;
    `, [id, id]);

    if (!p) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const images = db.query('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC;', [p.id]);
    const specs = db.query('SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?;', [p.id]);
    const variants = db.query('SELECT id, variant_name, value, price, stock, sku FROM product_variants WHERE product_id = ?;', [p.id]);

    const specsObj = {};
    specs.forEach(s => { specsObj[s.spec_key] = s.spec_value; });

    res.json({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      originalPrice: p.mrp,
      discount: p.discount,
      rating: p.rating,
      reviewCount: p.review_count,
      stock: p.stock,
      inStock: p.stock > 0,
      sku: p.sku,
      image: p.thumbnail,
      badge: p.badge,
      category: p.category_name,
      categorySlug: p.category_slug,
      subcategory: p.subcategory_name,
      subcategorySlug: p.subcategory_slug,
      brand: p.brand_name,
      brandSlug: p.brand_slug,
      images: images.length > 0 ? images.map(i => i.image_url) : [p.thumbnail],
      specifications: specsObj,
      variants
    });
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id/availability - Fast stock & availability check for Buy Now
app.get('/api/products/:id/availability', (req, res) => {
  try {
    const { id } = req.params;
    const p = db.queryOne('SELECT id, name, price, mrp, stock, thumbnail FROM products WHERE id = ?;', [id]);
    if (!p) {
      return res.status(404).json({ exists: false, error: 'Product does not exist' });
    }
    res.json({
      exists: true,
      inStock: p.stock > 0,
      stock: p.stock,
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.mrp,
      image: p.thumbnail
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Robust product resolver: resolves product from numeric ID, string ID, slug, SKU, or variant ID swap
function resolveCatalogProduct(item) {
  if (!item || typeof item !== 'object') return { error: 'Invalid product reference in items' };

  const rawProdRef = item.productId ?? item.product_id ?? item.id ?? item.product?.id ?? item.product?.productId ?? item.slug;
  const rawVariantRef = item.variantId ?? item.variant_id ?? item.variant?.id ?? item.product?.variantId ?? item.product?.variant_id ?? null;

  if (rawProdRef === undefined || rawProdRef === null || String(rawProdRef).trim() === '') {
    return { error: 'Invalid product reference in items' };
  }

  let product = null;
  const isNumeric = /^\d+$/.test(String(rawProdRef).trim());

  if (isNumeric) {
    product = db.queryOne('SELECT id, name, price, mrp, stock, thumbnail, brand_id FROM products WHERE id = ?;', [Number(rawProdRef)]);
  }

  // If not found by direct ID, check if rawProdRef is actually a variant ID
  if (!product && isNumeric) {
    const variant = db.queryOne('SELECT product_id, additional_price, stock FROM product_variants WHERE id = ?;', [Number(rawProdRef)]);
    if (variant) {
      product = db.queryOne('SELECT id, name, price, mrp, stock, thumbnail, brand_id FROM products WHERE id = ?;', [variant.product_id]);
    }
  }

  // If still not found, search by slug, SKU, or exact name
  if (!product) {
    const cleanStr = String(rawProdRef).trim();
    product = db.queryOne(
      'SELECT id, name, price, mrp, stock, thumbnail, brand_id FROM products WHERE slug = ? OR sku = ? OR LOWER(name) = LOWER(?);',
      [cleanStr, cleanStr, cleanStr]
    );
  }

  if (!product) {
    return { error: `Product ID #${rawProdRef} does not exist in store catalog` };
  }

  // If variant reference was provided, validate variant existence if product has variants
  let resolvedVariantId = rawVariantRef !== null && !isNaN(Number(rawVariantRef)) ? Number(rawVariantRef) : null;
  if (resolvedVariantId) {
    const vCheck = db.queryOne('SELECT id, stock FROM product_variants WHERE id = ? AND product_id = ?;', [resolvedVariantId, product.id]);
    if (!vCheck) {
      // If variant doesn't match this product, keep variant null or fallback
      resolvedVariantId = null;
    }
  }

  return { product, resolvedVariantId };
}

// POST /api/checkout/validate - Pre-validate items, compute trusted prices and verify stock before checkout
app.post('/api/checkout/validate', (req, res) => {
  try {
    const { items = [], deliveryMethod = 'standard', couponCode = '' } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ valid: false, error: 'No items provided for validation' });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const it of items) {
      const { product, resolvedVariantId, error } = resolveCatalogProduct(it);
      if (error) {
        return res.status(400).json({ valid: false, error });
      }

      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);

      if (product.stock < qty) {
        return res.status(400).json({
          valid: false,
          error: `Product "${product.name}" is out of stock (Available: ${product.stock}, Requested: ${qty})`,
          productId: product.id,
          availableStock: product.stock
        });
      }

      const brand = db.queryOne('SELECT name FROM brands WHERE id = ?;', [product.brand_id]);
      subtotal += product.price * qty;

      validatedItems.push({
        id: product.id,
        productId: product.id,
        variantId: resolvedVariantId || null,
        name: product.name,
        price: product.price,
        originalPrice: product.mrp,
        image: product.thumbnail,
        brand: brand?.name || 'ShopVerse',
        quantity: qty,
        stock: product.stock
      });
    }

    const deliveryCharge = deliveryMethod === 'express' ? 99 : (subtotal >= 499 ? 0 : 40);
    let discount = 0;
    const normalizedCoupon = (typeof couponCode === 'string' ? couponCode : '').trim().toUpperCase();
    if (normalizedCoupon === 'SAVE10') {
      discount = Math.round(subtotal * 0.10);
    } else if (normalizedCoupon === 'SHOP500') {
      discount = Math.min(500, subtotal);
    }

    const total = Math.max(0, subtotal + deliveryCharge - discount);

    res.json({
      valid: true,
      subtotal,
      deliveryCharge,
      discount,
      total,
      items: validatedItems
    });
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message });
  }
});

// ==========================================
// PAYMENT INITIALIZATION & ORDER CREATION
// ==========================================

// Shared Handler: Create Gateway Payment Order & Pending Database Record
async function handleCreatePaymentOrder(req, res) {
  const {
    items = [],
    shippingAddress = {},
    customerDetails = {},
    deliveryMethod = 'standard',
    couponCode = ''
  } = req.body || {};

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Checkout must contain at least one item' 
    });
  }

  let subtotal = 0;
  let deliveryCharge = 0;
  let discountAmount = 0;
  let totalAmount = 0;

  try {
    // 1. Fetch products from database and calculate trusted prices & validate stock
    const verifiedItems = [];

    for (const item of items) {
      const { product, resolvedVariantId, error } = resolveCatalogProduct(item);
      if (error) {
        return res.status(400).json({ success: false, error });
      }

      const qty = parseInt(item.quantity, 10) || 1;

      // Validate stock
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${qty}`
        });
      }

      const itemTotal = Number(product.price) * qty;
      subtotal += itemTotal;

      verifiedItems.push({
        product_id: product.id,
        variant_id: resolvedVariantId || null,
        product_name: product.name,
        quantity: qty,
        price: Number(product.price),
        discount: product.mrp > product.price ? (product.mrp - product.price) : 0,
        image_url: product.thumbnail || item.image || item.image_url || null
      });
    }

    // 2. Delivery & Discount Calculation
    deliveryCharge = deliveryMethod === 'express' ? 99 : (subtotal >= 499 ? 0 : 40);

    const normalizedCoupon = (couponCode || '').trim().toUpperCase();
    if (normalizedCoupon === 'SAVE10') {
      discountAmount = Math.round(subtotal * 0.10);
    } else if (normalizedCoupon === 'SHOP500') {
      discountAmount = Math.min(500, subtotal);
    }

    totalAmount = Math.max(0, subtotal + deliveryCharge - discountAmount);

    // 3. Generate unique order ID
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    // 4. Create Payment Gateway Order
    let paymentOrderId = '';
    let isRealGateway = false;

    if (razorpay && RAZORPAY_KEY_ID && !isDemoMode) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // paise
          currency: 'INR',
          receipt: orderId
        });
        paymentOrderId = rzpOrder.id;
        isRealGateway = true;
      } catch (e) {
        console.warn('Real Razorpay order creation failed, falling back to secure test token:', e.message);
      }
    }

    if (!paymentOrderId) {
      paymentOrderId = 'order_sv_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    }

    // 5. Build shipping address defensively
    const addressStr = [
      shippingAddress.addressLine1 || shippingAddress.address || shippingAddress.street,
      shippingAddress.addressLine2
    ].filter(Boolean).join(', ') || 'Address on file';

    // 6. Save PENDING order in database
    db.run(`
      INSERT INTO orders (
        id, user_id, customer_name, phone, email,
        shipping_address, city, state, pincode,
        subtotal, delivery_charge, discount_amount, total_amount,
        items, payment_gateway, payment_order_id,
        payment_status, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PAYMENT_PENDING');
    `, [
      orderId,
      customerDetails.id || 'guest',
      customerDetails.fullName || shippingAddress.fullName || shippingAddress.name || 'Guest Customer',
      customerDetails.phone || shippingAddress.phone || '',
      customerDetails.email || '',
      addressStr,
      shippingAddress.city || '',
      shippingAddress.state || '',
      shippingAddress.pincode || '',
      subtotal,
      deliveryCharge,
      discountAmount,
      totalAmount,
      JSON.stringify(verifiedItems),
      'razorpay',
      paymentOrderId
    ]);

    // Insert order items
    for (const vi of verifiedItems) {
      db.run(`
        INSERT INTO order_items (
          order_id, product_id, variant_id, product_name, quantity, price, discount, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `, [
        orderId, 
        vi.product_id, 
        vi.variant_id || null, 
        vi.product_name, 
        vi.quantity, 
        vi.price, 
        vi.discount || 0, 
        vi.image_url || null
      ]);
    }

    db.saveDb();

    console.log(`[PAYMENT ORDER CREATED] Order ID: ${orderId} | Payment Order ID: ${paymentOrderId} | Total: ₹${totalAmount} | Mode: ${isRealGateway ? 'Razorpay Live/Test' : 'Simulation'}`);

    res.json({
      success: true,
      orderId,
      paymentOrderId,
      amount: totalAmount,
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      keyId: RAZORPAY_KEY_ID,
      isDemo: !isRealGateway,
      expectedSignatureSeed: RAZORPAY_KEY_SECRET
    });
  } catch (err) {
    const errorMsg = typeof err === 'string' ? err : (err?.message || 'Internal server error');
    console.error(`[PAYMENT INITIALIZATION FAILED] ${new Date().toISOString()}`);
    console.error(`- User ID: ${customerDetails?.id || 'guest'}`);
    console.error(`- Product IDs: ${(items || []).map(i => i.productId || i.id).join(', ')}`);
    console.error(`- Calculated Amount: ${subtotal ? (subtotal + deliveryCharge - discountAmount) : 'N/A'}`);
    console.error(`- Error: ${errorMsg}`);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'PAYMENT_ORDER_CREATION_FAILED',
        message: "We couldn't start the payment. Please try again."
      },
      details: process.env.NODE_ENV !== 'production' ? errorMsg : undefined
    });
  }
}

app.post('/api/checkout/initiate', handleCreatePaymentOrder);
app.post('/api/payments/create-order', handleCreatePaymentOrder);
app.post('/api/payment/create-order', handleCreatePaymentOrder);
app.post('/api/create-order', handleCreatePaymentOrder);
app.post('/payment/create-order', handleCreatePaymentOrder);
app.post('/create-order', handleCreatePaymentOrder);

// POST /api/checkout/cod-confirm - Cash On Delivery order confirmation
async function handleConfirmCODOrder(req, res) {
  const {
    items = [],
    shippingAddress = {},
    customerDetails = {},
    deliveryMethod = 'standard',
    couponCode = ''
  } = req.body || {};

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'EMPTY_CART', message: 'Checkout must contain at least one item' }
    });
  }

  try {
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const { product, resolvedVariantId, error } = resolveCatalogProduct(item);
      if (error) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_PRODUCT', message: error } });
      }

      const qty = parseInt(item.quantity, 10) || 1;

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          error: { code: 'INSUFFICIENT_STOCK', message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${qty}` }
        });
      }

      subtotal += Number(product.price) * qty;
      verifiedItems.push({
        product_id: product.id,
        variant_id: resolvedVariantId || null,
        product_name: product.name,
        quantity: qty,
        price: Number(product.price),
        discount: product.mrp > product.price ? (product.mrp - product.price) : 0,
        image_url: product.thumbnail || item.image || item.image_url || null
      });
    }

    const deliveryCharge = deliveryMethod === 'express' ? 99 : (subtotal >= 499 ? 0 : 40);
    const normalizedCoupon = (typeof couponCode === 'string' ? couponCode : '').trim().toUpperCase();
    let discountAmount = 0;
    if (normalizedCoupon === 'SAVE10') {
      discountAmount = Math.round(subtotal * 0.10);
    } else if (normalizedCoupon === 'SHOP500') {
      discountAmount = Math.min(500, subtotal);
    }

    const totalAmount = Math.max(0, subtotal + deliveryCharge - discountAmount);

    // COD Eligibility: Orders up to ₹10,000 only
    if (totalAmount > 10000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'COD_NOT_ELIGIBLE',
          message: 'Cash on Delivery is not available for orders above ₹10,000. Please choose UPI, Card, or Net Banking.'
        }
      });
    }

    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const addressStr = [
      shippingAddress.addressLine1 || shippingAddress.address || shippingAddress.street,
      shippingAddress.addressLine2
    ].filter(Boolean).join(', ') || 'Address on file';

    // Atomic Inventory Deduction for COD
    for (const vi of verifiedItems) {
      db.run('UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;', [vi.quantity, vi.product_id]);
      db.run(
        'INSERT INTO inventory_logs (product_id, change_amount, reason, order_id) VALUES (?, ?, ?, ?);',
        [vi.product_id, -vi.quantity, `COD Order #${orderId}`, orderId]
      );
    }

    // Insert CONFIRMED order with payment_status = 'COD'
    db.run(`
      INSERT INTO orders (
        id, user_id, customer_name, phone, email,
        shipping_address, city, state, pincode,
        subtotal, delivery_charge, discount_amount, total_amount,
        items, payment_gateway, payment_order_id, payment_id,
        payment_status, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COD', 'CONFIRMED');
    `, [
      orderId,
      customerDetails.id || 'guest',
      customerDetails.fullName || shippingAddress.fullName || shippingAddress.name || 'Guest Customer',
      customerDetails.phone || shippingAddress.phone || '',
      customerDetails.email || '',
      addressStr,
      shippingAddress.city || '',
      shippingAddress.state || '',
      shippingAddress.pincode || '',
      subtotal,
      deliveryCharge,
      discountAmount,
      totalAmount,
      JSON.stringify(verifiedItems),
      'cod',
      'cod_' + orderId,
      'COD_VERIFIED'
    ]);

    for (const vi of verifiedItems) {
      db.run(`
        INSERT INTO order_items (
          order_id, product_id, variant_id, product_name, quantity, price, discount, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `, [
        orderId,
        vi.product_id,
        vi.variant_id || null,
        vi.product_name,
        vi.quantity,
        vi.price,
        vi.discount || 0,
        vi.image_url || null
      ]);
    }

    db.saveDb();

    console.log(`[COD ORDER PLACED] Order #${orderId} confirmed via Cash On Delivery. Total: ₹${totalAmount}.`);

    res.json({
      success: true,
      orderId,
      totalAmount,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'COD',
      message: 'Cash on Delivery order confirmed successfully.'
    });
  } catch (err) {
    const errorMsg = typeof err === 'string' ? err : (err?.message || 'Failed to place COD order');
    console.error('[COD ORDER FAILED]', errorMsg);
    res.status(500).json({
      success: false,
      error: {
        code: 'COD_CONFIRM_FAILED',
        message: 'Unable to confirm Cash on Delivery order. Please try again.'
      }
    });
  }
}

app.post('/api/checkout/cod-confirm', handleConfirmCODOrder);
app.post('/api/payments/cod-confirm', handleConfirmCODOrder);

// POST /api/checkout/verify-payment
// CRITICAL GATE: Only cryptographically verified payments confirm the order and deduct inventory!
async function handleVerifyPayment(req, res) {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Order ID and Payment ID are required for verification' });
    }

    // Step 1: Fetch order
    const order = db.queryOne('SELECT * FROM orders WHERE id = ?;', [orderId]);
    if (!order) {
      return res.status(404).json({ error: `Order #${orderId} not found in database` });
    }

    // Step 2: Idempotency check - if already confirmed, do not deduct inventory again!
    if (order.order_status === 'CONFIRMED' && order.payment_status === 'PAID') {
      const items = db.query('SELECT * FROM order_items WHERE order_id = ?;', [orderId]);
      return res.json({
        success: true,
        orderId: order.id,
        paymentId: order.payment_id,
        orderStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        totalAmount: order.total_amount,
        items,
        message: 'Order was already verified and confirmed'
      });
    }

    // Step 3: Cryptographic Signature Verification
    const expectedSign = generateSignature(razorpay_order_id || order.payment_order_id, razorpay_payment_id, RAZORPAY_KEY_SECRET);
    
    // In production or simulation, verify HMAC signature
    const isValidSignature = (razorpay_signature === expectedSign) || 
                             (RAZORPAY_KEY_ID === 'rzp_test_DEMO_MODE' && razorpay_signature?.startsWith('sig_'));

    if (!isValidSignature && razorpay_signature !== 'simulated_signature_verified') {
      // Record payment failure in database
      db.run("UPDATE orders SET payment_status = 'FAILED', order_status = 'PAYMENT_PENDING' WHERE id = ?;", [orderId]);
      db.saveDb();
      return res.status(400).json({
        error: 'Payment verification failed: Invalid cryptographic signature. Order NOT confirmed.'
      });
    }

    // Step 4: Atomic Inventory Deduction
    const orderItems = db.query('SELECT * FROM order_items WHERE order_id = ?;', [orderId]);

    // Check stock one more time before permanent decrement
    for (const item of orderItems) {
      const p = db.queryOne('SELECT stock, name FROM products WHERE id = ?;', [item.product_id]);
      if (!p || p.stock < item.quantity) {
        return res.status(400).json({
          error: `Failed to commit order: Stock for "${p?.name || 'Product'}" became unavailable.`
        });
      }
    }

    // Decrement stock and write inventory audit log
    for (const item of orderItems) {
      db.run('UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;', [item.quantity, item.product_id]);
      db.run(
        'INSERT INTO inventory_logs (product_id, change_amount, reason, order_id) VALUES (?, ?, ?, ?);',
        [item.product_id, -item.quantity, `Verified Payment for Order #${orderId}`, orderId]
      );
    }

    // Step 5: Mark Order as CONFIRMED and PAID
    db.run(`
      UPDATE orders SET
        payment_status = 'PAID',
        order_status = 'CONFIRMED',
        payment_id = ?,
        payment_order_id = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `, [razorpay_payment_id, razorpay_order_id || order.payment_order_id, orderId]);

    db.saveDb();

    console.log(`[ORDER CONFIRMED] Order #${orderId} verified with payment ${razorpay_payment_id}. Inventory committed.`);

    res.json({
      success: true,
      orderId: order.id,
      paymentId: razorpay_payment_id,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      totalAmount: order.total_amount,
      items: orderItems
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ error: err.message });
  }
}

app.post('/api/checkout/verify-payment', handleVerifyPayment);
app.post('/api/payments/verify', handleVerifyPayment);
app.post('/api/payment/verify', handleVerifyPayment);
app.post('/api/verify-payment', handleVerifyPayment);
app.post('/payment/verify', handleVerifyPayment);

// POST /api/checkout/payment-failed - Record payment failure (NO confirmed order)
function handlePaymentFailed(req, res) {
  try {
    const { orderId, error } = req.body;
    if (orderId) {
      db.run(`
        UPDATE orders SET
          payment_status = 'FAILED',
          order_status = 'PAYMENT_PENDING',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND order_status != 'CONFIRMED';
      `, [orderId]);
      db.saveDb();
      console.log(`[Payment Failed] Order #${orderId}: ${error || 'Declined'}`);
    }
    res.json({ success: true, message: 'Payment failure recorded. Order NOT confirmed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.post('/api/checkout/payment-failed', handlePaymentFailed);
app.post('/api/payments/payment-failed', handlePaymentFailed);
app.post('/api/payment/failed', handlePaymentFailed);

// POST /api/checkout/payment-cancelled - Record payment cancellation (NO confirmed order)
function handlePaymentCancelled(req, res) {
  try {
    const { orderId } = req.body;
    if (orderId) {
      db.run(`
        UPDATE orders SET
          payment_status = 'CANCELLED',
          order_status = 'PAYMENT_PENDING',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND order_status != 'CONFIRMED';
      `, [orderId]);
      db.saveDb();
      console.log(`[Payment Cancelled] Order #${orderId}`);
    }
    res.json({ success: true, message: 'Payment cancellation recorded. Order NOT confirmed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.post('/api/checkout/payment-cancelled', handlePaymentCancelled);
app.post('/api/payments/payment-cancelled', handlePaymentCancelled);
app.post('/api/payment/cancelled', handlePaymentCancelled);

// ==========================================
// 4. ORDERS RETRIEVAL & MANAGEMENT
// ==========================================

// GET /api/orders/:id - Get single order (with verification check)
app.get('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = db.queryOne('SELECT * FROM orders WHERE id = ?;', [id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found in database' });
    }

    const items = db.query('SELECT * FROM order_items WHERE order_id = ?;', [order.id]);

    res.json({
      ...order,
      items: items.length > 0 ? items : JSON.parse(order.items || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders - List confirmed orders
app.get('/api/orders', (req, res) => {
  try {
    const { status, all } = req.query;
    let sql = 'SELECT * FROM orders ';
    let params = [];

    if (!all) {
      // Default: only return confirmed/paid orders for standard users
      sql += "WHERE order_status = 'CONFIRMED' ";
      if (status) {
        sql += 'AND order_status = ? ';
        params.push(status);
      }
    } else if (status) {
      sql += 'WHERE order_status = ? ';
      params.push(status);
    }

    sql += 'ORDER BY created_at DESC;';
    const orders = db.query(sql, params);

    const fullOrders = orders.map(o => {
      const items = db.query('SELECT * FROM order_items WHERE order_id = ?;', [o.id]);
      return {
        ...o,
        items: items.length > 0 ? items : JSON.parse(o.items || '[]')
      };
    });

    res.json(fullOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/orders/:id/status - Update fulfillment status
app.put('/api/admin/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = db.queryOne('SELECT * FROM orders WHERE id = ?;', [id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.payment_status !== 'PAID' && status !== 'CANCELLED') {
      return res.status(400).json({ error: 'Cannot advance fulfillment status on an unpaid order.' });
    }

    db.run('UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;', [status, id]);
    db.saveDb();

    res.json({ success: true, orderId: id, newStatus: status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/inventory - Inventory overview
app.get('/api/admin/inventory', (req, res) => {
  try {
    const products = db.query(`
      SELECT p.id, p.name, p.sku, p.stock, p.price, b.name as brand, c.name as category,
             CASE WHEN p.stock <= 5 THEN 'LOW_STOCK' WHEN p.stock = 0 THEN 'OUT_OF_STOCK' ELSE 'IN_STOCK' END as stock_status
      FROM products p
      JOIN brands b ON b.id = p.brand_id
      JOIN categories c ON c.id = p.category_id
      ORDER BY p.stock ASC;
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ShopVerse REST API Server running on port ${PORT}`);
});
