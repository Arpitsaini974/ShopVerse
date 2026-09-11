import React from 'react';
import { Truck, RefreshCw, Shield, Headphones } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Free Delivery',
    subtitle: 'Orders over ₹500',
    color: 'text-indigo-600'
  },
  {
    icon: RefreshCw,
    title: '7-Day Returns',
    subtitle: 'No questions asked',
    color: 'text-emerald-600'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    subtitle: '100% encrypted',
    color: 'text-amber-600'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    subtitle: 'Dedicated helpdesk',
    color: 'text-rose-600'
  }
];

export const TrustBadges = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center pt-4 md:pt-0 ${index > 0 ? 'md:px-4' : 'md:pr-4'} ${index === 2 ? 'pt-4 md:pt-0' : ''}`}
            >
              <div className={`p-3 rounded-full bg-gray-50 mb-3 ${badge.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">{badge.title}</h4>
              <p className="text-xs sm:text-sm text-gray-500">{badge.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
