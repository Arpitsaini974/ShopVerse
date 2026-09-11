const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 VERIFICATION SUITE: BUY NOW & CHECKOUT FULL-STACK FLOW');
  console.log('================================================================\n');

  // Test 1: Validate real product from database
  console.log('1️⃣ Testing GET /api/products/1/availability for valid product...');
  const res1 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/products/1/availability',
    method: 'GET'
  });
  console.log(`   Status: ${res1.status}, Product Name: "${res1.data.name}", Price: ₹${res1.data.price}, Stock: ${res1.data.stock}`);
  if (res1.status !== 200 || !res1.data.exists || !res1.data.inStock) {
    throw new Error('FAILED: Product #1 availability check failed');
  }
  console.log('   ✅ PASS: Valid product is recognized and available in stock\n');

  // Test 2: Validate invalid product
  console.log('2️⃣ Testing GET /api/products/999999/availability for non-existent product...');
  const res2 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/products/999999/availability',
    method: 'GET'
  });
  console.log(`   Status: ${res2.status}, Response:`, res2.data);
  if (res2.status !== 404 || res2.data.exists !== false) {
    throw new Error('FAILED: Non-existent product was not rejected with 404');
  }
  console.log('   ✅ PASS: Non-existent product safely rejected with 404\n');

  // Test 3: Validate checkout calculation with real DB data
  console.log('3️⃣ Testing POST /api/checkout/validate for Buy Now item...');
  const res3 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/checkout/validate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    items: [{ productId: 1, quantity: 1 }],
    deliveryMethod: 'standard'
  });
  console.log(`   Status: ${res3.status}, Valid: ${res3.data.valid}, Subtotal: ₹${res3.data.subtotal}, Total: ₹${res3.data.total}`);
  if (res3.status !== 200 || !res3.data.valid || res3.data.items[0].price !== res1.data.price) {
    throw new Error('FAILED: Checkout validation did not return correct DB prices');
  }
  console.log('   ✅ PASS: Database validated subtotal and items accurately\n');

  // Test 4: Initiate Buy Now Checkout
  console.log('4️⃣ Testing POST /api/checkout/initiate for Buy Now...');
  const initialStock = res1.data.stock;
  const res4 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/checkout/initiate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    items: [{ productId: 1, quantity: 1 }],
    customerDetails: { fullName: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com' },
    shippingAddress: { fullName: 'Rahul Sharma', addressLine1: '42 MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' },
    deliveryMethod: 'standard'
  });
  console.log(`   Status: ${res4.status}, Order ID: ${res4.data.orderId}, Total Amount: ₹${res4.data.amount}`);
  if (res4.status !== 200 || !res4.data.orderId) {
    throw new Error('FAILED: Buy Now checkout initiation failed');
  }
  console.log('   ✅ PASS: Buy Now order created in PAYMENT_PENDING state\n');

  // Test 5: Verify Order Status before Payment (Must NOT be confirmed)
  console.log('5️⃣ Verifying order status in DB before payment...');
  const res5 = await request({
    hostname: 'localhost',
    port: 3001,
    path: `/api/orders/${res4.data.orderId}`,
    method: 'GET'
  });
  console.log(`   Order Status: "${res5.data.order_status}", Payment Status: "${res5.data.payment_status}"`);
  if (res5.data.order_status === 'CONFIRMED' || res5.data.payment_status === 'PAID') {
    throw new Error('FAILED: Order was prematurely confirmed before payment!');
  }
  console.log('   ✅ PASS: Order is not confirmed without verified payment\n');

  // Test 6: Verify Payment & Confirm Order
  console.log('6️⃣ Testing POST /api/checkout/verify-payment for Buy Now order...');
  const res6 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/checkout/verify-payment',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    orderId: res4.data.orderId,
    razorpay_order_id: res4.data.paymentOrderId,
    razorpay_payment_id: `pay_test_${Date.now()}`,
    razorpay_signature: 'simulated_signature_verified'
  });
  console.log(`   Status: ${res6.status}, Confirmed Status: "${res6.data.orderStatus}", Payment Status: "${res6.data.paymentStatus}"`);
  if (res6.status !== 200 || res6.data.orderStatus !== 'CONFIRMED' || res6.data.paymentStatus !== 'PAID') {
    throw new Error('FAILED: Payment verification did not confirm order');
  }
  console.log('   ✅ PASS: Order confirmed and payment marked PAID\n');

  // Test 7: Verify Stock Decrement
  console.log('7️⃣ Verifying inventory committed in database...');
  const res7 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/products/1/availability',
    method: 'GET'
  });
  console.log(`   Stock after purchase: ${res7.data.stock} (Initial: ${initialStock})`);
  if (res7.data.stock !== initialStock - 1) {
    throw new Error(`FAILED: Stock was not reduced by 1! Was ${initialStock}, now ${res7.data.stock}`);
  }
  console.log('   ✅ PASS: Inventory atomically decremented in database\n');

  console.log('================================================================');
  console.log('🎉 ALL 7 FULL-STACK BUY NOW VERIFICATION TESTS PASSED!');
  console.log('================================================================');
}

runTestSuite().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
