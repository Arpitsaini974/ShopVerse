const db = require('./db');

async function testResolution() {
  await db.getDb();

  const testCases = [
    { name: '1. Standard productId number', item: { productId: 1, quantity: 1 } },
    { name: '2. Standard id number', item: { id: 1, quantity: 1 } },
    { name: '3. Standard product_id number', item: { product_id: 1, quantity: 1 } },
    { name: '4. Nested product.id', item: { product: { id: 1 }, quantity: 1 } },
    { name: '5. String numeric productId "1"', item: { productId: '1', quantity: 1 } },
    { name: '6. String numeric id "2"', item: { id: '2', quantity: 1 } },
    { name: '7. Slug reference "apple-iphone-16-pro-max-desert-titanium"', item: { productId: 'apple-iphone-16-pro-max-desert-titanium', quantity: 1 } },
    { name: '8. Variant ID used as product ID (variant 1 is for product 1)', item: { productId: 1, quantity: 1 } },
    { name: '9. Product with variantId 1', item: { productId: 1, variantId: 1, quantity: 1 } },
    { name: '10. Invalid empty reference', item: { quantity: 1 } }
  ];

  for (const tc of testCases) {
    const item = tc.item;
    let prodRef = null;
    if (typeof item === 'number') {
      prodRef = item;
    } else if (typeof item === 'string') {
      const parsed = parseInt(item, 10);
      prodRef = !isNaN(parsed) && parsed > 0 ? parsed : item;
    } else if (item && typeof item === 'object') {
      prodRef = item.productId ?? item.product_id ?? item.id ?? item.product?.id ?? item.product?.productId ?? item.product?.product_id ?? item.slug;
    }

    if (!prodRef) {
      console.log(`${tc.name} -> REJECTED: Invalid product reference in items (Expected for case 10)`);
      continue;
    }

    let product = null;
    if (typeof prodRef === 'number' || /^\d+$/.test(String(prodRef))) {
      product = db.queryOne('SELECT id, name, price, stock FROM products WHERE id = ?;', [Number(prodRef)]);
    }

    if (!product && (typeof prodRef === 'number' || /^\d+$/.test(String(prodRef)))) {
      const variant = db.queryOne('SELECT * FROM product_variants WHERE id = ?;', [Number(prodRef)]);
      if (variant && variant.product_id) {
        product = db.queryOne('SELECT id, name, price, stock FROM products WHERE id = ?;', [variant.product_id]);
      }
    }

    if (!product) {
      product = db.queryOne('SELECT id, name, price, stock FROM products WHERE slug = ? OR sku = ? OR LOWER(name) = LOWER(?);', [String(prodRef), String(prodRef), String(prodRef)]);
    }

    if (product) {
      console.log(`${tc.name} -> RESOLVED: Product ID ${product.id} ("${product.name.substring(0, 30)}...") Price: ₹${product.price}`);
    } else {
      console.log(`${tc.name} -> NOT FOUND in catalog`);
    }
  }
}

testResolution();
