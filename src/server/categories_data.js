const db = require('./db');

// Main Categories definitions
const mainCategories = [
  { id: 1, name: 'Mobiles', slug: 'mobiles', description: 'Latest 5G smartphones, feature phones and mobile accessories', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Electronics', slug: 'electronics', description: 'Laptops, smartwatches, headphones, cameras and smart home devices', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Fashion', slug: 'fashion', description: 'Trendy menswear, womenswear, footwear, watches and accessories', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Appliances', slug: 'appliances', description: 'Energy-efficient refrigerators, washing machines, ACs and kitchen appliances', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'Home', slug: 'home', description: 'Modern furniture, home decor, cookware, bedding and smart lighting', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'Beauty', slug: 'beauty', description: 'Premium skincare, makeup, haircare, fragrances and personal grooming', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80' },
  { id: 7, name: 'Sports', slug: 'sports', description: 'Gym equipment, running shoes, cricket kits, football and cycling gear', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
  { id: 8, name: 'Books', slug: 'books', description: 'Bestselling fiction, self-help, business, competitive exams and children books', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { id: 9, name: 'Toys', slug: 'toys', description: 'LEGO, remote control cars, board games, action figures and educational toys', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80' },
  { id: 10, name: 'Grocery', slug: 'grocery', description: 'Fresh daily essentials, beverages, healthy snacks, staples and packaged food', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
];

// Subcategories with parent category mapping
const subcategories = [
  // Mobiles (Parent ID: 1)
  { id: 101, parent_id: 1, name: 'Smartphones', slug: 'smartphones', description: 'Flagship & budget 5G smartphones' },
  { id: 102, parent_id: 1, name: 'Feature Phones', slug: 'feature-phones', description: 'Reliable long-battery keypad phones' },
  { id: 103, parent_id: 1, name: 'Phone Accessories', slug: 'phone-accessories', description: 'Cases, stands, selfie sticks and cables' },
  { id: 104, parent_id: 1, name: 'Cases & Covers', slug: 'cases-covers', description: 'Protective silicone, rugged and leather phone cases' },
  { id: 105, parent_id: 1, name: 'Chargers', slug: 'chargers', description: 'Fast GaN chargers, adapters & MagSafe pads' },
  { id: 106, parent_id: 1, name: 'Power Banks', slug: 'power-banks', description: '10000mAh to 30000mAh fast-charging portable power banks' },
  { id: 107, parent_id: 1, name: 'Screen Protectors', slug: 'screen-protectors', description: '9H tempered glass and privacy screen guards' },

  // Electronics (Parent ID: 2)
  { id: 201, parent_id: 2, name: 'Laptops', slug: 'laptops', description: 'MacBooks, gaming laptops and ultrabooks' },
  { id: 202, parent_id: 2, name: 'Tablets', slug: 'tablets', description: 'iPads, Android tablets and graphics tablets' },
  { id: 203, parent_id: 2, name: 'Headphones', slug: 'headphones', description: 'Over-ear studio headphones and wireless headsets' },
  { id: 204, parent_id: 2, name: 'Earbuds', slug: 'earbuds', description: 'True wireless stereo earbuds with ANC' },
  { id: 205, parent_id: 2, name: 'Speakers', slug: 'speakers', description: 'Bluetooth portable party speakers and soundbars' },
  { id: 206, parent_id: 2, name: 'Wearables', slug: 'wearables', description: 'Smartwatches and fitness trackers' },
  { id: 207, parent_id: 2, name: 'Cameras', slug: 'cameras', description: 'Mirrorless, DSLR and action cameras' },
  { id: 208, parent_id: 2, name: 'Gaming', slug: 'gaming', description: 'Consoles, controllers and gaming gear' },
  { id: 209, parent_id: 2, name: 'Computer Accessories', slug: 'computer-accessories', description: 'Mechanical keyboards, ergonomic mice and docks' },
  { id: 210, parent_id: 2, name: 'Monitors', slug: 'monitors', description: '4K UHD, OLED gaming and curved productivity monitors' },
  { id: 211, parent_id: 2, name: 'Printers', slug: 'printers', description: 'All-in-one wireless laser and ink-tank printers' },
  { id: 212, parent_id: 2, name: 'Storage Devices', slug: 'storage-devices', description: 'NVMe SSDs, external hard drives and micro SD cards' },
  { id: 213, parent_id: 2, name: 'Televisions', slug: 'televisions', description: '4K UHD OLED & QLED smart TVs' },
  { id: 214, parent_id: 2, name: 'Accessories', slug: 'accessories', description: 'Cables, hubs, SSD enclosures and peripherals' },

  // Fashion (Parent ID: 3)
  { id: 301, parent_id: 3, name: "Men's Clothing", slug: 'mens-clothing', description: 'T-shirts, shirts, denim and trousers' },
  { id: 302, parent_id: 3, name: "Women's Clothing", slug: 'womens-clothing', description: 'Dresses, tops, kurtis and western wear' },
  { id: 303, parent_id: 3, name: 'Kids Clothing', slug: 'kids-clothing', description: 'Comfortable everyday wear for boys and girls' },
  { id: 304, parent_id: 3, name: 'Shoes', slug: 'shoes', description: 'Formal, casual and sports footwear' },
  { id: 305, parent_id: 3, name: 'Sneakers', slug: 'sneakers', description: 'Lifestyle sneakers and running kicks' },
  { id: 306, parent_id: 3, name: 'Bags', slug: 'bags', description: 'Backpacks, laptop bags, handbags and duffels' },
  { id: 307, parent_id: 3, name: 'Watches', slug: 'watches', description: 'Chronograph, analog and luxury timepieces' },
  { id: 308, parent_id: 3, name: 'Fashion Accessories', slug: 'fashion-accessories', description: 'Sunglasses, belts, wallets and caps' },

  // Appliances (Parent ID: 4)
  { id: 401, parent_id: 4, name: 'Refrigerators', slug: 'refrigerators', description: 'Single, double-door and side-by-side inverter fridges' },
  { id: 402, parent_id: 4, name: 'Washing Machines', slug: 'washing-machines', description: 'Front load, top load and washer-dryers' },
  { id: 403, parent_id: 4, name: 'Air Conditioners', slug: 'air-conditioners', description: '1.5 Ton and 2 Ton 5-Star inverter split ACs' },
  { id: 404, parent_id: 4, name: 'Microwave Ovens', slug: 'microwave-ovens', description: 'Convection, grill and solo microwaves' },
  { id: 405, parent_id: 4, name: 'Air Coolers', slug: 'air-coolers', description: 'Desert, personal and tower air coolers' },
  { id: 406, parent_id: 4, name: 'Vacuum Cleaners', slug: 'vacuum-cleaners', description: 'Robotic vacuum cleaners and cordless stick vacuums' },
  { id: 407, parent_id: 4, name: 'Kitchen Appliances', slug: 'kitchen-appliances', description: 'Air fryers, mixer grinders and induction cooktops' },
  { id: 408, parent_id: 4, name: 'Water Purifiers', slug: 'water-purifiers', description: 'RO + UV + Copper water purifiers' },

  // Home (Parent ID: 5)
  { id: 501, parent_id: 5, name: 'Furniture', slug: 'furniture', description: 'Ergonomic office chairs, sofas, beds and coffee tables' },
  { id: 502, parent_id: 5, name: 'Home Decor', slug: 'home-decor', description: 'Wall art, vases, clocks and scented candles' },
  { id: 503, parent_id: 5, name: 'Kitchen', slug: 'kitchen', description: 'Cookware sets, stainless steel bottles and food storage' },
  { id: 504, parent_id: 5, name: 'Bedding', slug: 'bedding', description: 'Memory foam mattresses, bedsheets and pillows' },
  { id: 505, parent_id: 5, name: 'Storage', slug: 'storage', description: 'Wardrobe organizers, shoe racks and storage boxes' },
  { id: 506, parent_id: 5, name: 'Lighting', slug: 'lighting', description: 'Smart RGB bulbs, ambient desk lamps and ceiling lights' },
  { id: 507, parent_id: 5, name: 'Cleaning', slug: 'cleaning', description: 'Mops, brooms and home cleaning gear' },
  { id: 508, parent_id: 5, name: 'Bathroom', slug: 'bathroom', description: 'Bath towels, organizers and shower fittings' },

  // Beauty (Parent ID: 6)
  { id: 601, parent_id: 6, name: 'Skincare', slug: 'skincare', description: 'Serums, sunscreens, moisturizers and cleansers' },
  { id: 602, parent_id: 6, name: 'Haircare', slug: 'haircare', description: 'Shampoos, conditioners, serums and hair masks' },
  { id: 603, parent_id: 6, name: 'Makeup', slug: 'makeup', description: 'Lipsticks, foundations, kajal and eyeliners' },
  { id: 604, parent_id: 6, name: 'Fragrance', slug: 'fragrance', description: 'Eau de Parfum, colognes and body mists' },
  { id: 605, parent_id: 6, name: 'Personal Care', slug: 'personal-care', description: 'Body wash, lotions and oral hygiene' },
  { id: 606, parent_id: 6, name: 'Grooming', slug: 'grooming', description: 'Beard trimmers, shavers and grooming kits' },

  // Sports (Parent ID: 7)
  { id: 701, parent_id: 7, name: 'Fitness', slug: 'fitness', description: 'Adjustable dumbbells, yoga mats, resistance bands' },
  { id: 702, parent_id: 7, name: 'Running', slug: 'running', description: 'Running shoes, hydration packs and trackers' },
  { id: 703, parent_id: 7, name: 'Cricket', slug: 'cricket', description: 'English willow bats, leather balls and kit bags' },
  { id: 704, parent_id: 7, name: 'Football', slug: 'football', description: 'FIFA certified balls, studs and shin guards' },
  { id: 705, parent_id: 7, name: 'Badminton', slug: 'badminton', description: 'Carbon graphite racquets, shuttlecocks and grips' },
  { id: 706, parent_id: 7, name: 'Cycling', slug: 'cycling', description: 'Hybrid geared cycles, helmets and LED lights' },
  { id: 707, parent_id: 7, name: 'Outdoor', slug: 'outdoor', description: 'Camping tents, trekking bags and trekking poles' },
  { id: 708, parent_id: 7, name: 'Sports Accessories', slug: 'sports-accessories', description: 'Wristbands, sports bottles and knee supports' },

  // Books (Parent ID: 8)
  { id: 801, parent_id: 8, name: 'Fiction', slug: 'fiction', description: 'Bestselling mystery, sci-fi and romance novels' },
  { id: 802, parent_id: 8, name: 'Non-Fiction', slug: 'non-fiction', description: 'Biographies, memoirs, history and essays' },
  { id: 803, parent_id: 8, name: 'Academic', slug: 'academic', description: 'Engineering, medical and computer science textbooks' },
  { id: 804, parent_id: 8, name: 'Competitive Exams', slug: 'competitive-exams', description: 'UPSC, GATE, CAT, JEE and NEET preparation guides' },
  { id: 805, parent_id: 8, name: 'Childrens Books', slug: 'childrens-books', description: 'Illustrated fairy tales, learning and story books' },
  { id: 806, parent_id: 8, name: 'Comics', slug: 'comics', description: 'Marvel, DC, Manga and graphic novels' },
  { id: 807, parent_id: 8, name: 'Business', slug: 'business', description: 'Finance, investment, leadership and startup books' },
  { id: 808, parent_id: 8, name: 'Self Improvement', slug: 'self-improvement', description: 'Habit building, mindfulness, psychology and productivity' },

  // Toys (Parent ID: 9)
  { id: 901, parent_id: 9, name: 'Educational Toys', slug: 'educational-toys', description: 'STEM kits, robotics and learning puzzles' },
  { id: 902, parent_id: 9, name: 'Action Figures', slug: 'action-figures', description: 'Superhero and anime collectible figurines' },
  { id: 903, parent_id: 9, name: 'Remote Control', slug: 'remote-control', description: 'RC high-speed cars, monster trucks and drones' },
  { id: 904, parent_id: 9, name: 'Board Games', slug: 'board-games', description: 'Monopoly, Catan, Scrabble and strategy games' },
  { id: 905, parent_id: 9, name: 'Puzzles', slug: 'puzzles', description: '1000-piece jigsaws and 3D architectural puzzles' },
  { id: 906, parent_id: 9, name: 'Dolls', slug: 'dolls', description: 'Barbie doll sets and baby doll accessories' },
  { id: 907, parent_id: 9, name: 'Outdoor Toys', slug: 'outdoor-toys', description: 'Nerf blasters, water guns and scooters' },
  { id: 908, parent_id: 9, name: 'Baby Toys', slug: 'baby-toys', description: 'Rattles, teether toys, musical mats and plushies' },

  // Grocery (Parent ID: 10)
  { id: 1001, parent_id: 10, name: 'Fruits & Vegetables', slug: 'fruits-vegetables', description: 'Fresh organic fruits and vegetables' },
  { id: 1002, parent_id: 10, name: 'Snacks', slug: 'snacks', description: 'Gourmet chips, cookies, roasted nuts and namkeen' },
  { id: 1003, parent_id: 10, name: 'Beverages', slug: 'beverages', description: 'Artisanal coffee, green tea, juices and energy drinks' },
  { id: 1004, parent_id: 10, name: 'Staples', slug: 'staples', description: 'Basmati rice, organic dals, wheat atta and cooking oils' },
  { id: 1005, parent_id: 10, name: 'Dairy', slug: 'dairy', description: 'Cow milk, butter, artisanal cheese, paneer and ghee' },
  { id: 1006, parent_id: 10, name: 'Breakfast', slug: 'breakfast', description: 'Rolled oats, muesli, corn flakes and honey' },
  { id: 1007, parent_id: 10, name: 'Packaged Food', slug: 'packaged-food', description: 'Pasta, noodles, pasta sauces and ready-to-eat meals' },
  { id: 1008, parent_id: 10, name: 'Household Essentials', slug: 'household-essentials', description: 'Detergents, dishwash liquids and surface cleaners' },
];

module.exports = {
  mainCategories,
  subcategories
};
