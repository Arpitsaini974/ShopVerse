const db = require('./db');
const { mainCategories, subcategories } = require('./categories_data');
const { brands } = require('./brands_data');
const path = require('path');
const fs = require('fs');

async function seedDatabase() {
  console.log('--- Starting ShopVerse Database Seeding ---');
  await db.getDb();

  // 1. Clear existing data
  console.log('Clearing old tables...');
  db.run('DELETE FROM inventory_logs;');
  db.run('DELETE FROM orders;');
  db.run('DELETE FROM product_specs;');
  db.run('DELETE FROM product_variants;');
  db.run('DELETE FROM product_images;');
  db.run('DELETE FROM products;');
  db.run('DELETE FROM category_brands;');
  db.run('DELETE FROM brands;');
  db.run('DELETE FROM categories;');

  // 2. Insert Main Categories & Subcategories
  console.log('Inserting categories and subcategories...');
  for (const cat of mainCategories) {
    db.run(
      'INSERT INTO categories (id, name, slug, description, image, parent_id) VALUES (?, ?, ?, ?, ?, NULL);',
      [cat.id, cat.name, cat.slug, cat.description, cat.image]
    );
  }

  for (const sub of subcategories) {
    db.run(
      'INSERT INTO categories (id, name, slug, description, image, parent_id) VALUES (?, ?, ?, ?, NULL, ?);',
      [sub.id, sub.name, sub.slug, sub.description, sub.parent_id]
    );
  }

  // 3. Insert Brands and Category_Brands mapping
  console.log('Inserting brands and category_brands relationships...');
  const brandMap = {};
  let brandIdCounter = 1;

  for (const b of brands) {
    const brandId = brandIdCounter++;
    brandMap[b.name.toLowerCase()] = brandId;
    db.run(
      'INSERT INTO brands (id, name, slug, logo, description) VALUES (?, ?, ?, ?, ?);',
      [brandId, b.name, b.slug, b.logo || null, `${b.name} Official Brand Products`]
    );

    for (const catId of b.categories) {
      db.run(
        'INSERT OR IGNORE INTO category_brands (category_id, brand_id) VALUES (?, ?);',
        [catId, brandId]
      );
    }
  }

  // Helper function to resolve category, subcategory and brand IDs
  const getCatId = (nameOrSlug) => {
    const found = mainCategories.find(c => c.name.toLowerCase() === nameOrSlug.toLowerCase() || c.slug.toLowerCase() === nameOrSlug.toLowerCase());
    return found ? found.id : 1;
  };

  const getSubcatId = (nameOrSlug, parentId) => {
    const found = subcategories.find(s => 
      (s.name.toLowerCase() === nameOrSlug.toLowerCase() || s.slug.toLowerCase() === nameOrSlug.toLowerCase()) &&
      (!parentId || s.parent_id === parentId)
    );
    return found ? found.id : null;
  };

  const getBrandId = (brandName) => {
    const brandKey = (brandName || '').toLowerCase().trim();
    if (brandMap[brandKey]) return brandMap[brandKey];
    // fallback create or find
    for (const [key, id] of Object.entries(brandMap)) {
      if (brandKey.includes(key) || key.includes(brandKey)) return id;
    }
    return 1;
  };

  // Helper to insert a product record with images, specs, variants and inventory
  function insertProduct({
    categoryId,
    subcategoryId,
    brandId,
    name,
    slug,
    description,
    price,
    mrp,
    rating = 4.3,
    reviewCount = 120,
    stock = 15,
    sku,
    thumbnail,
    badge = null,
    images = [],
    specs = {},
    variants = []
  }) {
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const finalSku = sku || `SKU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    db.run(
      `INSERT INTO products (category_id, subcategory_id, brand_id, name, slug, description, price, mrp, discount, rating, review_count, stock, sku, thumbnail, badge)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [categoryId, subcategoryId, brandId, name, finalSlug, description, price, mrp, discount, rating, reviewCount, stock, finalSku, thumbnail, badge]
    );

    // Get last inserted product ID
    const productRow = db.queryOne('SELECT id FROM products WHERE slug = ?;', [finalSlug]);
    if (!productRow) return;
    const productId = productRow.id;

    // Insert images
    const allImages = [thumbnail, ...images].filter(Boolean);
    const uniqueImages = [...new Set(allImages)];
    uniqueImages.forEach((img, idx) => {
      db.run('INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?);', [productId, img, idx]);
    });

    // Insert specs
    for (const [key, val] of Object.entries(specs)) {
      if (val !== undefined && val !== null) {
        db.run('INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES (?, ?, ?);', [productId, key, String(val)]);
      }
    }

    // Insert variants
    for (const v of variants) {
      db.run(
        'INSERT INTO product_variants (product_id, variant_name, value, price, stock, sku) VALUES (?, ?, ?, ?, ?, ?);',
        [productId, v.name, v.value, v.price || price, v.stock || stock, v.sku || `${finalSku}-${v.value}`]
      );
    }

    // Insert initial inventory log
    db.run(
      'INSERT INTO inventory_logs (product_id, change_amount, reason) VALUES (?, ?, ?);',
      [productId, stock, 'Initial stock import']
    );

    // Also link category_brands if not already linked
    db.run('INSERT OR IGNORE INTO category_brands (category_id, brand_id) VALUES (?, ?);', [categoryId, brandId]);
  }

  // 4. Import existing rich products from products.js (181 products)
  console.log('Importing existing catalog products...');
  const existingProductsPath = path.join(__dirname, '../data/products.js');
  if (fs.existsSync(existingProductsPath)) {
    const { products } = await import('../data/products.js');
    console.log(`Found ${products.length} existing products to migrate...`);

    for (const p of products) {
      let catId = getCatId(p.category);
      // Map category name adjustments if needed
      if (p.category === 'Mobiles') catId = 1;
      else if (p.category === 'Electronics') catId = 2;
      else if (p.category === 'Fashion') catId = 3;
      else if (p.category === 'Appliances') catId = 4;
      else if (p.category === 'Home') catId = 5;
      else if (p.category === 'Beauty') catId = 6;
      else if (p.category === 'Sports') catId = 7;
      else if (p.category === 'Books') catId = 8;
      else if (p.category === 'Toys') catId = 9;
      else if (p.category === 'Grocery') catId = 10;

      let subId = getSubcatId(p.subcategory, catId);
      if (!subId) {
        // Fallback match subcategory name across all
        subId = getSubcatId(p.subcategory);
      }

      const brandId = getBrandId(p.brand);

      insertProduct({
        categoryId: catId,
        subcategoryId: subId,
        brandId: brandId,
        name: p.name,
        slug: p.slug || `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${p.id}`,
        description: p.description,
        price: p.price,
        mrp: p.originalPrice || Math.round(p.price * 1.2),
        rating: p.rating,
        reviewCount: p.reviewCount || 150,
        stock: p.stock || 20,
        sku: p.sku || `SKU-MIG-${p.id}`,
        thumbnail: p.image,
        badge: p.badge,
        images: p.images || [],
        specs: p.specifications || {},
        variants: [
          ...(p.specifications?.Storage ? [{ name: 'Storage', value: p.specifications.Storage, price: p.price }] : []),
          ...(p.specifications?.Color ? [{ name: 'Color', value: p.specifications.Color, price: p.price }] : [])
        ]
      });
    }
  }

  // 5. Expand Catalog with substantial realistic products across all 10 categories
  console.log('Generating expanded multi-category catalog...');
  const { additionalProducts } = require('./additional_products');
  console.log(`Adding ${additionalProducts.length} additional curated products...`);

  for (const ap of additionalProducts) {
    const catId = ap.categoryId;
    const subId = ap.subcategoryId;
    const brandId = getBrandId(ap.brand);

    insertProduct({
      categoryId: catId,
      subcategoryId: subId,
      brandId: brandId,
      name: ap.name,
      slug: ap.slug,
      description: ap.description,
      price: ap.price,
      mrp: ap.mrp,
      rating: ap.rating,
      reviewCount: ap.reviewCount,
      stock: ap.stock,
      sku: ap.sku,
      thumbnail: ap.thumbnail,
      badge: ap.badge,
      images: ap.images,
      specs: ap.specs,
      variants: ap.variants
    });
  }

  db.saveDb();
  const productCount = db.queryOne('SELECT COUNT(*) as count FROM products;').count;
  const brandCount = db.queryOne('SELECT COUNT(*) as count FROM brands;').count;
  const catCount = db.queryOne('SELECT COUNT(*) as count FROM categories;').count;
  console.log(`✅ Database Seeding Complete!`);
  console.log(`Categories: ${catCount} | Brands: ${brandCount} | Total Products: ${productCount}`);
}

seedDatabase().catch(err => {
  console.error('Fatal seed error:', err);
});
