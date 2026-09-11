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

// Raw Tablets
const rawTablets = [
  { name: 'Apple 11-inch iPad Pro (M4 Chip, 256GB, Wi-Fi) - Space Black', brand: 'Apple', price: 99900, originalPrice: 104900, rating: 4.9, reviewCount: 1420, badge: 'Top Rated',
    highlights: ['Ultra Retina XDR display with tandem OLED technology', 'Apple M4 chip with outrageous performance and next-gen AI', 'Landscape 12MP Ultra Wide front camera with Center Stage', 'Supports Apple Pencil Pro and redesigned Magic Keyboard'],
    specs: { 'Display': '11-inch Ultra Retina XDR OLED (2420x1668), 120Hz', 'Processor': 'Apple M4 (9-core CPU, 10-core GPU)', 'RAM': '8GB', 'Storage': '256GB', 'Battery': '31.29Wh, Up to 10 hours', 'Weight': '444 g', 'OS': 'iPadOS 18', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple 11-inch iPad Air (M2 Chip, 128GB, Wi-Fi) - Blue', brand: 'Apple', price: 59900, originalPrice: 64900, rating: 4.8, reviewCount: 3800, badge: 'Best Seller',
    highlights: ['Incredible Apple M2 chip performance', 'Liquid Retina display with P3 wide color and anti-reflective coating', '12MP Center Stage landscape front camera', 'Superfast Wi-Fi 6E connectivity'],
    specs: { 'Display': '11-inch Liquid Retina Display (2360x1640)', 'Processor': 'Apple M2 (8-core CPU, 9-core GPU)', 'RAM': '8GB', 'Storage': '128GB', 'Battery': '28.93Wh', 'Weight': '462 g', 'OS': 'iPadOS 18', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple 10.9-inch iPad (10th Generation, 64GB, Wi-Fi) - Silver', brand: 'Apple', price: 32900, originalPrice: 34900, rating: 4.7, reviewCount: 14500, badge: 'Great Value',
    highlights: ['All-screen design with 10.9-inch Liquid Retina display', 'A14 Bionic chip with 4-core graphics', 'Touch ID integrated into top button', 'Landscape 12MP Ultra Wide front camera'],
    specs: { 'Display': '10.9-inch Liquid Retina Display', 'Processor': 'A14 Bionic', 'RAM': '4GB', 'Storage': '64GB', 'Battery': '28.6Wh', 'Weight': '477 g', 'OS': 'iPadOS 17 upgradable', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Samsung Galaxy Tab S10 Ultra (14.6-inch Dynamic AMOLED 2X, 256GB, S Pen) - Moonstone Gray', brand: 'Samsung', price: 108999, originalPrice: 121999, rating: 4.8, reviewCount: 980, badge: 'New',
    highlights: ['Expansive 14.6-inch Dynamic AMOLED 2X with anti-reflection coating', 'Galaxy AI for Tablets with Sketch to Image and Circle to Search', 'Bundled IP68 water and dust resistant S Pen', 'Enhanced Armor Aluminum frame with IP68 rating'],
    specs: { 'Display': '14.6-inch Dynamic AMOLED 2X, 120Hz (2960x1848)', 'Processor': 'MediaTek Dimensity 9300+ (4nm)', 'RAM': '12GB', 'Storage': '256GB (microSD up to 1.5TB)', 'Battery': '11200 mAh, 45W Fast Charging', 'Weight': '718 g', 'OS': 'Android 14 (One UI 6.1)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Samsung Galaxy Tab S9 FE (10.9-inch Display, 128GB, S Pen Included) - Mint', brand: 'Samsung', price: 34999, originalPrice: 44999, rating: 4.5, reviewCount: 8600, badge: 'Best Seller',
    highlights: ['Vibrant 10.9-inch 90Hz display with Vision Booster', 'IP68 water and dust resistant tablet and S Pen', 'Long-lasting 8000 mAh battery with dual speakers by AKG', 'Samsung DeX mode for PC-like multitasking experience'],
    specs: { 'Display': '10.9-inch WQXGA 90Hz LCD', 'Processor': 'Exynos 1380', 'RAM': '6GB', 'Storage': '128GB', 'Battery': '8000 mAh, 45W Charging', 'Weight': '523 g', 'OS': 'Android 13 upgradable', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'OnePlus Pad 2 (12.1-inch 3K 144Hz Display, Snapdragon 8 Gen 3, 256GB) - Nimbus Gray', brand: 'OnePlus', price: 42999, originalPrice: 47999, rating: 4.7, reviewCount: 2400, badge: 'Top Rated',
    highlights: ['Flagship Snapdragon 8 Gen 3 chipset in a tablet', '12.1-inch 3K 144Hz ReadFit display with 7:5 ratio', '6 Hi-Res speakers with spatial audio immersion', '9510 mAh battery with 67W SUPERVOOC charging'],
    specs: { 'Display': '12.1-inch 3K (3000x2120) 144Hz IPS, 900 nits', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB LPDDR5X', 'Storage': '256GB UFS 3.1', 'Battery': '9510 mAh, 67W SUPERVOOC', 'Weight': '584 g', 'OS': 'OxygenOS 14.1 for Pad', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Xiaomi Pad 6 (11-inch 2.8K 144Hz, Snapdragon 870, 8GB RAM, 256GB) - Graphite Grey', brand: 'Xiaomi', price: 26999, originalPrice: 39999, rating: 4.6, reviewCount: 28400, badge: 'Great Value',
    highlights: ['Segment-leading 11-inch 2.8K 144Hz 7-stage variable refresh display', 'Qualcomm Snapdragon 870 octa-core flagship processor', 'Quad speakers with Dolby Atmos for cinematic audio', '8840 mAh battery with 33W fast charging'],
    specs: { 'Display': '11-inch 2.8K (2880x1800) 144Hz IPS, Dolby Vision', 'Processor': 'Snapdragon 870 (7nm)', 'RAM': '8GB LPDDR5', 'Storage': '256GB UFS 3.1', 'Battery': '8840 mAh, 33W Fast Charging', 'Weight': '490 g', 'OS': 'Xiaomi HyperOS (Android 14)', 'Warranty': '1 Year Manufacturer Warranty' } },
  { name: 'Lenovo Tab P12 (12.7-inch 3K Display, 8GB RAM, 256GB, Stylus Pen Included) - Storm Grey', brand: 'Lenovo', price: 28999, originalPrice: 38999, rating: 4.4, reviewCount: 6300, badge: 'Best Seller',
    highlights: ['Expansive 12.7-inch 3K LCD display with split-screen multitasking', 'Quad JBL speakers with Dolby Atmos audio tuning', 'MediaTek Dimensity 7050 octa-core processor', 'Lenovo Tab Pen Plus included in the retail box'],
    specs: { 'Display': '12.7-inch 3K (2944x1840) LTPS LCD, 60Hz', 'Processor': 'MediaTek Dimensity 7050', 'RAM': '8GB LPDDR4x', 'Storage': '256GB (microSD up to 1TB)', 'Battery': '10200 mAh, 30W Charging', 'Weight': '615 g', 'OS': 'Android 13', 'Warranty': '1 Year Onsite Warranty' } }
];

// Raw Headphones & Earbuds
const rawHeadphones = [
  { name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones - Black', brand: 'Sony', price: 26990, originalPrice: 34990, rating: 4.8, reviewCount: 16800, badge: 'Best Seller',
    highlights: ['Two processors and 8 microphones for unrivaled active noise cancellation', 'Auto NC Optimizer adjusts canceling based on wearing conditions and environment', 'Specially developed 30mm driver unit for magnificent sound', 'Up to 30 hours battery life with quick charging (3 min for 3 hours)'],
    specs: { 'Driver': '30mm, dome type (CCAW Voice coil)', 'Battery': 'Up to 30 hours (NC ON), 40 hours (NC OFF)', 'Connectivity': 'Bluetooth 5.2, Multipoint, LDAC, 3.5mm Aux', 'Weight': '250 g', 'Warranty': '1 Year Sony India Warranty' } },
  { name: 'Apple AirPods Pro (2nd Generation with USB-C / MagSafe Case)', brand: 'Apple', price: 20990, originalPrice: 24900, rating: 4.8, reviewCount: 38500, badge: 'Top Rated',
    highlights: ['Apple H2 headphone chip for intelligent noise cancellation and 3D sound', 'Up to 2x more Active Noise Cancellation than predecessor', 'Adaptive Audio dynamically blends Transparency mode and Active Noise Cancellation', 'Precision Finding for MagSafe Charging Case (USB-C) with built-in speaker'],
    specs: { 'Chip': 'Apple H2 chip', 'Battery': 'Up to 6 hours (earbuds), up to 30 hours (with case)', 'Connectivity': 'Bluetooth 5.3, USB-C Charging', 'Resistance': 'IP54 dust, sweat, and water resistant', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Bose QuietComfort Ultra Wireless Noise Cancelling Headphones - White Smoke', brand: 'Bose', price: 34900, originalPrice: 39900, rating: 4.8, reviewCount: 4200, badge: 'Top Rated',
    highlights: ['World-class noise cancellation quieter than ever before', 'Breakthrough Bose Immersive Audio pushes spatial sound boundary', 'CustomTune technology automatically tailors sound to your ears', 'Up to 24 hours of battery life on a single charge'],
    specs: { 'Battery': 'Up to 24 hours (up to 18 hours with Immersive Audio)', 'Connectivity': 'Bluetooth 5.3, Multipoint, 3.5mm Aux', 'Weight': '253 g', 'Warranty': '1 Year Bose Warranty' } },
  { name: 'Samsung Galaxy Buds3 Pro (Silver, Hi-Fi 24-bit Audio with Blade Lights)', brand: 'Samsung', price: 17999, originalPrice: 19999, rating: 4.6, reviewCount: 5200, badge: 'New',
    highlights: ['Iconic blade design with interactive Blade Lights', 'Enhanced 2-way speaker with planar tweeter for crystal clear highs', 'Adaptive Noise Control powered by Galaxy AI', 'Real-time Live Interpreter mode with Galaxy smartphone'],
    specs: { 'Audio': '2-way speaker (10.5mm dynamic + 6.1mm planar)', 'Battery': 'Up to 7 hours (ANC off), 30 hours with case', 'Connectivity': 'Bluetooth 5.4, Samsung Seamless Codec 24-bit', 'Resistance': 'IP57 water & dust resistance', 'Warranty': '1 Year Samsung Warranty' } },
  { name: 'JBL Live 770NC Wireless Over-Ear Noise Cancelling Headphones - Blue', brand: 'JBL', price: 10999, originalPrice: 14999, rating: 4.5, reviewCount: 9400, badge: 'Best Seller',
    highlights: ['True Adaptive Noise Cancelling with Smart Ambient technology', 'JBL Signature Sound with deep bass and 40mm drivers', 'Up to 65 hours battery life (50 hours with BT+ANC on)', 'Personi-Fi 2.0 personalized audio hearing profile test'],
    specs: { 'Driver': '40mm Dynamic Drivers', 'Battery': 'Up to 65 hours (ANC off), 50 hours (ANC on)', 'Connectivity': 'Bluetooth 5.3 with LE Audio, Multi-point', 'Weight': '256 g', 'Warranty': '1 Year JBL India Warranty' } },
  { name: 'OnePlus Buds Pro 3 (Midnight Opus, Co-created with Dynaudio, 50dB ANC)', brand: 'OnePlus', price: 11999, originalPrice: 13999, rating: 4.7, reviewCount: 6800, badge: 'Top Rated',
    highlights: ['Dual drivers (11mm woofer + 6mm planar tweeter) tuned by Dynaudio', 'Industry-leading 50dB Smart Adaptive Noise Cancellation', 'LHDC 5.0 24-bit/192kHz hi-res wireless streaming', 'Up to 43 hours total playtime with fast flash charging'],
    specs: { 'Drivers': '11mm Woofer + 6mm Tweeter dual unit', 'Battery': 'Up to 10h (buds), up to 43h (with case)', 'Connectivity': 'Bluetooth 5.4, Google Fast Pair, LHDC 5.0', 'Resistance': 'IP55 rated', 'Warranty': '1 Year OnePlus Warranty' } },
  { name: 'Nothing Ear (White, Hi-Res Ceramic Driver, Smart ANC, ChatGPT Integration)', brand: 'Nothing', price: 10999, originalPrice: 14999, rating: 4.6, reviewCount: 8900, badge: 'New',
    highlights: ['Custom 11mm ceramic driver for richer highs and crisp acoustics', 'Smart Active Noise Cancellation up to 45dB with auto-adaptive profile', 'Direct ChatGPT voice integration via pinch-to-speak', 'LHDC 5.0 and LDAC certified hi-res audio streaming'],
    specs: { 'Driver': '11mm Custom Ceramic driver', 'Battery': 'Up to 8.5 hours (buds), 40.5 hours (with case)', 'Connectivity': 'Bluetooth 5.3, Dual connection', 'Resistance': 'IP54 buds / IP55 case', 'Warranty': '1 Year Nothing Warranty' } },
  { name: 'boAt Airdopes 141 True Wireless Earbuds (Cider Cyan, 42H Playtime, ENx Tech)', brand: 'boAt', price: 1199, originalPrice: 4490, rating: 4.2, reviewCount: 94000, badge: 'Best Seller',
    highlights: ['Up to 42 hours total playback time with ASAP Charge (5 min for 75 min)', 'ENx Environmental Noise Cancellation technology for clear calls', '8mm dynamic audio drivers with signature boAt bass', 'BEAST Mode with 80ms low latency for casual mobile gaming'],
    specs: { 'Driver': '8mm dynamic drivers', 'Battery': '42 hours total playback', 'Connectivity': 'Bluetooth 5.1, Insta Wake N Pair', 'Resistance': 'IPX4 sweat resistant', 'Warranty': '1 Year boAt Warranty' } },
  { name: 'Sony WF-1000XM5 Truly Wireless Noise Canceling Earbuds - Silver', brand: 'Sony', price: 21990, originalPrice: 29990, rating: 4.7, reviewCount: 4600, badge: 'Top Rated',
    highlights: ['Integrated Processor V2 and HD Noise Canceling Processor QN2e', 'Dynamic Driver X for wide frequency reproduction and deep bass', 'Bone conduction sensors and AI noise reduction for crystal clear calls', 'Multipoint connection, Speak-to-Chat, and wireless Qi charging'],
    specs: { 'Driver': '8.4mm Dynamic Driver X', 'Battery': '8 hours (buds) + 16 hours (case) with ANC on', 'Connectivity': 'Bluetooth 5.3, LDAC, Hi-Res Audio Wireless', 'Resistance': 'IPX4 water resistant', 'Warranty': '1 Year Sony Warranty' } },
  { name: 'Apple AirPods 4 with Active Noise Cancellation - White', brand: 'Apple', price: 17900, originalPrice: 17900, rating: 4.7, reviewCount: 8200, badge: 'New',
    highlights: ['First open-ear design AirPods with Active Noise Cancellation', 'Powered by H2 chip with Voice Isolation and personalized Spatial Audio', 'Redesigned charging case with built-in speaker and USB-C', 'Up to 30 hours listening time with the case'],
    specs: { 'Chip': 'Apple H2 chip', 'Battery': 'Up to 5 hours (buds), up to 30 hours (case)', 'Connectivity': 'Bluetooth 5.3, USB-C & Apple Watch charger support', 'Resistance': 'IP54 dust, sweat, and water resistant', 'Warranty': '1 Year Apple Warranty' } }
];

// Raw Smartwatches
const rawSmartwatches = [
  { name: 'Apple Watch Series 10 (GPS, 46mm) - Jet Black Aluminum Case with Black Sport Band', brand: 'Apple', price: 46900, originalPrice: 49900, rating: 4.8, reviewCount: 4100, badge: 'New',
    highlights: ['Thinnest Apple Watch ever with Apple\\\'s biggest display yet', 'Wide-angle OLED display with up to 40% brighter off-axis viewing', 'Sleep apnea notifications and depth gauge with water temperature sensor', 'Faster charging: 0-80% in about 30 minutes'],
    specs: { 'Display': '46mm Wide-angle OLED, 2000 nits', 'Processor': 'Apple S10 SiP with 4-core Neural Engine', 'Sensors': 'ECG, Blood Oxygen, Temperature, Depth gauge', 'Battery': '18 hours normal, 36 hours Low Power', 'Resistance': '50m water resistant, WR50', 'OS': 'watchOS 11', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm) - Titanium Case with Black Ocean Band', brand: 'Apple', price: 89900, originalPrice: 89900, rating: 4.9, reviewCount: 2200, badge: 'Top Rated',
    highlights: ['Rugged aerospace-grade 49mm titanium case with sapphire front crystal', 'Brilliant 3000 nits display with modular Ultra watch face', 'Precision dual-frequency GPS with compass waypoints and backtrack', 'Up to 36 hours regular use and 72 hours in low power mode'],
    specs: { 'Display': '49mm Always-On Retina OLED, 3000 nits', 'Processor': 'Apple S9 SiP', 'Connectivity': 'GPS + Cellular, LTE, Ultra Wideband gen 2', 'Battery': 'Up to 36 hours (72h low power)', 'Resistance': '100m water resistant, MIL-STD 810H', 'OS': 'watchOS 11', 'Warranty': '1 Year Apple Warranty' } },
  { name: 'Samsung Galaxy Watch7 (44mm, Bluetooth) - Green', brand: 'Samsung', price: 29999, originalPrice: 32999, rating: 4.7, reviewCount: 3800, badge: 'New',
    highlights: ['Powered by 3nm processor for swift performance and power efficiency', 'Advanced BioActive sensor for heart rate, ECG, and body composition', 'Galaxy AI wellness insights with Energy Score and Personalized HR Zones', 'Dual-frequency GPS (L1+L5) for accurate route tracking'],
    specs: { 'Display': '1.5-inch Super AMOLED (480x480), Sapphire Crystal', 'Processor': 'Exynos W1000 (3nm)', 'RAM': '2GB', 'Storage': '32GB', 'Battery': '425 mAh, WPC wireless charging', 'Resistance': '5ATM + IP68 / MIL-STD-810H', 'OS': 'Wear OS Powered by Samsung (One UI 6 Watch)', 'Warranty': '1 Year Samsung Warranty' } },
  { name: 'Google Pixel Watch 3 (45mm, Matte Black Aluminum Case with Obsidian Band)', brand: 'Google Pixel', price: 39999, originalPrice: 43999, rating: 4.6, reviewCount: 1950, badge: 'New',
    highlights: ['Actua 45mm display with double the peak brightness at 2000 nits', 'Comprehensive Fitbit tracking with Daily Readiness and Cardio Load', 'Loss of Pulse detection can automatically call emergency services', '24 hours of battery with always-on display, up to 36h in saver mode'],
    specs: { 'Display': '1.4-inch AMOLED LTPO (45mm), 2000 nits', 'Processor': 'Snapdragon W5 Gen 1', 'RAM': '2GB SDRAM', 'Storage': '32GB eMMC', 'Battery': '420 mAh', 'Resistance': '5 ATM, IP68', 'OS': 'Wear OS 5.0', 'Warranty': '1 Year Google Warranty' } },
  { name: 'OnePlus Watch 2 (Radiant Steel, 1.43-inch AMOLED, 100H Battery Life, Wear OS)', brand: 'OnePlus', price: 21999, originalPrice: 27999, rating: 4.6, reviewCount: 5400, badge: 'Best Seller',
    highlights: ['Dual-Engine Architecture: Snapdragon W5 + BES2700 chipsets', 'Up to 100 hours battery life in Smart Mode with Wear OS 4', 'Stainless steel chassis with 2.5D sapphire crystal glass face', 'Dual-frequency GPS (L1+L5) with comprehensive sports tracking'],
    specs: { 'Display': '1.43-inch AMOLED 60Hz, 1000 nits HBM', 'Processor': 'Snapdragon W5 Gen 1 + BES2700', 'RAM': '2GB', 'Storage': '32GB', 'Battery': '500 mAh, 7.5W VOOC Fast Charge', 'Resistance': '5ATM, IP68, MIL-STD-810H', 'OS': 'Wear OS 4 + RTOS', 'Warranty': '1 Year OnePlus Warranty' } },
  { name: 'Noise ColorFit Pro 5 Max (1.96-inch AMOLED Display, BT Calling, Elite Edition) - Jet Black', brand: 'Noise', price: 3999, originalPrice: 9999, rating: 4.3, reviewCount: 42100, badge: 'Best Seller',
    highlights: ['1.96-inch AMOLED display with Post-training VO2 Max metrics', 'Rapid health monitoring: HR, SpO2, Sleep, and Stress measurement', 'Tru Sync Bluetooth calling with quick dial pad and contact saving', 'Up to 7 days battery backup with emergency SOS support'],
    specs: { 'Display': '1.96-inch AMOLED (410x502)', 'Battery': 'Up to 7 days standby', 'Connectivity': 'Bluetooth 5.3', 'Resistance': 'IP68 water resistant', 'Warranty': '1 Year Noise India Warranty' } },
  { name: 'boAt Wave Sigma 3 Smart Watch (2.01-inch HD Display, DIY Watch Faces) - Active Black', brand: 'boAt', price: 1499, originalPrice: 7999, rating: 4.1, reviewCount: 52000, badge: 'Great Value',
    highlights: ['Large 2.01-inch HD display with 550 nits peak brightness', 'Bluetooth calling with dialpad and built-in speaker and mic', 'Over 700+ active sports modes with Crest App health ecosystem', 'Turn-by-turn navigation assist synced via smartphone'],
    specs: { 'Display': '2.01-inch HD Display (240x296)', 'Battery': 'Up to 5 days', 'Connectivity': 'Bluetooth 5.2', 'Resistance': 'IP67 water resistance', 'Warranty': '1 Year boAt Warranty' } },
  { name: 'Amazfit GTR 4 Smart Watch (1.43-inch AMOLED, Dual-Band GPS, 14-Day Battery) - Superspeed Black', brand: 'Amazfit', price: 16999, originalPrice: 23999, rating: 4.6, reviewCount: 14200, badge: 'Top Rated',
    highlights: ['Dual-band circularly-polarized GPS antenna for 99% accuracy', '1.43-inch HD AMOLED display with anti-glare glass bezel', 'BioTracker 4.0 PPG biometric sensor for 24H health monitoring', '14 days ultra-long battery life with Bluetooth phone calls'],
    specs: { 'Display': '1.43-inch AMOLED (466x466), 326 ppi', 'Battery': '475 mAh, up to 14 days typical use', 'Sensors': 'BioTracker 4.0, 6-axis acceleration, Gyro', 'Resistance': '5 ATM water resistance', 'OS': 'Zepp OS 2.0', 'Warranty': '1 Year Amazfit Warranty' } }
];

// Raw Televisions
const rawTVs = [
  { name: 'Sony Bravia 55-inch 4K Ultra HD Smart LED Google TV (KD-55X74L) - Black', brand: 'Sony', price: 54990, originalPrice: 99900, rating: 4.7, reviewCount: 18400, badge: 'Best Seller',
    highlights: ['X1 4K Processor delivers life-like color and contrast enhancement', 'Live Color technology with 4K X-Reality PRO upscaling', 'Open Baffle Speaker with Dolby Audio for punchy bass', 'Google TV with Voice Search and Apple AirPlay 2 support'],
    specs: { 'Display': '55-inch 4K Ultra HD (3840x2160), 60Hz', 'Processor': 'X1 4K Processor', 'Audio': '20 Watts, Dolby Audio', 'Ports': '3 HDMI, 2 USB, Ethernet', 'OS': 'Google TV', 'Warranty': '1 Year Sony Comprehensive Warranty' } },
  { name: 'Samsung 55-inch Crystal 4K Vivid Pro Ultra HD Smart TV (UA55DUE77AKXXL)', brand: 'Samsung', price: 44990, originalPrice: 68900, rating: 4.5, reviewCount: 26100, badge: 'Top Rated',
    highlights: ['Crystal Processor 4K with PurColor for realistic pictures', 'Q-Symphony seamlessly syncs TV and soundbar speakers together', 'SolarCell Remote powered by indoor lighting, eliminating batteries', 'Samsung Knox Security protects PINs, passwords, and IoT devices'],
    specs: { 'Display': '55-inch 4K UHD (3840x2160), 50Hz', 'Processor': 'Crystal Processor 4K', 'Audio': '20W 2CH with Q-Symphony', 'Ports': '3 HDMI, 1 USB, LAN, Wi-Fi', 'OS': 'Tizen OS', 'Warranty': '1 Year Comprehensive + 1 Year Panel Warranty' } },
  { name: 'LG 55-inch 4K Ultra HD Smart OLED TV (OLED55C4PTA) - Eclipse Gray', brand: 'LG', price: 129990, originalPrice: 189990, rating: 4.9, reviewCount: 3200, badge: 'Top Rated',
    highlights: ['Alpha 9 AI Processor Gen7 for peak OLED brightness and processing', 'Self-lit OLED pixels with infinite contrast and 100% color fidelity', '0.1ms response time with 144Hz refresh rate, G-SYNC, and FreeSync', 'Dolby Vision and Dolby Atmos with Filmmaker Mode'],
    specs: { 'Display': '55-inch 4K OLED (3840x2160), 144Hz native', 'Processor': 'Alpha 9 AI Processor 4K Gen7', 'Audio': '40W 2.2 Channel, Dolby Atmos', 'Ports': '4 HDMI 2.1 (4K 144Hz), 3 USB', 'OS': 'webOS 24 with 4 OS upgrades guaranteed', 'Warranty': '3 Years LG Warranty' } },
  { name: 'TCL 55-inch Metallic Bezel-Less 4K Ultra HD Smart QLED Google TV (55T6G)', brand: 'TCL', price: 34990, originalPrice: 77990, rating: 4.4, reviewCount: 14700, badge: 'Great Value',
    highlights: ['Quantum Dot technology reproducing over a billion color shades', 'AiPQ Engine 3.0 processing real-time content optimization', 'Dolby Vision and HDR10+ with MEMC motion smoothing', 'ONKYO 2.1 Hi-Fi audio system with integrated subwoofer'],
    specs: { 'Display': '55-inch 4K QLED (3840x2160), 60Hz', 'Audio': '30W ONKYO Audio with Dolby Atmos', 'Ports': '3 HDMI 2.1, 1 USB, Optical', 'OS': 'Google TV', 'Warranty': '2 Years Comprehensive Warranty' } },
  { name: 'Xiaomi 55-inch X Pro 4K Dolby Vision Smart Google TV (L55M8-A2IN)', brand: 'Xiaomi', price: 36999, originalPrice: 49999, rating: 4.4, reviewCount: 19800, badge: 'Best Seller',
    highlights: ['4K Dolby Vision IQ with Vivid Picture Engine 2 technology', 'Premium metallic bezel-less design with 96.6% screen-to-body ratio', '30W sound output with Dolby Audio and DTS-X', 'Google TV with PatchWall UI integration and voice control'],
    specs: { 'Display': '55-inch 4K UHD, 60Hz, Dolby Vision IQ', 'RAM': '2GB', 'Storage': '16GB', 'Audio': '30W Box Speakers, Dolby Audio', 'Ports': '3 HDMI, 2 USB, Dual Band Wi-Fi', 'OS': 'Google TV + PatchWall', 'Warranty': '1 Year Xiaomi Warranty' } },
  { name: 'OnePlus 55-inch Q Series 4K QLED Smart Google TV (55 Q2 Pro)', brand: 'OnePlus', price: 64999, originalPrice: 99999, rating: 4.6, reviewCount: 4800, badge: 'Top Rated',
    highlights: ['120Hz refresh rate QLED display with 1200 nits peak brightness', 'Integrated 70W Horizon Soundbar tuned with Dynaudio', 'Gamma Engine Ultra with 120 local dimming zones', 'NFC Cast on smart remote for instant phone mirror'],
    specs: { 'Display': '55-inch 4K QLED, 120Hz, 120 Dimming Zones', 'Audio': '70W 2.1CH with Subwoofer, Dynaudio', 'Ports': '3 HDMI (eARC), 2 USB 3.0', 'OS': 'Google TV', 'Warranty': '1 Year OnePlus Warranty' } }
];

// Raw Cameras
const rawCameras = [
  { name: 'Canon EOS R50 Mirrorless Camera with RF-S 18-45mm IS STM Lens Kit - Black', brand: 'Canon', price: 54990, originalPrice: 64995, rating: 4.7, reviewCount: 5600, badge: 'Best Seller',
    highlights: ['24.2 Megapixel APS-C CMOS sensor with DIGIC X processor', 'Dual Pixel CMOS AF II covers 100% area with subject detection (people/animals/vehicles)', 'Uncropped 6K oversampled 4K 30p video recording', 'Compact, lightweight body weighing only 375g with Vari-angle touchscreen'],
    specs: { 'Sensor': '24.2MP APS-C CMOS Sensor', 'Lens': 'RF-S 18-45mm f/4.5-6.3 IS STM', 'ISO': '100-32000 (Expandable to 51200)', 'Video': '4K 30p, FHD 120p', 'Weight': '375 g', 'Warranty': '2 Years Canon India Warranty' } },
  { name: 'Sony Alpha ILCE-7M4 Full-Frame Hybrid Camera (Body Only) - Black', brand: 'Sony', price: 209990, originalPrice: 242990, rating: 4.9, reviewCount: 1450, badge: 'Top Rated',
    highlights: ['33MP full-frame Exmor R back-illuminated CMOS image sensor', 'BIONZ XR processor with up to 8x processing power', 'Real-time Eye AF for Humans, Animals, and Birds in photo and 4K 60p movie', '759 phase-detection AF points covering approx. 94% of the image area'],
    specs: { 'Sensor': '33.0MP Full-Frame Exmor R CMOS', 'Mount': 'Sony E-mount', 'Stabilization': '5-axis in-body optical image stabilization', 'Video': '4K 60p 10-bit 4:2:2, S-Cinetone', 'Weight': '658 g', 'Warranty': '2+1 Years Sony Warranty' } },
  { name: 'Sony ZV-E10 Mirrorless Vlog Camera with 16-50mm Power Zoom Lens - Black', brand: 'Sony', price: 61990, originalPrice: 69990, rating: 4.6, reviewCount: 12100, badge: 'Best Seller',
    highlights: ['Large 24.2MP APS-C sensor optimized for creators and vloggers', 'Directional 3-capsule mic with bundled windscreen included', 'Product Showcase setting for instant product focus switches in video', 'Vari-angle side-opening LCD screen for easy self-shooting'],
    specs: { 'Sensor': '24.2MP APS-C Exmor CMOS', 'Lens': '16-50mm f/3.5-5.6 OSS Power Zoom', 'Video': '4K HDR (HLG), Slow & Quick motion', 'Weight': '343 g', 'Warranty': '2 Years Sony Warranty' } },
  { name: 'Nikon Z50 II Mirrorless Camera Kit with NIKKOR Z DX 16-50mm VR Lens', brand: 'Nikon', price: 79990, originalPrice: 89990, rating: 4.6, reviewCount: 2300, badge: 'New',
    highlights: ['EXPEED 7 image processor with advanced deep learning subject detection', 'Dedicated Picture Control button for cinematic film presets on the go', '5.6K oversampled 4K 60p video with N-Log support', 'Bright electronic viewfinder and versatile Vari-angle monitor'],
    specs: { 'Sensor': '20.9MP DX-format CMOS Sensor', 'Processor': 'EXPEED 7', 'Lens': 'NIKKOR Z DX 16-50mm f/3.5-6.3 VR', 'Video': '4K UHD 60p, Product Review Mode', 'Weight': '495 g', 'Warranty': '2 Years Nikon Warranty' } },
  { name: 'GoPro HERO13 Black Action Camera (5.3K Video, HyperSmooth 6.0, Waterproof 10m)', brand: 'GoPro', price: 38990, originalPrice: 44990, rating: 4.7, reviewCount: 8900, badge: 'Best Seller',
    highlights: ['Best-in-class 5.3K60 and 4K120 video with Emmy-winning HyperSmooth 6.0', 'HB-Series Lens compatibility with auto-detection for Ultra Wide and Macro', 'Redesigned Enduro 1900 mAh battery delivers longer runtimes in all conditions', 'Rugged and waterproof down to 33ft (10m) straight out of the box'],
    specs: { 'Resolution': '27.6MP photos, 5.3K 60fps video', 'Stabilization': 'HyperSmooth 6.0 with 360 Horizon Lock', 'Battery': '1900 mAh Enduro Battery', 'Waterproof': '10m (33ft) without housing', 'Warranty': '1 Year GoPro Official Warranty' } },
  { name: 'Fujifilm X-T5 Mirrorless Camera Body - Silver', brand: 'Fujifilm', price: 154999, originalPrice: 169999, rating: 4.8, reviewCount: 1600, badge: 'Top Rated',
    highlights: ['Fifth-generation 40.2 Megapixel X-Trans CMOS 5 HR sensor', '7.0 stops of 5-axis In-Body Image Stabilization (IBIS)', 'Classic dial-based manual exposure control for intuitive operation', '19 iconic Film Simulation modes including Nostalgic Neg and Classic Chrome'],
    specs: { 'Sensor': '40.2MP X-Trans CMOS 5 HR', 'Processor': 'X-Processor 5', 'Stabilization': '5-axis IBIS up to 7.0 stops', 'Video': '6.2K 30p 4:2:2 10-bit', 'Weight': '557 g', 'Warranty': '2 Years Fujifilm Warranty' } }
];

// Raw Accessories
const rawAccessories = [
  { name: 'Logitech MX Master 3S Wireless Performance Mouse (8K DPI, Quiet Clicks) - Graphite', brand: 'Logitech', category: 'Electronics', subcategory: 'Accessories', price: 8495, originalPrice: 10995, rating: 4.8, reviewCount: 28400, badge: 'Best Seller',
    highlights: ['8000 DPI track-on-glass optical sensor', 'Quiet Clicks technology with 90% less click noise', 'MagSpeed electromagnetic scroll wheel scrolls 1000 lines in a second', 'Multi-device and multi-OS pairing across up to 3 computers'],
    specs: { 'DPI': '200 to 8000 DPI', 'Connectivity': 'Bluetooth Low Energy & Logi Bolt USB', 'Battery': 'Up to 70 days, USB-C recharge', 'Warranty': '1 Year Logitech Warranty' } },
  { name: 'Keychron K2 Pro QMK/VIA Wireless Custom Mechanical Keyboard (Brown Switch) - RGB', brand: 'Keychron', category: 'Electronics', subcategory: 'Accessories', price: 8999, originalPrice: 11999, rating: 4.7, reviewCount: 4200, badge: 'Top Rated',
    highlights: ['QMK/VIA programmable keys and macros support', 'Hot-swappable PCB allows switch changing without soldering', 'Double-shot OSA PBT keycaps with Mac and Windows layout support', 'Connects up to 3 devices via Bluetooth 5.1 or wired Type-C'],
    specs: { 'Layout': '75% Layout (84 keys)', 'Switches': 'Keychron K Pro Brown Mechanical', 'Connectivity': 'Bluetooth 5.1 & Type-C Wired', 'Battery': '4000 mAh rechargeable', 'Warranty': '1 Year Keychron Warranty' } },
  { name: 'Samsung T7 Shield 1TB Portable SSD (Up to 1050 MB/s, IP65 Rugged) - Black', brand: 'Samsung', category: 'Electronics', subcategory: 'Accessories', price: 9499, originalPrice: 14999, rating: 4.8, reviewCount: 16200, badge: 'Best Seller',
    highlights: ['Blazing fast read speeds up to 1050 MB/s via USB 3.2 Gen 2', 'Tough rubber exterior protects against drops up to 3 meters', 'IP65 rated water and dust resistance for field photographers and editors', 'Password protection with AES 256-bit hardware encryption'],
    specs: { 'Capacity': '1TB', 'Interface': 'USB 3.2 Gen 2 (10Gbps)', 'Speed': 'Sequential Read up to 1050 MB/s, Write up to 1000 MB/s', 'Weight': '98 g', 'Warranty': '3 Years Limited Warranty' } },
  { name: 'Anker 737 Power Bank (PowerCore 24K, 140W Fast Output with Smart Digital Display)', brand: 'Anker', category: 'Electronics', subcategory: 'Accessories', price: 11999, originalPrice: 15999, rating: 4.8, reviewCount: 3800, badge: 'Top Rated',
    highlights: ['Ultra-powerful 140W two-way fast charging with Power Delivery 3.1', '24,000 mAh capacity charges iPhone 15 almost 5 times or MacBook Air once', 'Smart interactive digital display shows output/input power and estimated recharge time', 'ActiveShield 2.0 temperature monitoring safeguards connected devices'],
    specs: { 'Capacity': '24,000 mAh', 'Output': '140W Max across 2 USB-C + 1 USB-A', 'Display': 'Full-color smart digital screen', 'Weight': '630 g', 'Warranty': '18 Months Anker Warranty' } },
  { name: 'Anker 67W 3-Port GaN Fast Wall Charger (2x USB-C, 1x USB-A) - Black', brand: 'Anker', category: 'Electronics', subcategory: 'Accessories', price: 2999, originalPrice: 4499, rating: 4.7, reviewCount: 12600, badge: 'Best Seller',
    highlights: ['GaNPrime technology for smaller size and cooler high-speed charging', '67W max output charges MacBook, iPad, and iPhone simultaneously', 'Dynamic Power Distribution automatically allocates wattage to devices', 'Compact foldable plug design for travel ease'],
    specs: { 'Total Wattage': '67W Max', 'Ports': '2x USB-C + 1x USB-A', 'Technology': 'Gallium Nitride (GaN)', 'Warranty': '18 Months Anker Warranty' } },
  { name: 'SanDisk Extreme 128GB microSDXC UHS-I Memory Card (190MB/s, 4K UHD, A2, V30)', brand: 'SanDisk', category: 'Electronics', subcategory: 'Accessories', price: 1499, originalPrice: 2800, rating: 4.6, reviewCount: 68000, badge: 'Best Seller',
    highlights: ['Up to 190MB/s read speeds powered by SanDisk QuickFlow technology', 'A2 rated for faster app loading and smartphone performance', '4K UHD ready with UHS Speed Class 3 (U3) and Video Speed Class 30 (V30)', 'Temperature-proof, waterproof, shockproof, and x-ray proof'],
    specs: { 'Capacity': '128GB', 'Read Speed': 'Up to 190MB/s', 'Class': 'Class 10, U3, V30, A2', 'Warranty': 'Lifetime Limited Warranty' } },
  { name: 'Wildcraft 35L Laptop Backpack with Rain Cover - Melange Grey', brand: 'Wildcraft', category: 'Electronics', subcategory: 'Accessories', price: 1799, originalPrice: 3499, rating: 4.4, reviewCount: 31200, badge: 'Great Value',
    highlights: ['Dedicated padded sleeve fits laptops up to 16 inches', '3 spacious multi-level compartments with organizer pockets', 'Ergonomic air-mesh padded back panel and shoulder straps', 'Integrated waterproof rain cover in bottom zippered pocket'],
    specs: { 'Capacity': '35 Liters', 'Material': 'Durable water-repellent polyester', 'Laptop Compatibility': 'Up to 16-inch laptops', 'Warranty': '5 Years International Warranty' } },
  { name: 'Razer DeathAdder Essential Gaming Mouse (6400 DPI, Mechanical Switches) - Black', brand: 'Razer', category: 'Electronics', subcategory: 'Accessories', price: 1299, originalPrice: 2499, rating: 4.5, reviewCount: 42100, badge: 'Best Seller',
    highlights: ['Ergonomic form factor trusted by top esports athletes worldwide', '6400 DPI optical sensor for swift and precise swipes', '5 Hyperesponse buttons independently programmable via Razer Synapse', 'Multi-award winning Razer mechanical switches rated for 10M clicks'],
    specs: { 'DPI': '6400 DPI Optical', 'Buttons': '5 Programmable', 'Cable': '1.8m Braided cable', 'Weight': '96 g', 'Warranty': '2 Years Razer Warranty' } }
];

console.log('Categories data appended.');

// Assemble all categories into standard product schema
const allCombined = [
  ...rawSmartphones.map((p, idx) => ({ ...p, category: 'Mobiles', subcategory: 'Smartphones', imageIndex: idx % IMAGES.smartphones.length, imagePool: IMAGES.smartphones })),
  ...rawLaptops.map((p, idx) => ({ ...p, category: 'Electronics', subcategory: 'Laptops', imageIndex: idx % IMAGES.laptops.length, imagePool: IMAGES.laptops })),
  ...rawTablets.map((p, idx) => ({ ...p, category: 'Electronics', subcategory: 'Tablets', imageIndex: idx % IMAGES.tablets.length, imagePool: IMAGES.tablets })),
  ...rawHeadphones.map((p, idx) => ({ ...p, category: 'Electronics', subcategory: 'Headphones', imageIndex: idx % IMAGES.headphones.length, imagePool: IMAGES.headphones })),
  ...rawSmartwatches.map((p, idx) => ({ ...p, category: 'Electronics', subcategory: 'Wearables', imageIndex: idx % IMAGES.smartwatches.length, imagePool: IMAGES.smartwatches })),
  ...rawTVs.map((p, idx) => ({ ...p, category: 'Electronics', subcategory: 'Televisions', imageIndex: idx % IMAGES.tvs.length, imagePool: IMAGES.tvs })),
  ...rawCameras.map((p, idx) => ({ ...p, category: 'Electronics', subcategory: 'Cameras', imageIndex: idx % IMAGES.cameras.length, imagePool: IMAGES.cameras })),
  ...rawAccessories.map((p, idx) => ({ ...p, imageIndex: idx % IMAGES.accessories.length, imagePool: IMAGES.accessories })),
  // Fashion items
  { name: 'Nike Air Max 270 Running Shoes for Men - Triple Black', brand: 'Nike', category: 'Fashion', subcategory: 'Footwear', price: 9995, originalPrice: 13995, rating: 4.6, reviewCount: 18400, badge: 'Best Seller',
    highlights: ['Max Air 270 unit delivers unrivaled all-day comfort', 'Engineered mesh upper for breathability and flexible structure', 'Dual-density foam sole cushions every step', 'Asymmetrical lacing for secure fit'],
    specs: { 'Upper Material': 'Breathable Engineered Mesh', 'Sole': 'Air 270 Rubber Sole', 'Type': 'Running / Lifestyle Sneakers', 'Warranty': '6 Months Nike Warranty' },
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'], colors: ['Black', 'White', 'Blue'], imagePool: IMAGES.fashion, imageIndex: 1 },
  { name: 'Levi\'s 511 Slim Fit Men\'s Stretch Jeans - Dark Indigo Wash', brand: 'Levi\'s', category: 'Fashion', subcategory: 'Clothing', price: 2399, originalPrice: 3999, rating: 4.4, reviewCount: 28900, badge: 'Best Seller',
    highlights: ['Classic 511 Slim Fit cut with room to move', 'Premium stretch denim fabric for all-day flexibility', 'Signature 5-pocket styling with leather patch on back waist', 'Machine washable with reinforced stitching'],
    specs: { 'Material': '98% Cotton, 2% Elastane', 'Fit': 'Slim Fit', 'Rise': 'Mid Rise', 'Closure': 'Zip Fly with Button' },
    sizes: ['30', '32', '34', '36'], colors: ['Dark Indigo', 'Light Wash', 'Black'], imagePool: IMAGES.fashion, imageIndex: 4 },
  { name: 'Ray-Ban Wayfarer Classic Polarized Sunglasses (RB2140) - Black', brand: 'Ray-Ban', category: 'Fashion', subcategory: 'Accessories', price: 8990, originalPrice: 11590, rating: 4.7, reviewCount: 9200, badge: 'Top Rated',
    highlights: ['Timeless iconic Wayfarer silhouette since 1952', 'G-15 green polarized lenses eliminate 99% of reflective glare', 'Acetate frame with silver rivet accents', '100% UV400 protection for your eyes'],
    specs: { 'Frame Material': 'Hypoallergenic Acetate', 'Lens Type': 'Polarized Crystal Glass', 'Bridge': '22 mm', 'Temple': '150 mm', 'Warranty': '2 Years Luxottica Warranty' },
    imagePool: IMAGES.fashion, imageIndex: 3 },
  { name: 'Dyson V12 Detect Slim Total Clean Cordless Vacuum Cleaner', brand: 'Dyson', category: 'Appliances', subcategory: 'Home Appliances', price: 47900, originalPrice: 55900, rating: 4.8, reviewCount: 3400, badge: 'Top Rated',
    highlights: ['Laser reveals microscopic dust on hard floors', 'Piezo sensor continuously sizes and counts dust particles', 'Up to 60 minutes of run time with click-in battery', 'Hair screw tool picks up long hair and pet hair without tangling'],
    specs: { 'Suction Power': '150 AW', 'Bin Volume': '0.35 Liters', 'Weight': '2.2 kg', 'Run Time': 'Up to 60 minutes', 'Warranty': '2 Years Dyson Official Warranty' },
    imagePool: IMAGES.home, imageIndex: 0 },
  { name: 'IKEA Poäng Armchair with Cushion - Birch Veneer / Knisa Light Beige', brand: 'IKEA', category: 'Home', subcategory: 'Furniture', price: 6990, originalPrice: 8990, rating: 4.6, reviewCount: 14800, badge: 'Best Seller',
    highlights: ['Layer-glued bent birch frame provides relaxing, resilient comfort', 'High back offers great support for your neck and spine', 'Removable and machine washable cushion cover', '10-year everyday quality guarantee by IKEA'],
    specs: { 'Frame': 'Layer-glued wood veneer, Birch', 'Fabric': '100% Polyester', 'Dimensions': '68x82x100 cm', 'Max Load': '170 kg', 'Warranty': '10 Years IKEA Warranty' },
    imagePool: IMAGES.home, imageIndex: 0 },
  { name: 'Philips Multi-Groomer All-in-One Trimmer Series 7000 (14-in-1 Kit)', brand: 'Philips', category: 'Beauty', subcategory: 'Grooming', price: 3499, originalPrice: 4995, rating: 4.5, reviewCount: 42100, badge: 'Best Seller',
    highlights: ['DualCut self-sharpening stainless steel blades for maximum precision', '14 quality grooming tools for face, hair, and body grooming', 'Showerproof for convenient use in the shower and easy cleaning', 'Up to 120 minutes of cordless run time per 1-hour charge'],
    specs: { 'Blades': 'Self-sharpening Stainless Steel', 'Battery': 'Lithium-ion, 120 min run time', 'Charging': '1 Hour Full Charge, 5 min Quick Charge', 'Warranty': '2+1 Years Philips Warranty' },
    imagePool: IMAGES.beauty, imageIndex: 0 },
  { name: 'Yonex Astrox 99 Pro Badminton Racket (Made in Japan) - Cherry Sunburst', brand: 'Yonex', category: 'Sports', subcategory: 'Racquets', price: 14990, originalPrice: 19990, rating: 4.8, reviewCount: 2900, badge: 'Top Rated',
    highlights: ['Rotational Generator System for steep, powerful smashes', 'Namd graphite produces rapid frame snapback', 'Extra Slim Shaft cuts through air resistance', 'Played by World Champion Viktor Axelsen'],
    specs: { 'Flex': 'Stiff', 'Frame': 'HM Graphite + Namd + Volume Cut Resin', 'Weight / Grip': '4U (Avg. 83g) G5', 'Stringing Advice': '20-28 lbs', 'Origin': 'Made in Japan', 'Warranty': '1 Year Yonex Warranty' },
    imagePool: IMAGES.sports, imageIndex: 0 },
  { name: 'Atomic Habits by James Clear (Hardcover International Edition)', brand: 'Penguin', category: 'Books', subcategory: 'Self-Help', price: 499, originalPrice: 799, rating: 4.9, reviewCount: 89000, badge: 'Best Seller',
    highlights: ['Over 15 million copies sold worldwide', 'An easy and proven way to build good habits and break bad ones', 'Tiny changes that lead to remarkable, life-altering results', 'Practical strategies backed by biology and neuroscience'],
    specs: { 'Author': 'James Clear', 'Publisher': 'Random House Business', 'Language': 'English', 'Format': 'Hardcover (320 pages)', 'ISBN': '978-1847941831' },
    imagePool: IMAGES.books, imageIndex: 0 }
];

console.log('Total base products:', allCombined.length);

const fullProductList = allCombined.map((p, index) => {
  const id = index + 1;
  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  const primaryImg = p.imagePool[p.imageIndex];
  const secondaryImg = p.imagePool[(p.imageIndex + 1) % p.imagePool.length];
  const tertiaryImg = p.imagePool[(p.imageIndex + 2) % p.imagePool.length];

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
    inStock: id !== 7 && id !== 24, // only 2 out of stock
    seller: p.brand === 'Apple' ? 'Apple Authorized Reseller' : (p.brand === 'Samsung' ? 'Samsung Official Store' : 'ShopVerse Prime Retail'),
    description: `Genuine ${p.name} from ${p.brand}. Enjoy official manufacturer warranty, blazing fast delivery, and hassle-free 7-day returns on ShopVerse.`,
    highlights: p.highlights || ['100% Genuine Brand Product', 'Official Manufacturer Warranty', 'Fast & Secure Delivery'],
    specifications: p.specs || { 'Brand': p.brand, 'Category': p.category, 'Condition': 'Brand New' },
    warranty: p.specs?.Warranty || '1 Year Manufacturer Warranty',
    emi: p.price > 10000 ? `No Cost EMI starts at ₹${Math.round(p.price / 12)}/month` : null,
    offers: [
      'Bank Offer: Flat ₹1,500 Instant Discount on HDFC & ICICI Credit Cards',
      'Special Price: Extra discount applied at checkout',
      'No Cost EMI available on major credit cards'
    ],
    sizes: p.sizes,
    colors: p.colors
  };
});

const fileContent = `export const products = ${JSON.stringify(fullProductList, null, 2)};

export const getProductById = (id) => products.find(p => p.id === parseInt(id));

export const getProductsByCategory = (category) => products.filter(p => p.category === category);

export const getProductsBySubcategory = (subcategory) => products.filter(p => p.subcategory === subcategory);

export const searchProducts = (query) => {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
};

export const getProductsByIds = (ids) => products.filter(p => ids.includes(p.id));

export const getBrands = () => [...new Set(products.map(p => p.brand))];

export const getPriceRange = () => {
  const prices = products.map(p => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};
`;

const targetPath = path.join(__dirname, '..', 'src', 'data', 'products.js');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log(`SUCCESS: Written ${fullProductList.length} products to ${targetPath}`);
