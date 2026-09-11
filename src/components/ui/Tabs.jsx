import React, { useState } from 'react';
import { cn } from '../../utils/helpers';

export const Tabs = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : null));

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-8 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none',
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="py-6">
        {tabs.map((tab) => (
          <div key={tab.id} className={cn(activeTab === tab.id ? 'block' : 'hidden')}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
