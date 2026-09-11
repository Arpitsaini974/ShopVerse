import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] bg-white rounded-lg shadow-sm border border-gray-100">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          {description}
        </p>
      )}
      {(actionLabel && (actionLink || onAction)) && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="primary">{actionLabel}</Button>
          </Link>
        ) : (
          <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
};
