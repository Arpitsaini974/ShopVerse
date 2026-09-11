import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/helpers';
import useUIStore from '../../store/uiStore';

export const Toast = ({ id, type = 'info', message, duration = 3000 }) => {
  const { removeToast } = useUIStore();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(id);
    }, 300);
  };

  const types = {
    success: {
      icon: CheckCircle,
      bg: 'bg-white',
      border: 'border-emerald-500',
      iconColor: 'text-emerald-500',
    },
    error: {
      icon: XCircle,
      bg: 'bg-white',
      border: 'border-rose-500',
      iconColor: 'text-rose-500',
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-white',
      border: 'border-amber-500',
      iconColor: 'text-amber-500',
    },
    info: {
      icon: Info,
      bg: 'bg-white',
      border: 'border-blue-500',
      iconColor: 'text-blue-500',
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start p-4 mb-3 rounded-lg shadow-lg border-l-4 pointer-events-auto transition-all duration-300 transform w-80',
        config.bg,
        config.border,
        isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
    >
      <Icon className={cn('w-5 h-5 mr-3 shrink-0', config.iconColor)} />
      <div className="flex-1 text-sm font-medium text-gray-800 break-words">{message}</div>
      <button
        onClick={handleClose}
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
