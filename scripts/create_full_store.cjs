const fs = require('fs');
const path = require('path');

// Verified authentic photography pools
const P = {
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
  ],
  smartphones: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80'
  ],
  tablets: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=80'
  ],
  smartwatches: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80'
  ],
  tvs: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80'
  ],
  cameras: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=800&q=80'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1625948515291-696130d10398?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80'
  ],
  fashion: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
  ],
  home: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  ],
  books: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
  ],
  toys: [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80'
  ],
  grocery: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  ]
};

(async () => {
  // Load existing 117 products from current products.js
  const currentProductsModule = await import('../src/data/products.js');
  const baseProducts = currentProductsModule.products || [];
  console.log('Base products currently loaded:', baseProducts.length);

// Additional items to reach the requested counts:
// Tablets (need 4 more to reach 12)
const extraTablets = [
  { name: 'Apple iPad mini (A17 Pro Chip, 128GB, Wi-Fi) - Space Grey', brand: 'Apple', category: 'Electronics', subcategory: 'Tablets', price: 49900, originalPrice: 49900, rating: 4.7, reviewCount: 2800, badge: 'New',
    highlights: ['Ultra-portable 8.3-inch Liquid Retina display', 'Blazing-fast A17 Pro chip supporting Apple Intelligence', '12MP Wide back camera and 12MP Ultra Wide front camera', 'Supports Apple Pencil Pro with barrel roll and squeeze'],
    specs: { 'Display': '8.3-inch Liquid Retina Display', 'Processor': 'Apple A17 Pro (6-core)', 'RAM': '8GB', 'Storage': '128GB', 'Battery': 'Up to 10 hours', 'Weight': '293 g', 'OS': 'iPadOS 18', 'Warranty': '1 Year Apple Warranty' },
    pool: P.tablets },
  { name: 'Samsung Galaxy Tab A9+ (11.0-inch 90Hz, 8GB RAM, 128GB, Wi-Fi) - Graphite', brand: 'Samsung', category: 'Electronics', subcategory: 'Tablets', price: 17999, originalPrice: 25999, rating: 4.4, reviewCount: 16800, badge: 'Best Seller',
    highlights: ['11.0-inch WQXGA 90Hz smooth display', 'Qualcomm Snapdragon 695 5G octa-core processor', 'Quad speakers powered by Dolby Atmos', 'Samsung Kids mode for safe educational entertainment'],
    specs: { 'Display': '11.0-inch LCD 90Hz (1920x1200)', 'Processor': 'Snapdragon 695', 'RAM': '8GB', 'Storage': '128GB (Expandable 1TB)', 'Battery': '7040 mAh, 15W Charging', 'Weight': '480 g', 'OS': 'Android 13', 'Warranty': '1 Year Samsung Warranty' },
    pool: P.tablets },
  { name: 'OnePlus Pad Go (11.35-inch 2.4K Eye-Care Display, 8GB, 128GB LTE) - Twin Mint', brand: 'OnePlus', category: 'Electronics', subcategory: 'Tablets', price: 19999, originalPrice: 23999, rating: 4.5, reviewCount: 12400, badge: 'Great Value',
    highlights: ['2.4K 90Hz ReadFit display with TÜV Rheinland Full Care certification', 'Omnibearing Sound Field with quad speakers and Dolby Atmos', '4G LTE SIM calling and data connectivity on the go', '8000 mAh battery with 33W SUPERVOOC charging'],
    specs: { 'Display': '11.35-inch 2.4K (2408x1720) 90Hz LCD', 'Processor': 'MediaTek Helio G99', 'RAM': '8GB', 'Storage': '128GB', 'Battery': '8000 mAh, 33W Charging', 'Weight': '532 g', 'OS': 'OxygenOS 13.2', 'Warranty': '1 Year OnePlus Warranty' },
    pool: P.tablets },
  { name: 'Lenovo Tab M11 (11.0-inch FHD 90Hz, 8GB RAM, 128GB with Pen) - Seafoam Green', brand: 'Lenovo', category: 'Electronics', subcategory: 'Tablets', price: 14999, originalPrice: 21999, rating: 4.3, reviewCount: 9100, badge: 'Great Value',
    highlights: ['11-inch WUXGA 90Hz IPS display with 72% NTSC color gamut', 'Bundled Lenovo Tab Pen included for sketch and notes', 'Quad speakers tuned by Dolby Atmos', 'IP52 water and dust resistance for daily resilience'],
    specs: { 'Display': '11.0-inch WUXGA (1920x1200) IPS 90Hz', 'Processor': 'MediaTek Helio G88', 'RAM': '8GB', 'Storage': '128GB', 'Battery': '7040 mAh', 'Weight': '465 g', 'OS': 'Android 13', 'Warranty': '1 Year Lenovo Warranty' },
    pool: P.tablets }
];

// Headphones (need 6 more to reach 16)
const extraHeadphones = [
  { name: 'Sony WH-CH720N Noise Canceling Wireless Over-Ear Headphones - Blue', brand: 'Sony', category: 'Electronics', subcategory: 'Headphones', price: 8990, originalPrice: 14990, rating: 4.5, reviewCount: 19200, badge: 'Best Seller',
    highlights: ['Integrated Processor V1 brings flagship noise cancellation to a lighter body', 'Up to 35 hours battery life with quick charging (3 min for 1 hour)', 'Lightweight 192g ergonomic design for long listening comfort', 'Dual Noise Sensor technology with multipoint Bluetooth'],
    specs: { 'Driver': '30mm Dynamic Drivers', 'Battery': 'Up to 35 hours (NC ON), 50 hours (NC OFF)', 'Weight': '192 g', 'Warranty': '1 Year Sony Warranty' }, pool: P.headphones },
  { name: 'JBL Wave Beam True Wireless In-Ear Earbuds (32H Playtime, Deep Bass) - White', brand: 'JBL', category: 'Electronics', subcategory: 'Headphones', price: 2999, originalPrice: 4999, rating: 4.3, reviewCount: 24100, badge: 'Great Value',
    highlights: ['JBL Deep Bass sound with 8mm dynamic drivers', 'Up to 32 hours of battery life (8h in buds + 24h in case)', 'Smart Ambient technology with TalkThru functionality', 'IP54 water and dust resistant earbuds with IPX2 case'],
    specs: { 'Driver': '8mm drivers', 'Battery': '32 Hours total', 'Resistance': 'IP54 rated', 'Warranty': '1 Year JBL Warranty' }, pool: P.headphones },
  { name: 'Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones - Triple Black', brand: 'Bose', category: 'Electronics', subcategory: 'Headphones', price: 24900, originalPrice: 29900, rating: 4.7, reviewCount: 8400, badge: 'Top Rated',
    highlights: ['Legendary Acoustic Noise Cancelling with Quiet and Aware modes', 'TriPort acoustic architecture for deep, clear audio fidelity', 'Up to 22 hours of battery life on a single charge', 'Synthetic leather and impact-resistant glass-filled nylon design'],
    specs: { 'Battery': 'Up to 22 hours', 'Connectivity': 'Bluetooth 5.1, 3.5mm Aux', 'Weight': '240 g', 'Warranty': '1 Year Bose Warranty' }, pool: P.headphones },
  { name: 'OnePlus Nord Buds 3 Pro (Starry Black, 49dB Hybrid ANC, 12.4mm Bass Wave)', brand: 'OnePlus', category: 'Electronics', subcategory: 'Headphones', price: 2799, originalPrice: 3299, rating: 4.4, reviewCount: 18900, badge: 'Best Seller',
    highlights: ['Up to 49dB Hybrid Active Noise Cancellation with ultra-wide 4000Hz frequency', '12.4mm titanized dynamic drivers with BassWave 2.0 enhancement', 'Crystal-clear calls powered by triple microphones and AI Clear Call', 'Up to 44 hours total playtime with fast charge'],
    specs: { 'Drivers': '12.4mm Titanized Diaphragm', 'Battery': 'Up to 44 hours total', 'Resistance': 'IP55 water and sweat proof', 'Warranty': '1 Year OnePlus Warranty' }, pool: P.headphones },
  { name: 'boAt Nirvana Ion True Wireless Earbuds (120H Playtime, Crystal Bionic Sound)', brand: 'boAt', category: 'Electronics', subcategory: 'Headphones', price: 1899, originalPrice: 7990, rating: 4.3, reviewCount: 46200, badge: 'Great Value',
    highlights: ['Unbelievable 120 hours total battery life with 24 hours per charge in buds', 'Crystal Bionic Sound powered by HiFi DSP', 'Dual EQ modes (boAt Signature Sound and Balanced Mode)', 'Quad mics with ENx technology for noise-free voice calls'],
    specs: { 'Battery': '120 Hours Total (24h in buds)', 'Connectivity': 'Bluetooth 5.2, Type-C Charging', 'Resistance': 'IPX4', 'Warranty': '1 Year boAt Warranty' }, pool: P.headphones },
  { name: 'Nothing Ear (a) (Yellow, 45dB Smart ANC, Hi-Res LDAC Audio, ChatGPT Built-in)', brand: 'Nothing', category: 'Electronics', subcategory: 'Headphones', price: 7999, originalPrice: 9999, rating: 4.6, reviewCount: 9500, badge: 'New',
    highlights: ['Vibrant, playful iconic transparent yellow case design', 'Smart Active Noise Cancellation up to 45dB with automated leak detection', '11mm dynamic driver with Bass Enhance algorithm', 'Hi-Res Audio Certified with LDAC support up to 990 kbps'],
    specs: { 'Driver': '11mm dynamic driver', 'Battery': 'Up to 9.5 hours (buds), 42.5 hours (with case)', 'Resistance': 'IP54 buds / IPX2 case', 'Warranty': '1 Year Nothing Warranty' }, pool: P.headphones }
];

// Smartwatches (need 7 more to reach 15)
const extraSmartwatches = [
  { name: 'Apple Watch SE (2nd Gen, GPS 40mm) - Starlight Aluminum Case with Sport Band', brand: 'Apple', category: 'Electronics', subcategory: 'Wearables', price: 24900, originalPrice: 29900, rating: 4.7, reviewCount: 16800, badge: 'Great Value',
    highlights: ['All the essentials to help you be motivated and active, stay connected, and track your health', 'Crash Detection, Fall Detection, and Emergency SOS for peace of mind', 'Retina display with up to 1000 nits brightness', 'Water resistant to 50 meters (swimproof)'],
    specs: { 'Display': '40mm Retina OLED, 1000 nits', 'Processor': 'Apple S8 SiP', 'Resistance': '50m swimproof', 'Battery': 'Up to 18 hours', 'OS': 'watchOS 11', 'Warranty': '1 Year Apple Warranty' }, pool: P.smartwatches },
  { name: 'Samsung Galaxy Watch Ultra (47mm, LTE + Bluetooth) - Titanium Silver', brand: 'Samsung', category: 'Electronics', subcategory: 'Wearables', price: 59999, originalPrice: 69999, rating: 4.8, reviewCount: 1150, badge: 'Top Rated',
    highlights: ['Cushion design with Grade 4 Titanium shield built for extreme environments', 'Up to 100 hours battery life in Power Saving mode, 48h in Exercise mode', 'Dual-frequency GPS (L1+L5) and Multi-Sports Tile with Quick Button', '10 ATM water resistance with ocean swimming & scuba certification'],
    specs: { 'Display': '1.5-inch Super AMOLED (480x480), 3000 nits', 'Processor': 'Exynos W1000 (3nm)', 'Resistance': '10ATM + IP68 / MIL-STD-810H', 'Battery': '590 mAh', 'OS': 'Wear OS Powered by Samsung', 'Warranty': '1 Year Samsung Warranty' }, pool: P.smartwatches },
  { name: 'Noise Pulse 2 Max (1.85-inch TFT LCD, 550 Nits, 10-Day Battery) - Deep Wine', brand: 'Noise', category: 'Electronics', subcategory: 'Wearables', price: 1299, originalPrice: 5999, rating: 4.1, reviewCount: 78000, badge: 'Best Seller',
    highlights: ['1.85-inch clear and bright display with 550 nits outdoor visibility', 'Tru Sync powered Bluetooth calling with faster, stable connection', 'Smart DND mode and 100 sports modes with auto-detection', '10 days of battery life on a single 2-hour charge'],
    specs: { 'Display': '1.85-inch LCD (240x284)', 'Battery': 'Up to 10 days', 'Resistance': 'IP68 water resistant', 'Warranty': '1 Year Noise Warranty' }, pool: P.smartwatches },
  { name: 'boAt Storm Call 3 Smartwatch (1.83-inch HD Display, In-built Map Navigation) - Cherry Blossom', brand: 'boAt', category: 'Electronics', subcategory: 'Wearables', price: 1399, originalPrice: 8499, rating: 4.2, reviewCount: 38400, badge: 'Great Value',
    highlights: ['Navigation alert support powered by MapmyIndia on your wrist', 'QR Tray to store payment codes, tickets, and social handles', 'Crest App Health Ecosystem with Fitness Buddies and Wellness Badges', 'BT calling with save up to 10 contacts on watch'],
    specs: { 'Display': '1.83-inch HD (240x284)', 'Battery': 'Up to 7 days', 'Resistance': 'IP67 dust and splash proof', 'Warranty': '1 Year boAt Warranty' }, pool: P.smartwatches },
  { name: 'Amazfit T-Rex Ultra Rugged Outdoor Smartwatch (30m Freediving, Offline Maps) - Abyss Black', brand: 'Amazfit', category: 'Electronics', subcategory: 'Wearables', price: 39999, originalPrice: 49999, rating: 4.8, reviewCount: 890, badge: 'Top Rated',
    highlights: ['Constructed with 316L stainless steel and mud-resistant bridge & buttons', 'Supports 30m freediving with EN13319 and ISO 6425 international dive standards', 'Dual-band 6-satellite positioning with offline contour map downloads', 'Ultra-long 20 days battery life and ultra-low temperature operation down to -30°C'],
    specs: { 'Display': '1.39-inch AMOLED, 1000 nits', 'Battery': '500 mAh, up to 20 days', 'Resistance': '10 ATM, EN13319 dive certified', 'Warranty': '1 Year Amazfit Warranty' }, pool: P.smartwatches },
  { name: 'OnePlus Watch 2R (Gunmetal Gray, 100H Battery, Wear OS by Google, 500 nits)', brand: 'OnePlus', category: 'Electronics', subcategory: 'Wearables', price: 17999, originalPrice: 22999, rating: 4.5, reviewCount: 4100, badge: 'Best Seller',
    highlights: ['Lightweight matte aluminum alloy body weighing 25% less', 'Dual-Engine Architecture with Snapdragon W5 + BES2700', 'Wear OS 4 with full Google Play Store apps and Google Wallet', 'Dual-frequency L1+L5 GPS tracking with VO2 Max and running form metrics'],
    specs: { 'Display': '1.43-inch AMOLED, 1000 nits High Brightness', 'Battery': '500 mAh, 100 Hours Smart Mode', 'Resistance': '5ATM + IP68', 'Warranty': '1 Year OnePlus Warranty' }, pool: P.smartwatches },
  { name: 'Garmin Forerunner 165 GPS Running Smartwatch (AMOLED Display, Training Metrics) - Black/Slate', brand: 'Garmin', category: 'Electronics', subcategory: 'Wearables', price: 33490, originalPrice: 38990, rating: 4.8, reviewCount: 1400, badge: 'Top Rated',
    highlights: ['Colorful 1.2-inch AMOLED touchscreen display with traditional button controls', 'Up to 11 days of battery life in smartwatch mode', 'Personalized daily suggested workouts that adapt after every run', 'Training Effect, recovery time, HRV status, and Nap Detection'],
    specs: { 'Display': '1.2-inch AMOLED (390x390)', 'Battery': 'Up to 11 days (19h GPS)', 'Sensors': 'Elevate HR, Pulse Ox, Compass, Barometric altimeter', 'Resistance': '5 ATM', 'Warranty': '2 Years Garmin India Warranty' }, pool: P.smartwatches }
];

// TVs (need 4 more to reach 10)
const extraTVs = [
  { name: 'Sony Bravia 65-inch 4K Ultra HD Smart LED Google TV (KD-65X74L) - Black', brand: 'Sony', category: 'Electronics', subcategory: 'Televisions', price: 77990, originalPrice: 139900, rating: 4.7, reviewCount: 9200, badge: 'Top Rated',
    highlights: ['Massive 65-inch 4K display powered by Sony X1 Processor', '4K X-Reality PRO upgrades 2K and HD images to near-4K resolution', 'Google TV with 10,000+ apps and personalized recommendations', 'Motionflow XR 100 keeps fast motion scenes smooth and clear'],
    specs: { 'Display': '65-inch 4K UHD (3840x2160), 60Hz', 'Audio': '20W Open Baffle Speaker, Dolby Audio', 'Ports': '3 HDMI, 2 USB, Bluetooth 5.0', 'OS': 'Google TV', 'Warranty': '1 Year Sony Warranty' }, pool: P.tvs },
  { name: 'Samsung 65-inch Neo QLED 4K Smart TV (QA65QN85DBEXXL) - Titan Black', brand: 'Samsung', category: 'Electronics', subcategory: 'Televisions', price: 149990, originalPrice: 219900, rating: 4.8, reviewCount: 1600, badge: 'Top Rated',
    highlights: ['NQ4 AI Gen2 Processor with 20 AI neural networks for 4K upscaling', 'Quantum Matrix Technology controls ultra-fine Quantum Mini LEDs', 'Dolby Atmos with top-channel speakers for multi-dimensional sound', 'FreeSync Premium Pro with 120Hz refresh rate and Motion Xcelerator 120Hz'],
    specs: { 'Display': '65-inch 4K Neo QLED Mini LED, 120Hz', 'Audio': '40W 2.2CH, Dolby Atmos', 'Ports': '4 HDMI (4K 120Hz), 2 USB', 'OS': 'Tizen OS', 'Warranty': '3 Years Samsung Warranty' }, pool: P.tvs },
  { name: 'LG 43-inch 4K Ultra HD Smart LED TV (43UR7500PSC) - Ashen Black', brand: 'LG', category: 'Electronics', subcategory: 'Televisions', price: 29990, originalPrice: 49990, rating: 4.4, reviewCount: 31400, badge: 'Best Seller',
    highlights: ['Alpha 5 AI Processor 4K Gen6 for immersive viewing experience', '4K Upscaling transforms non-4K content on the large UHD screen', 'AI Brightness Control ensures ideal brightness level for any ambient environment', 'Magic Remote capability with voice control and Apple AirPlay 2'],
    specs: { 'Display': '43-inch 4K UHD (3840x2160), 60Hz', 'Audio': '20W 2.0CH, AI Sound', 'Ports': '3 HDMI, 2 USB, Wi-Fi 5', 'OS': 'webOS 23', 'Warranty': '1 Year LG Warranty' }, pool: P.tvs },
  { name: 'Hisense 55-inch 4K Ultra HD Smart QLED TV (55E7K Pro) - Dark Grey', brand: 'Hisense', category: 'Electronics', subcategory: 'Televisions', price: 38999, originalPrice: 69999, rating: 4.4, reviewCount: 11200, badge: 'Great Value',
    highlights: ['Native 240Hz High Refresh Rate mode with Game Mode Pro', 'Quantum Dot Color delivers over a billion vivid, accurate shades', 'Dolby Vision IQ and Dolby Atmos with built-in 49W 2.1 sub-woofer', 'AMD FreeSync Premium certification for tear-free console gaming'],
    specs: { 'Display': '55-inch 4K QLED, 144Hz native / 240Hz HSR', 'Audio': '49W 2.1CH with Subwoofer', 'Ports': '4 HDMI (2x HDMI 2.1 4K 144Hz), 2 USB', 'OS': 'VIDAA OS', 'Warranty': '2 Years Comprehensive Warranty' }, pool: P.tvs }
];

// Cameras (need 4 more to reach 10)
const extraCameras = [
  { name: 'Canon EOS 200D II 24.1MP Digital SLR Camera with EF-S 18-55mm IS STM Lens', brand: 'Canon', category: 'Electronics', subcategory: 'Cameras', price: 58990, originalPrice: 68995, rating: 4.6, reviewCount: 18900, badge: 'Best Seller',
    highlights: ['World\'s lightest DSLR with Vari-angle Touch Screen LCD', '24.1 Megapixel APS-C CMOS sensor with DIGIC 8 processor', 'Dual Pixel CMOS AF with Eye Detection AF in Live View', 'Creative Assist mode for easy filter and parameter adjustments'],
    specs: { 'Sensor': '24.1MP APS-C CMOS', 'ISO': '100-25600', 'Optical Viewfinder': '9-point AF', 'Video': '4K 24p, FHD 60p', 'Weight': '449 g', 'Warranty': '2 Years Canon Warranty' }, pool: P.cameras },
  { name: 'Sony Alpha ZV-1 II Vlog Camera with Wide-Angle 18-50mm Zoom Lens - White', brand: 'Sony', category: 'Electronics', subcategory: 'Cameras', price: 69990, originalPrice: 79990, rating: 4.6, reviewCount: 4200, badge: 'Top Rated',
    highlights: ['Versatile 18-50mm wide-angle zoom lens captures group selfies and expansive scenery', 'Large 1.0-type Exmor RS image sensor produces professional background bokeh', 'Cinematic Vlog Setting applies 24fps and 2.35:1 widescreen CinemaScope look', 'Intelligent 3-Capsule Mic switches directional audio pickup automatically'],
    specs: { 'Sensor': '20.1MP 1.0-inch Stacked Exmor RS CMOS', 'Lens': '18-50mm f/1.8-4.0 Zeiss Vario-Sonnar T*', 'Video': '4K 30p, FHD 120p', 'Weight': '292 g', 'Warranty': '2 Years Sony Warranty' }, pool: P.cameras },
  { name: 'Nikon D5600 Digital Camera with AF-P 18-55mm and 70-300mm VR Dual Lens Kit', brand: 'Nikon', category: 'Electronics', subcategory: 'Cameras', price: 68990, originalPrice: 78990, rating: 4.5, reviewCount: 22400, badge: 'Best Seller',
    highlights: ['24.2 MP DX-format sensor with no optical low-pass filter for extreme detail', 'Includes dual zoom lenses covering 18mm wide to 300mm telephoto range', 'Vari-angle 3.2-inch 1037k-dot touchscreen LCD', 'SnapBridge Bluetooth technology for automatic photo sync to smartphone'],
    specs: { 'Sensor': '24.2MP DX-Format CMOS', 'Lenses': 'AF-P 18-55mm VR + AF-P 70-300mm VR', 'AF Points': '39-point AF system', 'Weight': '465 g', 'Warranty': '2 Years Nikon Warranty' }, pool: P.cameras },
  { name: 'Fujifilm Instax Mini 12 Instant Film Camera - Pastel Blue', brand: 'Fujifilm', category: 'Electronics', subcategory: 'Cameras', price: 6499, originalPrice: 7999, rating: 4.6, reviewCount: 38200, badge: 'Best Seller',
    highlights: ['Twist-to-turn-on lens with built-in close-up / selfie mode', 'Automatic exposure and flash control for clear prints in any lighting', 'Built-in selfie mirror on front of lens for perfect framing', 'Produces credit-card size instant prints in 90 seconds'],
    specs: { 'Film': 'Fujifilm Instant Film Instax Mini', 'Lens': '2 components, 2 elements, f=60mm, 1:12.7', 'Battery': 'Two AA-size alkaline batteries', 'Weight': '306 g', 'Warranty': '1 Year Fujifilm Warranty' }, pool: P.cameras }
];

// Accessories (need 14 more to reach 22)
const extraAccessories = [
  { name: 'Apple 20W USB-C Power Adapter (Fast Charging for iPhone & iPad)', brand: 'Apple', category: 'Electronics', subcategory: 'Accessories', price: 1699, originalPrice: 1900, rating: 4.7, reviewCount: 52000, badge: 'Best Seller',
    highlights: ['Fast, efficient charging at home, in the office, or on the go', 'Pairs with iPhone 8 or later for 50% battery in 30 minutes', 'Compatible with any USB-C-enabled device'],
    specs: { 'Output': '20W USB-C', 'Compatibility': 'iPhone, iPad, Apple Watch', 'Warranty': '1 Year Apple Warranty' }, pool: P.accessories },
  { name: 'Samsung 25W USB-C Super Fast Wall Charger with Type-C Cable - Black', brand: 'Samsung', category: 'Electronics', subcategory: 'Accessories', price: 1299, originalPrice: 1999, rating: 4.6, reviewCount: 41000, badge: 'Best Seller',
    highlights: ['Super Fast Charging up to 25W with compatible Galaxy devices', 'Power Delivery (PD) 3.0 support with PPS capability', 'Includes 1-meter USB-C to USB-C 3A data cable'],
    specs: { 'Output': '25W Super Fast Charging', 'Input': '100-240V', 'Cable Length': '1.0 Meter', 'Warranty': '6 Months Samsung Warranty' }, pool: P.accessories },
  { name: 'Ambrane 20000mAh Power Bank (22.5W Fast Charging, Metallic Body) - Green', brand: 'Ambrane', category: 'Electronics', subcategory: 'Accessories', price: 1499, originalPrice: 2999, rating: 4.3, reviewCount: 54000, badge: 'Great Value',
    highlights: ['Massive 20,000 mAh capacity charges average phone 4-5 times', '22.5W Power Delivery and Quick Charge 3.0 output', 'Triple output ports (2x USB-A, 1x Type-C two-way)', 'Multi-layer chipset protection against short-circuit and over-voltage'],
    specs: { 'Capacity': '20,000 mAh Lithium Polymer', 'Output': '22.5W Max', 'Ports': '2x USB-A + 1x Type-C', 'Weight': '410 g', 'Warranty': '180 Days Warranty' }, pool: P.accessories },
  { name: 'Mi 10000mAh 22.5W Fast Charging Pocket Power Bank - Black', brand: 'Xiaomi', category: 'Electronics', subcategory: 'Accessories', price: 1299, originalPrice: 2199, rating: 4.4, reviewCount: 68000, badge: 'Best Seller',
    highlights: ['Pocket-friendly ultra-compact form factor', '22.5W ultra-fast two-way charging support', 'Triple port output (charges 3 devices simultaneously)', 'Low-current charging mode for Bluetooth earphones and fitness bands'],
    specs: { 'Capacity': '10,000 mAh', 'Output': '22.5W Max', 'Weight': '200 g', 'Warranty': '6 Months Xiaomi Warranty' }, pool: P.accessories },
  { name: 'boAt Rugged v3 Extra Tough Braided Micro USB & Type-C Cable (1.5m) - Red', brand: 'boAt', category: 'Electronics', subcategory: 'Accessories', price: 299, originalPrice: 799, rating: 4.3, reviewCount: 82000, badge: 'Best Seller',
    highlights: ['Special rugged braided jacket withstands 10,000+ bend tests', 'Fast 3A charging and 480 Mbps high-speed data transfer', 'Reinforced aluminum alloy connector housings', 'Universal compatibility with all Type-C smartphones and tablets'],
    specs: { 'Length': '1.5 Meters', 'Current': '3 Amp Fast Charging', 'Material': 'Nylon Braided', 'Warranty': '2 Years boAt Warranty' }, pool: P.accessories },
  { name: 'Logitech K380 Multi-Device Bluetooth Wireless Keyboard - Rose Pink', brand: 'Logitech', category: 'Electronics', subcategory: 'Accessories', price: 2795, originalPrice: 3995, rating: 4.6, reviewCount: 26000, badge: 'Top Rated',
    highlights: ['Slim, lightweight portable keyboard that pairs with up to 3 devices', 'Easy-Switch buttons to toggle between laptop, tablet, and smartphone', 'Scooped, low-profile scissor keys for comfortable, quiet laptop-style typing', '2-year battery life with two pre-installed AAA alkaline batteries'],
    specs: { 'Layout': 'Compact Tenkeyless', 'Battery': '2 Years (2x AAA included)', 'Connectivity': 'Bluetooth 3.0 up to 10m', 'Weight': '423 g', 'Warranty': '1 Year Logitech Warranty' }, pool: P.accessories },
  { name: 'Crucial P3 Plus 1TB PCIe 4.0 3D NAND NVMe M.2 SSD (Up to 5000 MB/s)', brand: 'Crucial', category: 'Electronics', subcategory: 'Accessories', price: 6299, originalPrice: 10500, rating: 4.7, reviewCount: 38000, badge: 'Best Seller',
    highlights: ['Sequential reads/writes up to 5000/4200 MB/s via PCIe Gen4 x4', 'Engineered with Micron advanced 3D NAND technology', 'Backwards compatible with Gen3 systems', 'Dynamic write acceleration and thermal protection'],
    specs: { 'Capacity': '1TB', 'Form Factor': 'M.2 2280', 'Speed': 'Up to 5000 MB/s', 'Warranty': '5 Years Limited Warranty' }, pool: P.accessories },
  { name: 'Spigen Ultra Hybrid Back Case Cover for iPhone 16 Pro - Crystal Clear', brand: 'Spigen', category: 'Electronics', subcategory: 'Accessories', price: 1499, originalPrice: 2499, rating: 4.6, reviewCount: 16500, badge: 'Best Seller',
    highlights: ['Crystal clear transparency shows off the natural beauty of iPhone 16 Pro', 'Air Cushion Technology absorbs shocks from drops and knocks', 'Raised bezels lift screen and camera lenses off flat surfaces', 'Pronounced tactile buttons with crisp feedback'],
    specs: { 'Material': 'TPU Bumper + Polycarbonate Back', 'Compatibility': 'Apple iPhone 16 Pro', 'Color': 'Crystal Clear', 'Warranty': '6 Months Manufacturer Warranty' }, pool: P.accessories },
  { name: 'JBL Flip 6 Wireless Portable Bluetooth Speaker (IP67 Waterproof) - Squad Camo', brand: 'JBL', category: 'Electronics', subcategory: 'Accessories', price: 9999, originalPrice: 13999, rating: 4.7, reviewCount: 31200, badge: 'Top Rated',
    highlights: ['2-way speaker system delivers loud, crystal clear, powerful JBL Original Pro sound', 'Racetrack-shaped woofer with separate tweeter and dual passive radiators', 'IP67 waterproof and dustproof for beach, pool, or rain adventures', 'Up to 12 hours of playtime on a single charge with PartyBoost pairing'],
    specs: { 'Output': '20W RMS Woofer + 10W RMS Tweeter', 'Battery': 'Up to 12 hours', 'Resistance': 'IP67 Waterproof', 'Weight': '550 g', 'Warranty': '1 Year JBL India Warranty' }, pool: P.accessories },
  { name: 'Sony SRS-XB100 Wireless Ultra-Portable Bluetooth Speaker - Black', brand: 'Sony', category: 'Electronics', subcategory: 'Accessories', price: 3990, originalPrice: 5990, rating: 4.5, reviewCount: 18200, badge: 'Best Seller',
    highlights: ['Sound Diffusion Processor expands sound in every direction', 'Extra Bass radiator delivers punchy, deep bass in a compact body', 'Up to 16 hours of battery life with battery status indicator', 'UV coating and IP67 waterproof & dustproof with multiway strap'],
    specs: { 'Battery': 'Up to 16 hours', 'Connectivity': 'Bluetooth 5.3, Hands-free Calling', 'Resistance': 'IP67 Waterproof', 'Weight': '274 g', 'Warranty': '1 Year Sony Warranty' }, pool: P.accessories },
  { name: 'SanDisk Ultra Dual Drive Go 128GB USB Type-C & Type-A Flash Drive - Black', brand: 'SanDisk', category: 'Electronics', subcategory: 'Accessories', price: 1199, originalPrice: 2100, rating: 4.5, reviewCount: 58000, badge: 'Best Seller',
    highlights: ['2-in-1 swivel flash drive with reversible USB Type-C and traditional Type-A', 'High-speed USB 3.2 Gen 1 performance with up to 400 MB/s read speeds', 'Seamlessly move files between USB Type-C smartphones, tablets, and computers', 'Automatic backup with SanDisk Memory Zone app'],
    specs: { 'Capacity': '128GB', 'Read Speed': 'Up to 400 MB/s', 'Connectors': 'USB Type-C & USB Type-A', 'Warranty': '5 Years Limited Warranty' }, pool: P.accessories },
  { name: 'American Tourister 32L Casual Laptop Backpack - Navy Blue', brand: 'American Tourister', category: 'Electronics', subcategory: 'Accessories', price: 1499, originalPrice: 3250, rating: 4.4, reviewCount: 44200, badge: 'Great Value',
    highlights: ['Ergonomically designed with Tractum Suspension shoulder straps', 'Full-cushioned laptop compartment fits screens up to 15.6 inches', 'Side bottle holders and front quick-access zipper pocket', 'High durability water-resistant twill polyester fabric'],
    specs: { 'Capacity': '32 Liters', 'Laptop Size': 'Up to 15.6 inches', 'Material': 'Water-resistant Polyester', 'Warranty': '1 Year International Warranty' }, pool: P.accessories },
  { name: 'Logitech C922 Pro Stream Full HD 1080p Webcam with Tripod Included', brand: 'Logitech', category: 'Electronics', subcategory: 'Accessories', price: 8495, originalPrice: 12995, rating: 4.6, reviewCount: 14200, badge: 'Top Rated',
    highlights: ['Stream and record vibrant, true-to-life 1080p 30fps or hyperfast 720p 60fps', 'Full HD glass lens with autofocus and automatic HD light correction', 'Two omnidirectional microphones capture clear audio from every angle', 'Includes adjustable tabletop tripod extending up to 18.5 cm'],
    specs: { 'Resolution': '1080p/30fps, 720p/60fps', 'Field of View': '78 degrees', 'Focus': 'Autofocus with Glass Lens', 'Cable': '1.5 m USB', 'Warranty': '2 Years Logitech Warranty' }, pool: P.accessories },
  { name: 'Anker 7-in-1 USB-C Hub (4K HDMI, 100W Power Delivery, SD Card, 3x USB 3.0)', brand: 'Anker', category: 'Electronics', subcategory: 'Accessories', price: 3499, originalPrice: 5999, rating: 4.6, reviewCount: 22100, badge: 'Best Seller',
    highlights: ['Massive expansion: 4K 30Hz HDMI, 100W Power Delivery pass-through, SD & microSD card slots, and 3x USB-A 3.0 data ports', 'Transfer movies, music, and entire photo libraries at 5 Gbps in seconds', 'Sleek aluminum alloy exterior designed to match MacBook and premium laptops', 'Plug and play with no drivers required for Windows, Mac, or iPadOS'],
    specs: { 'HDMI': 'Up to 4K @ 30Hz', 'Power Delivery': 'Up to 100W Input (85W to host)', 'Transfer Speed': '5 Gbps', 'Warranty': '18 Months Anker Warranty' }, pool: P.accessories }
];

console.log('Extra items arrays prepared.');

// Process extra items into standard format
const startId = baseProducts.length + 1;
const allExtra = [
  ...extraTablets,
  ...extraHeadphones,
  ...extraSmartwatches,
  ...extraTVs,
  ...extraCameras,
  ...extraAccessories
];

const newProductsList = allExtra.map((p, idx) => {
  const id = startId + idx;
  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  const primaryImg = p.pool[idx % p.pool.length];
  const secondaryImg = p.pool[(idx + 1) % p.pool.length];
  const tertiaryImg = p.pool[(idx + 2) % p.pool.length];

  return {
    id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    price: p.price,
    originalPrice: p.originalPrice,
    discount,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: primaryImg,
    images: [primaryImg, secondaryImg, tertiaryImg],
    badge: p.badge || (discount > 25 ? 'Great Value' : null),
    delivery: p.price >= 499 ? 'Free delivery' : '₹40 delivery',
    deliveryDays: (id % 4) + 2,
    inStock: true,
    seller: p.brand === 'Apple' ? 'Apple Authorized Reseller' : (p.brand === 'Samsung' ? 'Samsung Official Store' : (p.brand === 'Sony' ? 'Sony Official Center' : 'ShopVerse Prime Retail')),
    description: 'Genuine ' + p.name + ' from ' + p.brand + '. Enjoy official manufacturer warranty, blazing fast delivery, and hassle-free 7-day returns on ShopVerse.',
    highlights: p.highlights || ['100% Genuine Brand Product', 'Official Manufacturer Warranty', 'Fast & Secure Delivery'],
    specifications: p.specs || { 'Brand': p.brand, 'Category': p.category, 'Condition': 'Brand New' },
    warranty: p.specs?.Warranty || '1 Year Manufacturer Warranty',
    emi: p.price > 10000 ? ('No Cost EMI starts at ₹' + Math.round(p.price / 12) + '/month') : null,
    offers: [
      'Bank Offer: Flat ₹1,500 Instant Discount on HDFC & ICICI Credit Cards',
      'Special Price: Extra discount applied at checkout',
      'No Cost EMI available on major credit cards'
    ]
  };
});

const totalProducts = [...baseProducts, ...newProductsList];
console.log('Grand total products:', totalProducts.length);

// Write to products.js
const fileContent = 'export const products = ' + JSON.stringify(totalProducts, null, 2) + ';\\n\\n' +
'export const getProductById = (id) => products.find(p => p.id === parseInt(id));\\n\\n' +
'export const getProductsByCategory = (category) => products.filter(p => p.category === category);\\n\\n' +
'export const getProductsBySubcategory = (subcategory) => products.filter(p => p.subcategory === subcategory);\\n\\n' +
'export const searchProducts = (query) => {\\n' +
'  const q = query.toLowerCase();\\n' +
'  return products.filter(p =>\\n' +
'    p.name.toLowerCase().includes(q) ||\\n' +
'    p.brand.toLowerCase().includes(q) ||\\n' +
'    p.category.toLowerCase().includes(q) ||\\n' +
'    p.subcategory.toLowerCase().includes(q) ||\\n' +
'    p.description.toLowerCase().includes(q)\\n' +
'  );\\n' +
'};\\n\\n' +
'export const getProductsByIds = (ids) => products.filter(p => ids.includes(p.id));\\n\\n' +
'export const getBrands = () => [...new Set(products.map(p => p.brand))];\\n\\n' +
'export const getPriceRange = () => {\\n' +
'  const prices = products.map(p => p.price);\\n' +
'  return { min: Math.min(...prices), max: Math.max(...prices) };\\n' +
'};\\n';

  const targetPath = path.join(__dirname, '..', 'src', 'data', 'products.js');
  fs.writeFileSync(targetPath, fileContent, 'utf8');
  console.log('SUCCESS: Written ' + totalProducts.length + ' products to ' + targetPath);
  process.exit(0);
})();
