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

async function runTests() {
  console.log('=== TEST SUITE: MANDATORY PAYMENT BEFORE ORDER CONFIRMATION ===\n');

  // Test 1: Check inventory before checkout
  const productRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/products/1',
    method: 'GET'
  });
  const initialStock = productRes.data.stock;
  console.log(`[Test 1] Initial stock for Product #1: ${initialStock}`);

  // Test 2: Initiate Checkout
  const initRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/checkout/initiate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    items: [{ productId: 1, quantity: 1 }],
    customerDetails: { fullName: 'Security Verification Test', phone: '9999999999', email: 'test@shopverse.in' },
    shippingAddress: { fullName: 'Security Test', addressLine1: '123 MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    discountAmount: 0
  });

  const orderId = initRes.data.orderId;
  const paymentOrderId = initRes.data.paymentOrderId;
  console.log(`[Test 2] Checkout Initiated: Order ID ${orderId}, Payment Order ID ${paymentOrderId}`);

  // Test 3: Check order status in DB - must be PAYMENT_PENDING, NOT CONFIRMED
  const orderCheck1 = await request({
    hostname: 'localhost',
    port: 3001,
    path: `/api/orders/${orderId}`,
    method: 'GET'
  });
  console.log(`[Test 3] DB Order Status before payment: ${orderCheck1.data.order_status} | Payment: ${orderCheck1.data.payment_status}`);
  if (orderCheck1.data.order_status === 'CONFIRMED' || orderCheck1.data.payment_status === 'PAID') {
    throw new Error('FAILED: Order was prematurely confirmed without payment!');
  }
  console.log('  -> PASS: Order is in PAYMENT_PENDING state');

  // Test 4: Check stock - must remain untouched
  const stockCheck1 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/products/1',
    method: 'GET'
  });
  if (stockCheck1.data.stock !== initialStock) {
    throw new Error(`FAILED: Stock was prematurely decremented! Was ${initialStock}, now ${stockCheck1.data.stock}`);
  }
  console.log('  -> PASS: Stock is untouched prior to verified payment');

  // Test 5: Forged Signature Attack
  console.log('\n[Test 5] Simulating Forged / Fake Signature Attack...');
  const forgedRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/checkout/verify-payment',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    orderId,
    razorpay_order_id: paymentOrderId,
    razorpay_payment_id: 'pay_hacker_fake_123',
    razorpay_signature: 'forged_fake_signature_attempt'
  });
  console.log(`  -> Response Status: ${forgedRes.status} (Expected 400)`);
  if (forgedRes.status !== 400) {
    throw new Error('FAILED: Server accepted forged signature!');
  }
  console.log('  -> PASS: Forged signature successfully rejected with HTTP 400');

  // Test 6: Verify order is still NOT confirmed
  const orderCheck2 = await request({
    hostname: 'localhost',
    port: 3001,
    path: `/api/orders/${orderId}`,
    method: 'GET'
  });
  if (orderCheck2.data.order_status === 'CONFIRMED') {
    throw new Error('FAILED: Order was confirmed despite forged signature!');
  }
  console.log(`  -> PASS: Order status remains ${orderCheck2.data.order_status}`);

  // Test 7: Genuine Verification
  console.log('\n[Test 7] Verifying payment with genuine simulated signature token...');
  const verifyRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/checkout/verify-payment',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    orderId,
    razorpay_order_id: paymentOrderId,
    razorpay_payment_id: `pay_test_${Date.now()}`,
    razorpay_signature: 'simulated_signature_verified'
  });

  console.log(`  -> Response Status: ${verifyRes.status} | Order Status: ${verifyRes.data.orderStatus} | Payment Status: ${verifyRes.data.paymentStatus}`);
  if (verifyRes.data.orderStatus !== 'CONFIRMED' || verifyRes.data.paymentStatus !== 'PAID') {
    throw new Error('FAILED: Valid payment was not confirmed');
  }
  console.log('  -> PASS: Order successfully confirmed upon authentic payment verification');

  // Test 8: Check inventory committed
  const stockCheck2 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/products/1',
    method: 'GET'
  });
  console.log(`[Test 8] Stock after payment: ${stockCheck2.data.stock} (Initial: ${initialStock})`);
  if (stockCheck2.data.stock !== initialStock - 1) {
    throw new Error(`FAILED: Stock was not decremented by 1! Was ${initialStock}, now ${stockCheck2.data.stock}`);
  }
  console.log('  -> PASS: Stock decremented atomically upon confirmed payment');

  // Test 9: Idempotency protection (replay verification)
  console.log('\n[Test 9] Testing idempotency / duplicate payment verification replay...');
  const duplicateRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/checkout/verify-payment',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    orderId,
    razorpay_order_id: paymentOrderId,
    razorpay_payment_id: `pay_test_${Date.now()}`,
    razorpay_signature: 'simulated_signature_verified'
  });
  console.log(`  -> Replay Response Status: ${duplicateRes.status}`);

  const stockCheck3 = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/products/1',
    method: 'GET'
  });
  if (stockCheck3.data.stock !== initialStock - 1) {
    throw new Error('FAILED: Idempotency failed! Stock was deducted twice on replay!');
  }
  console.log('  -> PASS: Idempotency verified. Stock was NOT deducted twice.');

  console.log('\n✅ ALL 9 MANDATORY PAYMENT VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('\n❌ TEST RUNNER FAILED:', err);
  process.exit(1);
});
