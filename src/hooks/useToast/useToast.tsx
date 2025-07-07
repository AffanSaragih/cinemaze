import { create } from 'zustand';

type Toast = {
  id: number;
  message: string;
  duration?: number;
};

type ToastStore = {
  toasts: Toast[];
  showToast: (message: string, duration?: number) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, duration };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
