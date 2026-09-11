import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />}
              {isLast || !item.href ? (
                <span className="text-gray-900 font-medium line-clamp-1">{item.label}</span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-primary-600 transition-colors line-clamp-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
