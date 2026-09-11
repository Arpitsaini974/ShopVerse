import React from 'react';
import { Link } from 'react-router-dom';

const offers = [
  {
    id: 1,
    title: 'Up to 50% off Electronics',
    subtitle: 'Top deals on latest gadgets',
    bgClass: 'bg-gradient-to-br from-blue-500 to-indigo-700',
    link: '/products?category=Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    title: 'Fashion Clearance',
    subtitle: 'Extra 20% off on clothing',
    bgClass: 'bg-gradient-to-br from-pink-500 to-rose-600',
    link: '/products?category=Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    title: 'Home Upgrades',
    subtitle: 'Decor & Furniture deals',
    bgClass: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    link: '/products?category=Home',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    hiddenMobile: true
  }
];

export const SpecialOffers = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <div 
          key={offer.id} 
          className={`relative overflow-hidden rounded-xl h-48 sm:h-56 group ${offer.hiddenMobile ? 'hidden lg:block' : ''}`}
        >
          <div className={`absolute inset-0 opacity-90 ${offer.bgClass} z-10`} />
          <img 
            src={offer.image} 
            alt={offer.title} 
            className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="relative z-20 h-full p-6 flex flex-col justify-center text-white">
            <h3 className="text-2xl font-bold mb-2 drop-shadow-md">{offer.title}</h3>
            <p className="text-sm font-medium opacity-90 mb-4 drop-shadow">{offer.subtitle}</p>
            <div>
              <Link 
                to={offer.link} 
                className="inline-block px-5 py-2 bg-white text-gray-900 text-sm font-semibold rounded-md hover:bg-gray-100 transition-colors shadow-lg"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
