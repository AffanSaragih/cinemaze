import React, { createContext, useContext } from 'react';
import { useToastStore } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';
import styles from './ToastProvider.module.scss';

interface ToastContextProps {
  showToast: (message: string, duration?: number) => void;
}
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toasts, showToast, removeToast } = useToastStore();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastRoot}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
