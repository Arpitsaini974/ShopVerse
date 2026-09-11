export const categories = [
  {
    id: 1,
    name: 'Electronics',
    icon: 'Monitor',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Smartphones', 'Laptops', 'Headphones', 'Televisions', 'Cameras', 'Tablets', 'Gaming', 'Wearables', 'Speakers', 'Monitors', 'Computer Accessories', 'Mobile Accessories', 'Accessories']
  },
  {
    id: 2,
    name: 'Mobiles',
    icon: 'Smartphone',
    slug: 'mobiles',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Smartphones', 'Feature Phones', 'Mobile Accessories', 'Cases & Covers']
  },
  {
    id: 3,
    name: 'Fashion',
    icon: 'Shirt',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    subcategories: ["Men's Clothing", "Women's Clothing", "Men's Footwear", "Women's Footwear", "Men's Accessories", "Women's Accessories"]
  },
  {
    id: 4,
    name: 'Beauty',
    icon: 'Sparkles',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Personal Care']
  },
  {
    id: 5,
    name: 'Home',
    icon: 'Home',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Furniture', 'Home Decor', 'Home Furnishing', 'Kitchen', 'Garden']
  },
  {
    id: 6,
    name: 'Appliances',
    icon: 'Refrigerator',
    slug: 'appliances',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Washing Machines', 'Refrigerators', 'Kitchen Appliances', 'Air Conditioners', 'Air Quality']
  },
  {
    id: 7,
    name: 'Grocery',
    icon: 'ShoppingBasket',
    slug: 'grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Beverages', 'Snacks', 'Staples', 'Personal Care']
  },
  {
    id: 8,
    name: 'Sports',
    icon: 'Dumbbell',
    slug: 'sports',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Cricket', 'Fitness', 'Nutrition', 'Running', 'Cycling']
  },
  {
    id: 9,
    name: 'Toys',
    icon: 'Gamepad2',
    slug: 'toys',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Building Toys', 'Dolls', 'Action Figures', 'Board Games', 'Educational']
  },
  {
    id: 10,
    name: 'Books',
    icon: 'BookOpen',
    slug: 'books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Self-Help', 'Business & Finance', 'Fiction', 'Non-Fiction', 'Academic']
  },
];

export const getCategoryBySlug = (slug) => categories.find(c => c.slug === slug);
export const getCategoryByName = (name) => categories.find(c => c.name === name);
