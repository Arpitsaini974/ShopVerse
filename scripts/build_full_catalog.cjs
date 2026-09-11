const fs = require('fs');
const path = require('path');

const IMAGES = {
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', // MacBook Pro
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80', // MacBook Air
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', // Dell XPS
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80', // Dell Laptop
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', // ASUS ROG Gaming
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80', // HP Laptop
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80', // Acer Gaming
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', // Sleek laptop
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80', // Modern laptop
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', // Laptop workspace
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', // Business Laptop
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80', // Ultra thin laptop
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80', // Silver laptop
    'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=80', // Designer laptop
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'  // Workstation laptop
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

// Raw definitions for smartphones (All 12 requested brands)
const rawSmartphones = [
  // Apple
  { name: 'Apple iPhone 16 Pro Max (256 GB) - Desert Titanium', brand: 'Apple', price: 144900, originalPrice: 159900, rating: 4.8, reviewCount: 14890, badge: 'Best Seller',
    highlights: ['6.9-inch Super Retina XDR display with ProMotion', 'A18 Pro chip with 6-core GPU', '48MP Fusion camera with 5x Telephoto', 'Titanium design with latest Ceramic Shield', 'All-day battery life with up to 33 hours video'],
    specs: { 'Display': '6.9-inch Super Retina XDR OLED, 120Hz', 'Processor': 'Apple A18 Pro Bionic', 'RAM': '8GB', 'Storage': '256GB', 'Camera': '48MP + 48MP Ultra Wide + 12MP 5x Telephoto', 'Battery': '4685 mAh, MagSafe Wireless', 'OS': 'iOS 18', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium', brand: 'Apple', price: 119900, originalPrice: 129900, rating: 4.7, reviewCount: 11240, badge: 'Top Rated',
    highlights: ['6.3-inch Super Retina XDR display', 'A18 Pro chip with Camera Control', 'Pro camera system with 48MP Fusion', 'Grade 5 Titanium with textured matte glass', 'Action Button & USB-C with USB 3 speeds'],
    specs: { 'Display': '6.3-inch Super Retina XDR OLED, 120Hz', 'Processor': 'Apple A18 Pro Bionic', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '48MP + 48MP + 12MP 5x Telephoto', 'Battery': '3582 mAh', 'OS': 'iOS 18', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple iPhone 16 (128 GB) - Ultramarine', brand: 'Apple', price: 74999, originalPrice: 79900, rating: 4.7, reviewCount: 24800, badge: 'Best Seller',
    highlights: ['Camera Control button for instant capture', 'A18 chip with 16-core Neural Engine', '48MP Fusion camera with 2x optical-quality Telephoto', 'Aerospace-grade aluminum with color-infused back glass', 'Super Retina XDR 6.1-inch display'],
    specs: { 'Display': '6.1-inch Super Retina XDR OLED', 'Processor': 'Apple A18', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '48MP Fusion + 12MP Ultra Wide', 'Battery': '3561 mAh', 'OS': 'iOS 18', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple iPhone 15 (128 GB) - Black', brand: 'Apple', price: 58999, originalPrice: 69900, rating: 4.6, reviewCount: 42100, badge: 'Great Value',
    highlights: ['Dynamic Island bubbles up alerts and Live Activities', '48MP Main camera with 2x Telephoto', 'All-day battery life with USB-C connector', 'A16 Bionic chip powers advanced computational photography'],
    specs: { 'Display': '6.1-inch Super Retina XDR OLED', 'Processor': 'Apple A16 Bionic', 'RAM': '6GB', 'Storage': '128GB', 'Camera': '48MP + 12MP Ultra Wide', 'Battery': '3349 mAh', 'OS': 'iOS 17 upgradable to iOS 18', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple iPhone 14 (128 GB) - Starlight', brand: 'Apple', price: 51999, originalPrice: 59900, rating: 4.5, reviewCount: 68900, badge: null,
    highlights: ['6.1-inch Super Retina XDR display', 'Advanced camera system for better photos in any light', 'Cinematic mode in 4K Dolby Vision up to 30 fps', 'Vital safety technology — Crash Detection'],
    specs: { 'Display': '6.1-inch Super Retina XDR OLED', 'Processor': 'Apple A15 Bionic', 'RAM': '6GB', 'Storage': '128GB', 'Camera': '12MP Dual Rear Camera', 'Battery': '3279 mAh', 'OS': 'iOS 16 upgradable', 'Warranty': '1 Year Apple Warranty' } },

  // Samsung
  { name: 'Samsung Galaxy S25 Ultra 5G (Titanium Black, 256 GB)', brand: 'Samsung', price: 129999, originalPrice: 139999, rating: 4.8, reviewCount: 9450, badge: 'New',
    highlights: ['Galaxy AI with Circle to Search and Live Translate', '200MP Quad Telephoto Camera with 100x Space Zoom', 'Snapdragon 8 Elite Mobile Platform for Galaxy', 'Built-in S Pen with titanium frame and Corning Gorilla Armor'],
    specs: { 'Display': '6.9-inch Dynamic AMOLED 2X, 120Hz, 2600 nits', 'Processor': 'Snapdragon 8 Elite for Galaxy (3nm)', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '200MP + 50MP 5x + 50MP Ultra-wide + 10MP 3x', 'Battery': '5000 mAh, 45W Charging', 'OS': 'One UI 7 (Android 15)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Samsung Galaxy S25 5G (Sparkling Blue, 128 GB)', brand: 'Samsung', price: 74999, originalPrice: 80999, rating: 4.6, reviewCount: 4200, badge: 'New',
    highlights: ['Compact powerhouse with 6.2-inch 120Hz AMOLED', 'Next-gen Galaxy AI photo editing and summaries', 'Armor Aluminum 2.0 frame with IP68 rating', 'Up to 7 generations of OS upgrades'],
    specs: { 'Display': '6.2-inch Dynamic AMOLED 2X, 120Hz', 'Processor': 'Snapdragon 8 Elite / Exynos 2500', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '50MP + 12MP + 10MP 3x', 'Battery': '4000 mAh, 25W Charging', 'OS': 'Android 15 (One UI 7)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)', brand: 'Samsung', price: 99999, originalPrice: 129999, rating: 4.7, reviewCount: 31200, badge: 'Top Rated',
    highlights: ['Titanium exterior with 6.8-inch Flat Display', '200MP camera with ProVisual engine', 'Generative Edit and Note Assist via Galaxy AI', 'Snapdragon 8 Gen 3 for Galaxy'],
    specs: { 'Display': '6.8-inch Dynamic AMOLED 2X, 120Hz', 'Processor': 'Snapdragon 8 Gen 3 (4nm)', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '200MP + 50MP + 12MP + 10MP', 'Battery': '5000 mAh', 'OS': 'Android 14 (One UI 6.1)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Samsung Galaxy A55 5G (Awesome Iceblue, 128 GB)', brand: 'Samsung', price: 34999, originalPrice: 42999, rating: 4.4, reviewCount: 18400, badge: 'Best Seller',
    highlights: ['Metal frame with Corning Gorilla Glass Victus+', '50MP OIS camera with Nightography', 'Super AMOLED 120Hz display with Vision Booster', 'IP67 water and dust resistance'],
    specs: { 'Display': '6.6-inch Super AMOLED 120Hz', 'Processor': 'Exynos 1480 with Xclipse 530 GPU', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '50MP OIS + 12MP + 5MP', 'Battery': '5000 mAh, 25W Fast Charging', 'OS': 'Android 14, 4 OS updates', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Samsung Galaxy M35 5G (Daybreak Blue, 128 GB)', brand: 'Samsung', price: 16999, originalPrice: 22499, rating: 4.3, reviewCount: 29500, badge: 'Great Value',
    highlights: ['Massive 6000 mAh battery with 25W fast charging', '120Hz sAMOLED display with 1000 nits brightness', '50MP No Shake Cam (OIS) with 4K recording', 'Vapor Cooling Chamber for smooth gaming'],
    specs: { 'Display': '6.6-inch Super AMOLED 120Hz', 'Processor': 'Exynos 1380', 'RAM': '6GB', 'Storage': '128GB', 'Camera': '50MP OIS + 8MP + 2MP', 'Battery': '6000 mAh', 'OS': 'Android 14', 'Warranty': '1 Year Manufacturer Warranty' } },

  // OnePlus
  { name: 'OnePlus 13 5G (Midnight Black, 256 GB)', brand: 'OnePlus', price: 69999, originalPrice: 74999, rating: 4.8, reviewCount: 6300, badge: 'New',
    highlights: ['Snapdragon 8 Elite chipset with 16GB RAM', 'Hasselblad Camera for Mobile with triple 50MP sensors', '6000 mAh Silicon-Carbon battery with 100W SUPERVOOC', '2K 120Hz Oriental Display with Dolby Vision'],
    specs: { 'Display': '6.82-inch 2K LTPO AMOLED, 120Hz, 4500 nits', 'Processor': 'Snapdragon 8 Elite (3nm)', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '50MP Sony LYT-808 + 50MP 3x Periscope + 50MP UW', 'Battery': '6000 mAh, 100W Wired, 50W Wireless', 'OS': 'OxygenOS 15 (Android 15)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'OnePlus 13R 5G (Astral Trail, 256 GB)', brand: 'OnePlus', price: 42999, originalPrice: 47999, rating: 4.7, reviewCount: 8900, badge: 'Best Seller',
    highlights: ['Snapdragon 8 Gen 3 flagship gaming performance', '6000 mAh battery with 80W fast charging', '1.5K 120Hz ProXDR display with Aqua Touch', 'Sony 50MP IMX906 flagship camera with OIS'],
    specs: { 'Display': '6.78-inch 1.5K LTPO AMOLED, 120Hz', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '50MP OIS + 8MP + 2MP', 'Battery': '6000 mAh, 80W Charging', 'OS': 'OxygenOS 15', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'OnePlus Nord 4 5G (Mercurial Silver, 128 GB)', brand: 'OnePlus', price: 29999, originalPrice: 32999, rating: 4.5, reviewCount: 38200, badge: 'Top Rated',
    highlights: ['First all-metal unibody 5G smartphone of the 5G era', 'Snapdragon 7+ Gen 3 processor with AI capabilities', '5500 mAh battery with 100W SUPERVOOC charging', '6 years of software support and 4 OS upgrades'],
    specs: { 'Display': '6.74-inch 1.5K AMOLED 120Hz', 'Processor': 'Snapdragon 7+ Gen 3 (4nm)', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '50MP Sony LYT-600 OIS + 8MP UW', 'Battery': '5500 mAh, 100W Charging', 'OS': 'OxygenOS 14.1', 'Warranty': '1 Year Manufacturer Warranty' } },

  // Xiaomi & Redmi
  { name: 'Xiaomi 14 Ultra 5G (White, 512 GB)', brand: 'Xiaomi', price: 99999, originalPrice: 119999, rating: 4.7, reviewCount: 2900, badge: 'Top Rated',
    highlights: ['Leica Summilux Quad Camera with 1-inch Sony LYT-900 sensor', 'Stepless variable aperture from f/1.63 to f/4.0', 'Snapdragon 8 Gen 3 with LiquidCool Loop system', 'WQHD+ AMOLED LTPO 120Hz with Shield Glass'],
    specs: { 'Display': '6.73-inch WQHD+ AMOLED, 120Hz, 3000 nits', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '16GB', 'Storage': '512GB', 'Camera': '50MP 1-inch + 50MP 3.2x + 50MP 5x Periscope + 50MP UW', 'Battery': '5000 mAh, 90W Wired, 80W Wireless', 'OS': 'Xiaomi HyperOS (Android 14)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Xiaomi 14 5G (Black, 512 GB)', brand: 'Xiaomi', price: 59999, originalPrice: 79999, rating: 4.6, reviewCount: 7800, badge: 'Great Value',
    highlights: ['Compact 6.36-inch flagship with ultra-thin bezels', 'Leica professional optics with 75mm floating telephoto', 'Snapdragon 8 Gen 3 processor', '90W HyperCharge with 50W wireless charging'],
    specs: { 'Display': '6.36-inch 1.5K LTPO OLED, 120Hz', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB', 'Storage': '512GB', 'Camera': '50MP Light Fusion 900 + 50MP Telephoto + 50MP UW', 'Battery': '4610 mAh, 90W Charging', 'OS': 'Xiaomi HyperOS', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Redmi Note 14 Pro+ 5G (Titanium Gray, 256 GB)', brand: 'Redmi', price: 30999, originalPrice: 34999, rating: 4.5, reviewCount: 16400, badge: 'Best Seller',
    highlights: ['200MP flagship OIS camera with 4x in-sensor zoom', 'Snapdragon 7s Gen 3 with high-efficiency cooling', '6200 mAh Silicon-Carbon battery with 90W HyperCharge', 'IP68 & IP69K dust and high-pressure water resistance'],
    specs: { 'Display': '6.67-inch 1.5K 120Hz Curved AMOLED', 'Processor': 'Snapdragon 7s Gen 3 (4nm)', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '200MP OIS + 8MP UW + 2MP Macro', 'Battery': '6200 mAh, 90W HyperCharge', 'OS': 'HyperOS (Android 14)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Redmi Note 13 5G (Prism Gold, 128 GB)', brand: 'Redmi', price: 15499, originalPrice: 20999, rating: 4.3, reviewCount: 45600, badge: 'Great Value',
    highlights: ['108MP 3x zoom camera with ultra-clear mode', 'Slimmest Redmi Note design with super-thin bezels', 'MediaTek Dimensity 6080 5G processor', 'FHD+ 120Hz AMOLED with Corning Gorilla Glass 5'],
    specs: { 'Display': '6.67-inch FHD+ 120Hz AMOLED', 'Processor': 'MediaTek Dimensity 6080', 'RAM': '6GB', 'Storage': '128GB', 'Camera': '108MP + 8MP + 2MP', 'Battery': '5000 mAh, 33W Fast Charging', 'OS': 'MIUI 14 upgradable', 'Warranty': '1 Year Manufacturer Warranty' } },

  // Realme
  { name: 'Realme GT 7 Pro 5G (Mars Orange, 256 GB)', brand: 'Realme', price: 59999, originalPrice: 69999, rating: 4.7, reviewCount: 5200, badge: 'New',
    highlights: ['India\'s first Snapdragon 8 Elite smartphone', '6500 mAh massive Titan battery with 120W charging', 'Eco2 OLED Plus display co-developed with Samsung', 'Underwater photography mode with IP69 rating'],
    specs: { 'Display': '6.78-inch 1.5K 120Hz OLED, 6000 nits peak', 'Processor': 'Snapdragon 8 Elite (3nm)', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '50MP Sony IMX906 + 50MP 3x Periscope + 8MP UW', 'Battery': '6500 mAh, 120W Charging', 'OS': 'Realme UI 6.0 (Android 15)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Realme 13 Pro+ 5G (Monet Gold, 256 GB)', brand: 'Realme', price: 29999, originalPrice: 34999, rating: 4.5, reviewCount: 19800, badge: 'Top Rated',
    highlights: ['Ultra Clear Camera with Sony LYT-701 OIS sensor', 'Sony LYT-600 Periscope telephoto with 3x optical zoom', 'Snapdragon 7s Gen 2 with 3D VC cooling', 'Curved Vision 120Hz AMOLED with Pro-XDR'],
    specs: { 'Display': '6.7-inch FHD+ 120Hz Curved AMOLED', 'Processor': 'Snapdragon 7s Gen 2', 'RAM': '8GB', 'Storage': '256GB', 'Camera': '50MP OIS + 50MP 3x Periscope + 8MP UW', 'Battery': '5200 mAh, 80W SUPERVOOC', 'OS': 'Realme UI 5.0', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Realme Narzo 70 Pro 5G (Glass Green, 128 GB)', brand: 'Realme', price: 16999, originalPrice: 24999, rating: 4.4, reviewCount: 31500, badge: 'Great Value',
    highlights: ['Flagship Sony IMX890 OIS camera sensor', 'Horizon Glass design with premium feel', 'Air Gestures for touch-free control', '67W SUPERVOOC charging with 5000 mAh battery'],
    specs: { 'Display': '6.67-inch FHD+ 120Hz AMOLED', 'Processor': 'MediaTek Dimensity 7050', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '50MP Sony IMX890 OIS + 8MP + 2MP', 'Battery': '5000 mAh, 67W Charging', 'OS': 'Realme UI 5.0', 'Warranty': '1 Year Manufacturer Warranty' } },

  // Vivo
  { name: 'Vivo X200 Pro 5G (Titanium, 512 GB)', brand: 'Vivo', price: 94999, originalPrice: 99999, rating: 4.8, reviewCount: 3400, badge: 'New',
    highlights: ['ZEISS 200MP APO Telephoto Camera with Blueprint sensor', 'MediaTek Dimensity 9400 flagship 3nm chip', '6000 mAh BlueOcean battery with 90W FlashCharge', 'Armor Glass with IP68 and IP69 rating'],
    specs: { 'Display': '6.78-inch 1.5K 120Hz 8T LTPO OLED', 'Processor': 'MediaTek Dimensity 9400 (3nm)', 'RAM': '16GB', 'Storage': '512GB', 'Camera': '50MP Sony LYT-818 + 200MP ZEISS APO 3.7x + 50MP UW', 'Battery': '6000 mAh, 90W FlashCharge', 'OS': 'Funtouch OS 15 (Android 15)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Vivo V40 Pro 5G (Ganges Blue, 256 GB)', brand: 'Vivo', price: 49999, originalPrice: 54999, rating: 4.6, reviewCount: 14200, badge: 'Top Rated',
    highlights: ['ZEISS Multifocal Portrait with 50MP Sony IMX921 sensor', '50MP ZEISS Telephoto Portrait Camera (2x optical, 50x digital)', '5500 mAh BlueVolt Battery in 7.58mm ultra-slim body', 'MediaTek Dimensity 9200+ flagship performance'],
    specs: { 'Display': '6.78-inch 1.5K 120Hz 3D Curved AMOLED', 'Processor': 'MediaTek Dimensity 9200+ (4nm)', 'RAM': '8GB', 'Storage': '256GB', 'Camera': '50MP OIS + 50MP 2x Telephoto + 50MP UW', 'Battery': '5500 mAh, 80W FlashCharge', 'OS': 'Funtouch OS 14', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Vivo T3 Ultra 5G (Frost Green, 128 GB)', brand: 'Vivo', price: 31999, originalPrice: 35999, rating: 4.5, reviewCount: 22100, badge: 'Best Seller',
    highlights: ['Dimensity 9200+ flagship processor with 1.6M+ AnTuTu score', 'Sony IMX921 50MP sensor with OIS and Aura Light', '3D Curved AMOLED with 4500 nits local peak brightness', 'IP68 water and dust resistance'],
    specs: { 'Display': '6.78-inch 1.5K 120Hz 3D Curved AMOLED', 'Processor': 'MediaTek Dimensity 9200+', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '50MP Sony IMX921 OIS + 8MP UW', 'Battery': '5500 mAh, 80W FlashCharge', 'OS': 'Funtouch OS 14', 'Warranty': '1 Year Manufacturer Warranty' } },

  // Oppo
  { name: 'Oppo Find X8 Pro 5G (Space Black, 512 GB)', brand: 'Oppo', price: 99999, originalPrice: 109999, rating: 4.8, reviewCount: 2600, badge: 'New',
    highlights: ['Hasselblad Master Camera with Dual Periscope Telephoto', 'MediaTek Dimensity 9400 with Trinity Engine', '5910 mAh Glacier Battery with 80W SUPERVOOC', 'Infinite View Display with quad micro-curved edges'],
    specs: { 'Display': '6.78-inch 1.5K 120Hz LTPO AMOLED', 'Processor': 'MediaTek Dimensity 9400 (3nm)', 'RAM': '16GB', 'Storage': '512GB', 'Camera': '50MP LYT-808 + 50MP 3x + 50MP 6x Periscope + 50MP UW', 'Battery': '5910 mAh, 80W Wired, 50W Wireless', 'OS': 'ColorOS 15 (Android 15)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Oppo Reno 12 Pro 5G (Sunset Gold, 256 GB)', brand: 'Oppo', price: 36999, originalPrice: 41999, rating: 4.5, reviewCount: 16800, badge: 'Best Seller',
    highlights: ['AI Portrait Expert with AI Eraser 2.0 and AI Best Face', 'All-Round Armour with High-Strength Alloy Framework', 'MediaTek Dimensity 7300-Energy co-designed chip', '80W SUPERVOOC flash charge with 5000 mAh battery'],
    specs: { 'Display': '6.7-inch FHD+ 120Hz Quad-Curved AMOLED', 'Processor': 'MediaTek Dimensity 7300-Energy', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '50MP Sony LYT-600 OIS + 50MP 2x Telephoto + 8MP UW', 'Battery': '5000 mAh, 80W SUPERVOOC', 'OS': 'ColorOS 14.1', 'Warranty': '1 Year Manufacturer Warranty' } },

  // Motorola
  { name: 'Motorola Edge 50 Ultra 5G (Peach Fuzz, 512 GB)', brand: 'Motorola', price: 54999, originalPrice: 64999, rating: 4.6, reviewCount: 8400, badge: 'Top Rated',
    highlights: ['Pantone validated camera and display colors', 'Snapdragon 8s Gen 3 processor with Moto AI', 'Real wood back finish and vegan leather options', '125W TurboPower charging + 50W wireless charging'],
    specs: { 'Display': '6.7-inch 1.5K 144Hz pOLED, 2800 nits', 'Processor': 'Snapdragon 8s Gen 3', 'RAM': '16GB', 'Storage': '512GB', 'Camera': '50MP OIS + 64MP 3x Periscope + 50MP UW/Macro', 'Battery': '4500 mAh, 125W TurboPower', 'OS': 'Hello UI (Android 14)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Motorola Edge 50 Pro 5G (Black Beauty, 256 GB)', brand: 'Motorola', price: 29999, originalPrice: 36999, rating: 4.5, reviewCount: 26500, badge: 'Best Seller',
    highlights: ['World\'s 1st Pantone Validated 1.5K 144Hz True Color Display', 'Snapdragon 7 Gen 3 processor', '50MP main with 3x optical telephoto lens', '125W TurboPower charger in the box with IP68 protection'],
    specs: { 'Display': '6.7-inch 1.5K 144Hz 3D Curved pOLED', 'Processor': 'Snapdragon 7 Gen 3', 'RAM': '8GB', 'Storage': '256GB', 'Camera': '50MP OIS + 10MP 3x Telephoto + 13MP UW', 'Battery': '4500 mAh, 125W TurboPower', 'OS': 'Hello UI (Android 14)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Moto G85 5G (Cobalt Blue, 128 GB)', brand: 'Motorola', price: 16999, originalPrice: 20999, rating: 4.3, reviewCount: 34100, badge: 'Great Value',
    highlights: ['Segment-first 120Hz 3D Curved pOLED display with Gorilla Glass 5', 'Sony LYTIA 600 50MP OIS camera', 'Snapdragon 6s Gen 3 processor', '5000 mAh battery with stereo speakers by Dolby Atmos'],
    specs: { 'Display': '6.67-inch FHD+ 120Hz 3D Curved pOLED', 'Processor': 'Snapdragon 6s Gen 3', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '50MP Sony LYT-600 OIS + 8MP UW', 'Battery': '5000 mAh, 33W TurboPower', 'OS': 'Hello UI (Android 14)', 'Warranty': '1 Year Manufacturer Warranty' } },

  // Google Pixel
  { name: 'Google Pixel 9 Pro XL (Obsidian, 256 GB)', brand: 'Google Pixel', price: 124999, originalPrice: 134999, rating: 4.7, reviewCount: 4800, badge: 'Top Rated',
    highlights: ['Google Tensor G4 chip with 16GB RAM for advanced Gemini AI', 'Super Actua 6.8-inch display with 3000 nits peak brightness', 'Triple rear camera system with 5x telephoto and up to 30x Super Res Zoom', '7 years of OS upgrades, security updates, and Pixel Feature Drops'],
    specs: { 'Display': '6.8-inch Super Actua LTPO OLED, 120Hz', 'Processor': 'Google Tensor G4 with Titan M2', 'RAM': '16GB', 'Storage': '256GB', 'Camera': '50MP Octa PD + 48MP Quad PD UW + 48MP 5x Telephoto', 'Battery': '5060 mAh, 37W Fast Charging', 'OS': 'Android 14, 7 years updates', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Google Pixel 9 (Porcelain, 128 GB)', brand: 'Google Pixel', price: 79999, originalPrice: 89999, rating: 4.6, reviewCount: 6500, badge: 'New',
    highlights: ['Engineered by Google with Gemini built-in', 'Tensor G4 processor with 12GB RAM for multitasking', '50MP main camera and updated 48MP Ultrawide with Macro Focus', 'Actua 6.3-inch OLED display with satellite SOS'],
    specs: { 'Display': '6.3-inch Actua OLED, 120Hz, 2700 nits', 'Processor': 'Google Tensor G4', 'RAM': '12GB', 'Storage': '128GB', 'Camera': '50MP Octa PD + 48MP Ultra-wide', 'Battery': '4700 mAh, 27W Fast Charging', 'OS': 'Android 14, 7 years updates', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Google Pixel 8a (Bay, 128 GB)', brand: 'Google Pixel', price: 44999, originalPrice: 52999, rating: 4.5, reviewCount: 18900, badge: 'Great Value',
    highlights: ['Google Tensor G3 chip with Google AI features like Best Take', '6.1-inch Actua display, now 40% brighter with 120Hz', '64MP quad PD main camera with Night Sight', '7 years of Pixel drops, OS, and security updates'],
    specs: { 'Display': '6.1-inch Actua OLED, 120Hz', 'Processor': 'Google Tensor G3', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '64MP Quad PD + 13MP Ultra-wide', 'Battery': '4492 mAh, 18W Charging', 'OS': 'Android 14, 7 years updates', 'Warranty': '1 Year Manufacturer Warranty' } },

  // Nothing
  { name: 'Nothing Phone (2a) Plus (Metallic Grey, 256 GB)', brand: 'Nothing', price: 27999, originalPrice: 29999, rating: 4.6, reviewCount: 15400, badge: 'Top Rated',
    highlights: ['MediaTek Dimensity 7350 Pro 5G world exclusive chipset', 'Dual 50MP camera + 50MP selfie camera with 4K recording', 'Iconic Glyph Interface with customizable light sequences', 'Nothing OS 2.6 with clean zero-bloatware experience'],
    specs: { 'Display': '6.7-inch Flexible AMOLED, 120Hz, 1300 nits', 'Processor': 'MediaTek Dimensity 7350 Pro (4nm)', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '50MP Sony OIS + 50MP Ultra-wide', 'Battery': '5000 mAh, 50W Fast Charging', 'OS': 'Nothing OS 2.6 (Android 14)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Nothing Phone (2) (Dark Grey, 256 GB)', brand: 'Nothing', price: 36999, originalPrice: 49999, rating: 4.5, reviewCount: 22800, badge: 'Great Value',
    highlights: ['Flagship Snapdragon 8+ Gen 1 platform', 'Expanded Glyph Interface with essential notifications', 'LTPO 120Hz OLED display with 1600 nits peak', 'Dual 50MP cameras with Sony IMX890 sensor'],
    specs: { 'Display': '6.7-inch LTPO OLED, 1-120Hz', 'Processor': 'Snapdragon 8+ Gen 1', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '50MP Sony IMX890 OIS + 50MP Samsung JN1 UW', 'Battery': '4700 mAh, 45W Wired, 15W Wireless', 'OS': 'Nothing OS 2.5', 'Warranty': '1 Year Manufacturer Warranty' } },

  // iQOO
  { name: 'iQOO 13 5G (Nardo Grey, 256 GB)', brand: 'iQOO', price: 54999, originalPrice: 59999, rating: 4.8, reviewCount: 7100, badge: 'New',
    highlights: ['Snapdragon 8 Elite + Supercomputing Chip Q2 for 144FPS gaming', '2K 144Hz BOE Q10 Eye Care Display', '6150 mAh Blue Ocean battery with 120W FlashCharge', 'Monster Halo interactive lighting on camera module'],
    specs: { 'Display': '6.82-inch 2K 144Hz LTPO AMOLED, 1800 nits HBM', 'Processor': 'Snapdragon 8 Elite (3nm)', 'RAM': '12GB', 'Storage': '256GB', 'Camera': '50MP Sony IMX921 OIS + 50MP 2x Telephoto + 50MP UW', 'Battery': '6150 mAh, 120W FlashCharge', 'OS': 'Funtouch OS 15', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'iQOO Neo 9 Pro 5G (Fiery Red, 256 GB)', brand: 'iQOO', price: 36999, originalPrice: 41999, rating: 4.7, reviewCount: 28400, badge: 'Best Seller',
    highlights: ['Flagship Snapdragon 8 Gen 2 processor with Q1 Supercomputing chip', 'Sony IMX920 50MP Night Camera with OIS', '144Hz 1.5K LTPO AMOLED display with Wet Touch', '120W FlashCharge (0-50% in 11 minutes)'],
    specs: { 'Display': '6.78-inch 1.5K 144Hz LTPO AMOLED', 'Processor': 'Snapdragon 8 Gen 2 (4nm)', 'RAM': '8GB', 'Storage': '256GB', 'Camera': '50MP Sony IMX920 OIS + 8MP Ultra-wide', 'Battery': '5160 mAh, 120W FlashCharge', 'OS': 'Funtouch OS 14', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'iQOO Z9s Pro 5G (Luxe Marble, 128 GB)', brand: 'iQOO', price: 24999, originalPrice: 29999, rating: 4.5, reviewCount: 19700, badge: 'Great Value',
    highlights: ['Snapdragon 7 Gen 3 processor with 8.2L+ AnTuTu score', '3D Curved 120Hz AMOLED display with 4500 nits local peak', 'Sony IMX882 50MP OIS camera with 4K recording', '5500 mAh ultra-thin battery with 80W charging'],
    specs: { 'Display': '6.77-inch FHD+ 120Hz Curved AMOLED', 'Processor': 'Snapdragon 7 Gen 3', 'RAM': '8GB', 'Storage': '128GB', 'Camera': '50MP Sony IMX882 OIS + 8MP UW', 'Battery': '5500 mAh, 80W FlashCharge', 'OS': 'Funtouch OS 14', 'Warranty': '1 Year Manufacturer Warranty' } }
];

console.log(`Smartphones prepared: ${rawSmartphones.length}`);

// Raw definitions for Laptops (Student, Gaming, Business, Premium, Budget across Dell, HP, Lenovo, ASUS, Acer, Apple, MSI, Microsoft, Samsung)
const rawLaptops = [
  // Apple
  { name: 'Apple MacBook Pro 16-inch (M3 Max Chip, 36GB Unified Memory, 1TB SSD) - Space Black', brand: 'Apple', price: 349900, originalPrice: 379900, rating: 4.9, reviewCount: 1850, badge: 'Top Rated',
    highlights: ['M3 Max chip with 14-core CPU and 30-core GPU', '16.2-inch Liquid Retina XDR display with ProMotion', 'Up to 22 hours battery life — longest in a Mac', 'Six-speaker sound system with studio-quality mics', 'HDMI port, SDXC card slot, MagSafe 3 and three Thunderbolt 4 ports'],
    specs: { 'Processor': 'Apple M3 Max (14-core CPU, 30-core GPU)', 'RAM': '36GB Unified Memory', 'Storage': '1TB NVMe SSD', 'Display': '16.2-inch Liquid Retina XDR (3456x2234), 120Hz', 'Graphics': 'Apple 30-core GPU', 'Battery': 'Up to 22 hours (100Wh)', 'Weight': '2.14 kg', 'OS': 'macOS Sonoma', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple MacBook Pro 14-inch (M3 Pro Chip, 18GB Unified Memory, 512GB SSD) - Silver', brand: 'Apple', price: 199900, originalPrice: 219900, rating: 4.8, reviewCount: 3200, badge: 'Best Seller',
    highlights: ['M3 Pro chip with 11-core CPU and 14-core GPU', '14.2-inch Liquid Retina XDR display with extreme dynamic range', 'Hardware-accelerated ray tracing for next-gen graphics', 'Up to 18 hours battery life for all-day portability'],
    specs: { 'Processor': 'Apple M3 Pro (11-core CPU, 14-core GPU)', 'RAM': '18GB Unified Memory', 'Storage': '512GB NVMe SSD', 'Display': '14.2-inch Liquid Retina XDR (3024x1964), 120Hz', 'Graphics': 'Apple 14-core GPU', 'Battery': 'Up to 18 hours (70Wh)', 'Weight': '1.61 kg', 'OS': 'macOS Sonoma', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple MacBook Air 15-inch (M3 Chip, 16GB Unified Memory, 512GB SSD) - Starlight', brand: 'Apple', price: 144900, originalPrice: 154900, rating: 4.8, reviewCount: 6400, badge: 'Best Seller',
    highlights: ['Strikingly thin design under 11.5mm thin with M3 power', '15.3-inch Liquid Retina display supporting 1 billion colors', 'Silent, fanless design for whisper-quiet operation', 'MagSafe charging with two Thunderbolt ports'],
    specs: { 'Processor': 'Apple M3 (8-core CPU, 10-core GPU)', 'RAM': '16GB Unified Memory', 'Storage': '512GB NVMe SSD', 'Display': '15.3-inch Liquid Retina Display (2880x1864)', 'Graphics': 'Apple 10-core GPU', 'Battery': 'Up to 18 hours (66.5Wh)', 'Weight': '1.51 kg', 'OS': 'macOS Sonoma', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple MacBook Air 13-inch (M2 Chip, 8GB Unified Memory, 256GB SSD) - Midnight', brand: 'Apple', price: 89900, originalPrice: 99900, rating: 4.7, reviewCount: 21500, badge: 'Great Value',
    highlights: ['Redesigned ultra-thin aluminum enclosure in Midnight', 'Apple M2 chip with 8-core CPU and 8-core GPU', '13.6-inch Liquid Retina display with 500 nits brightness', '1080p FaceTime HD camera with three-mic array'],
    specs: { 'Processor': 'Apple M2 (8-core CPU, 8-core GPU)', 'RAM': '8GB Unified Memory', 'Storage': '256GB NVMe SSD', 'Display': '13.6-inch Liquid Retina Display (2560x1664)', 'Graphics': 'Apple 8-core GPU', 'Battery': 'Up to 18 hours (52.6Wh)', 'Weight': '1.24 kg', 'OS': 'macOS Sequoia', 'Warranty': '1 Year Apple Warranty' } },

  // Dell
  { name: 'Dell XPS 16 9640 (Intel Core Ultra 7 155H, 32GB RAM, 1TB SSD, RTX 4060) - Platinum', brand: 'Dell', price: 239990, originalPrice: 269990, rating: 4.7, reviewCount: 1420, badge: 'Top Rated',
    highlights: ['Machined aluminum chassis with zero-lattice keyboard', '16.3-inch 4K+ OLED Touchscreen with Gorilla Glass Victus', 'NVIDIA GeForce RTX 4060 with AI tensor cores', 'Intel Core Ultra 7 with dedicated NPU for Copilot+'],
    specs: { 'Processor': 'Intel Core Ultra 7 155H (16 Cores, 22 Threads)', 'RAM': '32GB LPDDR5x 7467MHz', 'Storage': '1TB PCIe Gen4 NVMe SSD', 'Display': '16.3-inch 4K+ (3840x2400) OLED Touch, 120Hz', 'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6', 'Battery': '99.5Wh, 130W Type-C Adapter', 'Weight': '2.13 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Premium Support' } },
  { name: 'Dell XPS 14 9440 (Intel Core Ultra 7, 16GB RAM, 512GB SSD, Intel Arc) - Graphite', brand: 'Dell', price: 174990, originalPrice: 199990, rating: 4.6, reviewCount: 2100, badge: 'New',
    highlights: ['Sleek 14.5-inch compact form factor with glass touch bar', '3.2K OLED 120Hz display with Dolby Vision', 'Up to 21 hours battery life for productivity on the go', 'Quad-speaker design with Waves MaxxAudio Pro'],
    specs: { 'Processor': 'Intel Core Ultra 7 155H (Up to 4.8 GHz)', 'RAM': '16GB LPDDR5x 7467MHz', 'Storage': '512GB PCIe Gen4 NVMe SSD', 'Display': '14.5-inch 3.2K (3200x2000) InfinityEdge OLED', 'Graphics': 'Intel Arc Graphics', 'Battery': '69.5Wh, 60W Type-C', 'Weight': '1.68 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } },
  { name: 'Dell Inspiron 15 3520 (Intel Core i5-1235U, 16GB RAM, 512GB SSD) - Carbon Black', brand: 'Dell', price: 47990, originalPrice: 59990, rating: 4.3, reviewCount: 16800, badge: 'Best Seller',
    highlights: ['15.6-inch FHD 120Hz Anti-Glare display with narrow bezels', '12th Gen Intel Core i5-1235U 10-core processor', 'Spacious keyboard with numeric keypad and lift hinge', 'ExpressCharge charges up to 80% in 60 minutes'],
    specs: { 'Processor': 'Intel Core i5-1235U (10 Cores, Up to 4.40 GHz)', 'RAM': '16GB DDR4 2666MHz', 'Storage': '512GB M.2 PCIe NVMe SSD', 'Display': '15.6-inch FHD (1920x1080) 120Hz WVA', 'Graphics': 'Intel Iris Xe Graphics', 'Battery': '41Wh, 3-cell', 'Weight': '1.65 kg', 'OS': 'Windows 11 Home + MS Office', 'Warranty': '1 Year Hardware Warranty' } },
  { name: 'Dell Alienware m16 R2 Gaming Laptop (Intel Ultra 7, 16GB, 1TB SSD, RTX 4070)', brand: 'Dell', price: 189990, originalPrice: 219990, rating: 4.7, reviewCount: 1650, badge: 'Top Rated',
    highlights: ['Cryo-tech cooling with dual-intake, quad-exhaust architecture', '16-inch QHD+ 240Hz 3ms display with NVIDIA G-SYNC', 'NVIDIA GeForce RTX 4070 8GB GDDR6 (140W TGP)', 'Stealth Mode key for discreet classroom or coffee shop use'],
    specs: { 'Processor': 'Intel Core Ultra 7 155H (16 Cores)', 'RAM': '16GB DDR5 5600MHz (Up to 64GB)', 'Storage': '1TB PCIe NVMe SSD', 'Display': '16-inch QHD+ (2560x1600) 240Hz, 3ms, 100% sRGB', 'Graphics': 'NVIDIA GeForce RTX 4070 8GB (140W)', 'Battery': '90Wh, 240W Adapter', 'Weight': '2.61 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Premium Support Plus' } },

  // HP
  { name: 'HP OMEN 16 Gaming Laptop (AMD Ryzen 7 7840HS, 16GB RAM, 1TB SSD, RTX 4060) - Shadow Black', brand: 'HP', price: 109990, originalPrice: 129990, rating: 4.6, reviewCount: 4300, badge: 'Best Seller',
    highlights: ['Tempest Cooling technology with IR thermopile sensor', '16.1-inch FHD 165Hz IPS display with 7ms response time', 'NVIDIA GeForce RTX 4060 (8GB GDDR6 dedicated)', '4-zone RGB backlit keyboard with anti-ghosting keys'],
    specs: { 'Processor': 'AMD Ryzen 7 7840HS (8 Cores, 16 Threads, Up to 5.1 GHz)', 'RAM': '16GB DDR5 5600MHz', 'Storage': '1TB PCIe Gen4 NVMe TLC M.2 SSD', 'Display': '16.1-inch FHD (1920x1080) 165Hz IPS, 300 nits', 'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6', 'Battery': '83Wh, 230W Smart AC Adapter', 'Weight': '2.37 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } },
  { name: 'HP Spectre x360 2-in-1 14 (Intel Core Ultra 7, 32GB RAM, 1TB SSD, 2.8K OLED)', brand: 'HP', price: 164990, originalPrice: 189990, rating: 4.8, reviewCount: 1950, badge: 'Top Rated',
    highlights: ['Gem-cut 360-degree convertible design with rechargeable MPP 2.0 tilt pen', '14-inch 2.8K 120Hz IMAX Enhanced OLED touch display', '9MP IR AI camera with auto frame and privacy shutter', 'Audio by Poly Studio with quad speakers'],
    specs: { 'Processor': 'Intel Core Ultra 7 155H', 'RAM': '32GB LPDDR5x 7467MHz', 'Storage': '1TB PCIe Gen4 NVMe M.2 SSD', 'Display': '14-inch 2.8K (2880x1800) OLED 120Hz Touch', 'Graphics': 'Intel Arc Graphics', 'Battery': '68Wh, Up to 13 hours', 'Weight': '1.44 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } },
  { name: 'HP Victus 16 Gaming Laptop (Intel Core i5-13500H, 16GB RAM, 512GB SSD, RTX 3050)', brand: 'HP', price: 64990, originalPrice: 78990, rating: 4.4, reviewCount: 18700, badge: 'Great Value',
    highlights: ['13th Gen Intel Core i5 processor for gaming and multitasking', '16.1-inch FHD 144Hz display with micro-edge bezel', 'OMEN Gaming Hub for system performance optimization', 'Updated thermal design with dual heat pipes'],
    specs: { 'Processor': 'Intel Core i5-13500H (12 Cores, Up to 4.7 GHz)', 'RAM': '16GB DDR5 5200MHz', 'Storage': '512GB PCIe Gen4 NVMe SSD', 'Display': '16.1-inch FHD (1920x1080) 144Hz IPS', 'Graphics': 'NVIDIA GeForce RTX 3050 6GB GDDR6', 'Battery': '70Wh, 200W Adapter', 'Weight': '2.29 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'HP Pavilion 15 (Intel Core i5-1335U, 16GB RAM, 512GB SSD) - Natural Silver', brand: 'HP', price: 54990, originalPrice: 66990, rating: 4.4, reviewCount: 22400, badge: 'Best Seller',
    highlights: ['15.6-inch FHD IPS micro-edge display with flicker-free technology', '13th Gen Intel Core i5 with 10 cores', 'Audio by B&O with dual custom speakers', 'HP Fast Charge: 0 to 50% in approximately 45 minutes'],
    specs: { 'Processor': 'Intel Core i5-1335U (10 Cores, Up to 4.6 GHz)', 'RAM': '16GB DDR4 3200MHz', 'Storage': '512GB PCIe NVMe M.2 SSD', 'Display': '15.6-inch FHD (1920x1080) IPS, 250 nits', 'Graphics': 'Intel Iris Xe Graphics', 'Battery': '41Wh, 65W Smart AC Adapter', 'Weight': '1.75 kg', 'OS': 'Windows 11 Home + Office 2021', 'Warranty': '1 Year Onsite Warranty' } },

  // Lenovo
  { name: 'Lenovo Legion Pro 7i Gen 9 (Intel Core i9-14900HX, 32GB RAM, 1TB SSD, RTX 4080)', brand: 'Lenovo', price: 279990, originalPrice: 319990, rating: 4.9, reviewCount: 1100, badge: 'Top Rated',
    highlights: ['Intel Core i9-14900HX 24-core beast processor', 'NVIDIA GeForce RTX 4080 12GB (175W max TGP)', '16-inch WQXGA 240Hz 500 nits 100% DCI-P3 PureSight Gaming display', 'Legion ColdFront: Vapor chamber cooling with AI tuning'],
    specs: { 'Processor': 'Intel Core i9-14900HX (24 Cores, 32 Threads, Up to 5.8 GHz)', 'RAM': '32GB DDR5 5600MHz (2x 16GB)', 'Storage': '1TB M.2 2280 PCIe Gen4 SSD', 'Display': '16-inch WQXGA (2560x1600) IPS 240Hz, 500 nits, G-SYNC', 'Graphics': 'NVIDIA GeForce RTX 4080 12GB (175W TGP)', 'Battery': '99.9Wh, 330W GaN Adapter', 'Weight': '2.62 kg', 'OS': 'Windows 11 Home', 'Warranty': '3 Years Legion Ultimate Support' } },
  { name: 'Lenovo ThinkPad X1 Carbon Gen 12 (Intel Ultra 7, 32GB RAM, 1TB SSD) - Deep Black', brand: 'Lenovo', price: 214990, originalPrice: 249990, rating: 4.8, reviewCount: 980, badge: 'Top Rated',
    highlights: ['Legendary ThinkPad durability tested against MIL-STD 810H standards', 'Ultralight carbon-fiber body weighing only 1.09 kg', '14-inch 2.8K 120Hz OLED Anti-Glare display with Eyesafe', 'Communications Bar with 8MP MIPI camera with Computer Vision'],
    specs: { 'Processor': 'Intel Core Ultra 7 155H (16 Cores, Up to 4.8 GHz)', 'RAM': '32GB LPDDR5x 7500MHz Soldered', 'Storage': '1TB SSD M.2 2280 PCIe 4.0x4 Performance NVMe', 'Display': '14-inch 2.8K (2880x1800) OLED 120Hz, 400 nits', 'Graphics': 'Intel Arc Graphics', 'Battery': '57Wh, Rapid Charge', 'Weight': '1.09 kg', 'OS': 'Windows 11 Pro', 'Warranty': '3 Years Premier Support' } },
  { name: 'Lenovo LOQ 15 Gaming Laptop (Intel Core i5-12450HX, 16GB RAM, 512GB SSD, RTX 3050)', brand: 'Lenovo', price: 61990, originalPrice: 76990, rating: 4.4, reviewCount: 14200, badge: 'Best Seller',
    highlights: ['Hyperchamber thermal cooling design with dual 85mm fans', '15.6-inch FHD 144Hz 100% sRGB G-SYNC display', 'NVIDIA GeForce RTX 3050 6GB GDDR6 (95W TGP)', 'Lenovo AI Engine+ powered by LA1 AI chip'],
    specs: { 'Processor': 'Intel Core i5-12450HX (8 Cores, Up to 4.4 GHz)', 'RAM': '16GB DDR5 4800MHz', 'Storage': '512GB SSD PCIe Gen4', 'Display': '15.6-inch FHD (1920x1080) IPS 144Hz, 100% sRGB', 'Graphics': 'NVIDIA GeForce RTX 3050 6GB (95W)', 'Battery': '60Wh, 170W Slim Tip', 'Weight': '2.38 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite + 1 Year ADP' } },
  { name: 'Lenovo IdeaPad Slim 3 (AMD Ryzen 5 7520U, 16GB RAM, 512GB SSD) - Arctic Grey', brand: 'Lenovo', price: 36990, originalPrice: 52990, rating: 4.3, reviewCount: 31200, badge: 'Great Value',
    highlights: ['Military-grade rugged durability MIL-STD-810H', '15.6-inch FHD Anti-Glare display with TUV Low Blue Light', 'AMD Ryzen 5 7520U high-efficiency mobile processor', 'Privacy shutter on HD webcam and fingerprint reader'],
    specs: { 'Processor': 'AMD Ryzen 5 7520U (4 Cores, 8 Threads, Up to 4.3 GHz)', 'RAM': '16GB LPDDR5 5500MHz Soldered', 'Storage': '512GB SSD M.2 PCIe Gen4 NVMe', 'Display': '15.6-inch FHD (1920x1080) TN 250 nits Anti-glare', 'Graphics': 'AMD Radeon 610M Graphics', 'Battery': '47Wh, Rapid Charge Boost', 'Weight': '1.62 kg', 'OS': 'Windows 11 Home', 'Warranty': '2 Years Onsite Warranty' } },

  // ASUS
  { name: 'ASUS ROG Zephyrus G16 (2024) (Intel Core Ultra 9, 32GB RAM, 1TB SSD, RTX 4080)', brand: 'ASUS', price: 269990, originalPrice: 299990, rating: 4.9, reviewCount: 890, badge: 'Top Rated',
    highlights: ['CNC-machined aluminum chassis with Slash Lighting array', 'ROG Nebula Display: 16-inch 2.5K 240Hz 0.2ms OLED', 'NVIDIA GeForce RTX 4080 with 115W TGP and MUX Switch', '6-speaker setup with dual force-cancelling woofers'],
    specs: { 'Processor': 'Intel Core Ultra 9 185H (16 Cores, Up to 5.1 GHz)', 'RAM': '32GB LPDDR5X 7467MHz', 'Storage': '1TB PCIe 4.0 NVMe M.2 Performance SSD', 'Display': '16-inch 2.5K (2560x1600) OLED 240Hz 0.2ms', 'Graphics': 'NVIDIA GeForce RTX 4080 12GB GDDR6', 'Battery': '90Wh, 240W Adapter, 100W Type-C PD', 'Weight': '1.85 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Global Warranty' } },
  { name: 'ASUS TUF Gaming F15 (Intel Core i7-13620H, 16GB RAM, 1TB SSD, RTX 4060) - Mecha Gray', brand: 'ASUS', price: 89990, originalPrice: 108990, rating: 4.6, reviewCount: 16800, badge: 'Best Seller',
    highlights: ['Mecha-inspired design meeting MIL-STD-810H standards', '15.6-inch FHD 144Hz G-SYNC with 100% sRGB', 'NVIDIA GeForce RTX 4060 with MUX Switch and NVIDIA Advanced Optimus', 'Arc Flow Fans with 84 curved blades for maximum airflow'],
    specs: { 'Processor': 'Intel Core i7-13620H (10 Cores, Up to 4.9 GHz)', 'RAM': '16GB DDR5 5200MHz (Expandable to 32GB)', 'Storage': '1TB PCIe 4.0 NVMe M.2 SSD', 'Display': '15.6-inch FHD (1920x1080) 144Hz IPS-level', 'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6 (140W)', 'Battery': '90Wh, 240W Adapter', 'Weight': '2.20 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } },
  { name: 'ASUS Zenbook 14 OLED (Intel Core Ultra 7, 16GB RAM, 1TB SSD) - Ponder Blue', brand: 'ASUS', price: 104990, originalPrice: 122990, rating: 4.7, reviewCount: 4100, badge: 'Top Rated',
    highlights: ['Ultra-portable 1.2 kg lightweight all-metal chassis with 14.9mm profile', '14-inch 3K (2880x1800) 120Hz ASUS Lumina OLED display', 'Intel Core Ultra 7 processor with built-in Intel AI Boost NPU', '75Wh battery delivering up to 15+ hours of endurance'],
    specs: { 'Processor': 'Intel Core Ultra 7 155H (16 Cores, Up to 4.8 GHz)', 'RAM': '16GB LPDDR5X 7467MHz', 'Storage': '1TB M.2 NVMe PCIe 4.0 SSD', 'Display': '14-inch 3K (2880x1800) OLED 120Hz, 600 nits', 'Graphics': 'Intel Arc Graphics', 'Battery': '75Wh, 65W Type-C Easy Charge', 'Weight': '1.20 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } },
  { name: 'ASUS Vivobook 16X (Intel Core i5-12450H, 16GB RAM, 512GB SSD) - Cool Silver', brand: 'ASUS', price: 46990, originalPrice: 62990, rating: 4.3, reviewCount: 19500, badge: 'Great Value',
    highlights: ['Large 16-inch WUXGA 16:10 aspect ratio display with 86% screen-to-body ratio', '180-degree lay-flat hinge for easy collaboration', 'IceBlade fan and dual air vents for efficient heat dissipation', 'ErgoSense keyboard for comfortable typing experience'],
    specs: { 'Processor': 'Intel Core i5-12450H (8 Cores, Up to 4.4 GHz)', 'RAM': '16GB DDR4 (8GB onboard + 8GB SO-DIMM)', 'Storage': '512GB M.2 NVMe PCIe 3.0 SSD', 'Display': '16.0-inch WUXGA (1920x1200) 16:10 aspect ratio, 300 nits', 'Graphics': 'Intel UHD Graphics', 'Battery': '50Wh, 65W AC Adapter', 'Weight': '1.88 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } },

  // Acer
  { name: 'Acer Predator Helios 16 Gaming Laptop (Intel i9-14900HX, 32GB RAM, 1TB SSD, RTX 4070)', brand: 'Acer', price: 179990, originalPrice: 209990, rating: 4.7, reviewCount: 1800, badge: 'Top Rated',
    highlights: ['5th Gen AeroBlade 3D metal fans with liquid metal thermal grease', '16-inch WQXGA 240Hz 500 nits Mini LED display', 'NVIDIA GeForce RTX 4070 8GB GDDR6 (140W MGP)', 'Per-key RGB mechanical switch keyboard'],
    specs: { 'Processor': 'Intel Core i9-14900HX (24 Cores, Up to 5.8 GHz)', 'RAM': '32GB DDR5 5600MHz', 'Storage': '1TB PCIe Gen4 NVMe SSD', 'Display': '16-inch WQXGA (2560x1600) Mini LED 240Hz', 'Graphics': 'NVIDIA GeForce RTX 4070 8GB (140W)', 'Battery': '90Wh, 330W Adapter', 'Weight': '2.60 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year International Warranty' } },
  { name: 'Acer Nitro V 15 Gaming Laptop (Intel Core i5-13420H, 16GB RAM, 512GB SSD, RTX 4050)', brand: 'Acer', price: 68990, originalPrice: 84990, rating: 4.5, reviewCount: 15600, badge: 'Best Seller',
    highlights: ['13th Gen Intel Core i5 processor paired with RTX 4050 6GB', '15.6-inch FHD IPS 144Hz high-refresh display', 'Dual-fan cooling system with exhaust vents for intense gaming sessions', 'NitroSense utility app for fan speeds and power mode control'],
    specs: { 'Processor': 'Intel Core i5-13420H (8 Cores, Up to 4.6 GHz)', 'RAM': '16GB DDR5 5200MHz', 'Storage': '512GB PCIe Gen4 NVMe SSD', 'Display': '15.6-inch FHD (1920x1080) 144Hz IPS', 'Graphics': 'NVIDIA GeForce RTX 4050 6GB GDDR6 (75W)', 'Battery': '57Wh, 135W Adapter', 'Weight': '2.10 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } },
  { name: 'Acer Aspire 5 Slim Laptop (Intel Core i5-1335U, 16GB RAM, 512GB SSD) - Steel Gray', brand: 'Acer', price: 44990, originalPrice: 59990, rating: 4.3, reviewCount: 14200, badge: 'Great Value',
    highlights: ['Aluminum top cover with sleek ergonomic hinge design', '15.6-inch FHD Acer ComfyView display with BlueLightShield', 'TwinAir cooling with dual copper thermal pipes', 'Full-size backlit keyboard with multi-gesture touchpad'],
    specs: { 'Processor': 'Intel Core i5-1335U (10 Cores, Up to 4.6 GHz)', 'RAM': '16GB LPDDR5 Dual Channel', 'Storage': '512GB PCIe NVMe SSD', 'Display': '15.6-inch FHD (1920x1080) IPS ComfyView', 'Graphics': 'Intel Iris Xe Graphics', 'Battery': '50Wh, 65W AC Adapter', 'Weight': '1.78 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } },

  // MSI
  { name: 'MSI Katana 15 Gaming Laptop (Intel Core i7-13620H, 16GB RAM, 1TB SSD, RTX 4060)', brand: 'MSI', price: 92990, originalPrice: 114990, rating: 4.5, reviewCount: 4200, badge: 'Best Seller',
    highlights: ['Sharpen your game with blade-like Katana aesthetic', '15.6-inch FHD 144Hz IPS-level gaming panel', 'Cooler Boost 5 with shared-pipe thermal solution', '4-Zone RGB keyboard with highlighted WASD keys'],
    specs: { 'Processor': 'Intel Core i7-13620H (10 Cores, Up to 4.9 GHz)', 'RAM': '16GB DDR5 5200MHz', 'Storage': '1TB NVMe PCIe SSD Gen4x4', 'Display': '15.6-inch FHD (1920x1080) 144Hz IPS', 'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6 (105W)', 'Battery': '53.5Wh, 200W Adapter', 'Weight': '2.25 kg', 'OS': 'Windows 11 Home', 'Warranty': '2 Years Carry-in Warranty' } },
  { name: 'MSI Modern 14 (AMD Ryzen 5 7530U, 16GB RAM, 512GB SSD) - Classic Black', brand: 'MSI', price: 34990, originalPrice: 49990, rating: 4.3, reviewCount: 11300, badge: 'Great Value',
    highlights: ['Ultra-lightweight 1.4 kg chassis designed for students and professionals', '14-inch FHD IPS-level panel with 180-degree flip-n-share design', 'Hi-Res Audio certification with Nahimic 3 software', 'MIL-STD-810G military standard reliability testing'],
    specs: { 'Processor': 'AMD Ryzen 5 7530U (6 Cores, 12 Threads, Up to 4.5 GHz)', 'RAM': '16GB DDR4 3200MHz Onboard', 'Storage': '512GB NVMe PCIe Gen3 SSD', 'Display': '14-inch FHD (1920x1080) 60Hz IPS-Level', 'Graphics': 'AMD Radeon Graphics', 'Battery': '39.3Wh, 65W Adapter', 'Weight': '1.40 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Warranty' } },

  // Microsoft & Samsung
  { name: 'Microsoft Surface Laptop 7 Copilot+ PC (Snapdragon X Elite, 16GB RAM, 512GB SSD) - Platinum', brand: 'Microsoft', price: 139990, originalPrice: 154990, rating: 4.7, reviewCount: 1250, badge: 'New',
    highlights: ['Next-gen AI experiences with Copilot+ and 45 TOPS NPU', '13.8-inch PixelSense Flow touchscreen with 120Hz dynamic refresh', 'Unmatched efficiency with up to 20 hours of battery life', 'Surface Studio Camera with AI-powered Windows Studio Effects'],
    specs: { 'Processor': 'Snapdragon X Elite (12 Cores, 3.4 GHz)', 'RAM': '16GB LPDDR5x', 'Storage': '512GB Removable Gen 4 SSD', 'Display': '13.8-inch PixelSense Flow (2304x1536) Touchscreen, 120Hz', 'Graphics': 'Qualcomm Adreno GPU', 'Battery': '54Wh, Up to 20 hours', 'Weight': '1.34 kg', 'OS': 'Windows 11 Home Copilot+ PC', 'Warranty': '1 Year Limited Hardware Warranty' } },
  { name: 'Samsung Galaxy Book4 Pro 360 (Intel Core Ultra 7, 16GB RAM, 512GB SSD, S Pen) - Moonstone Gray', brand: 'Samsung', price: 159990, originalPrice: 184990, rating: 4.8, reviewCount: 2100, badge: 'Top Rated',
    highlights: ['2-in-1 convertible touchscreen laptop with bundled responsive S Pen', '16-inch 3K Dynamic AMOLED 2X display with anti-reflective glass', 'Galaxy Connected Experience seamlessly pairs with Galaxy phones', 'AKG Quad speakers with Dolby Atmos'],
    specs: { 'Processor': 'Intel Core Ultra 7 155H', 'RAM': '16GB LPDDR5X', 'Storage': '512GB NVMe SSD', 'Display': '16.0-inch 3K (2880x1800) Dynamic AMOLED 2X Touch', 'Graphics': 'Intel Arc Graphics', 'Battery': '76Wh, 65W USB Type-C Adapter', 'Weight': '1.66 kg', 'OS': 'Windows 11 Home', 'Warranty': '1 Year Onsite Warranty' } }
];

console.log(`Laptops prepared: ${rawLaptops.length}`);
