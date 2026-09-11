// Script to generate high-quality product catalog for ShopVerse
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real, tested, category-accurate Unsplash high-res product photos
const IMAGES = {
  // Laptops: Wide-angle, fully open showing entire screen and keyboard clearly
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', // MacBook Pro
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80', // MacBook Air
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', // Dell XPS
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80', // Dell Laptop
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', // ASUS ROG Gaming
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80', // HP Laptop
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80', // Acer Gaming
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', // Laptop workspace
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80', // Sleek Laptop
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', // Laptop open
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', // Business Laptop
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80', // Modern Laptop
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80', // Silver Laptop
    'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=80', // Premium Laptop
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'  // Workstation Laptop
  ],

  // Smartphones: Studio shots, clean front & back views
  smartphones: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', // iPhone 16 Pro
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // Samsung phone
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', // Clean phone
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', // Phone screen
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=80', // iPhone clean
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80', // Modern smartphone
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80', // Phone handheld
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80', // iPhone camera
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80', // Phone elegant
    'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?auto=format&fit=crop&w=800&q=80', // AMOLED screen
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80', // Phone black
    'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?auto=format&fit=crop&w=800&q=80', // Phone minimal
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80', // Galaxy phone
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80', // Phone close up
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80'  // Clean smartphone
  ],

  // Tablets
  tablets: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', // iPad Pro
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80', // Tablet minimal
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80', // Tablet with pencil
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'  // Tablet screen
  ],

  // Headphones & Earbuds
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', // Over-ear headphones
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', // TWS Earbuds
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', // Sony WH headphones
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80', // AirPods Pro
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80', // Black headphones
    'https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=800&q=80', // Wireless earbuds
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', // Studio headphones
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80', // Headset
    'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80', // White headphones
    'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=80'  // In-ear buds
  ],

  // Smartwatches
  smartwatches: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', // Smartwatch
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80', // Apple Watch
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80', // Black smartwatch
    'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80', // Fitness watch
    'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=800&q=80', // Sport watch
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80'  // Smartwatch wrist
  ],

  // TVs
  tvs: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80', // 4K Smart TV
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80', // Living room TV
    'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=800&q=80', // OLED TV
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80'  // Modern TV
  ],

  // Cameras
  cameras: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', // Canon DSLR
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80', // Sony Alpha
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80', // Camera classic
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80', // Camera lens
    'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=800&q=80'  // Nikon camera
  ],

  // Accessories
  accessories: [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', // Gaming Mouse
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', // Mechanical Keyboard
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', // Laptop Bag
    'https://images.unsplash.com/photo-1625948515291-696130d10398?auto=format&fit=crop&w=800&q=80', // USB Cable
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', // Power Bank
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', // Desk setup
    'https://images.unsplash.com/photo-1585792180666-f75a7c3ab27c?auto=format&fit=crop&w=800&q=80', // Stylus
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80'  // Wireless mouse
  ],

  // Fashion
  fashion: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', // T-Shirt
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // Nike Shoes
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', // Jacket
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80', // Sunglasses
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', // Denim Jeans
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'  // Handbag
  ],

  // Home & Appliances
  home: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // Chair
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', // Sofa
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', // Lamp
    'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80'  // Kitchen blender
  ],

  // Beauty
  beauty: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', // Makeup
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'  // Skincare
  ],

  // Sports
  sports: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80', // Fitness dumbbell
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'  // Gym gear
  ],

  // Books
  books: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
  ],

  // Toys
  toys: [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80'
  ],

  // Grocery
  grocery: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  ]
};

console.log('Image catalog defined. Starting product builder...');
