import React from 'react';
import { Toast } from './Toast';
import useUIStore from '../../store/uiStore';

const ToastContainer = () => {
  const toasts = useUIStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
