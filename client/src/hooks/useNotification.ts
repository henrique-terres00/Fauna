import { useCallback } from 'react';
import { toast } from 'react-toastify';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  autoClose?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export const useNotification = () => {
  const showNotification = useCallback((
    message: string, 
    type: NotificationType = 'info',
    options: NotificationOptions = {}
  ) => {
    const defaultOptions = {
      autoClose: 3000,
      position: 'top-right' as const,
      ...options
    };

    switch (type) {
      case 'success':
        toast.success(message, defaultOptions);
        break;
      case 'error':
        toast.error(message, defaultOptions);
        break;
      case 'warning':
        toast.warning(message, defaultOptions);
        break;
      default:
        toast.info(message, defaultOptions);
    }
  }, []);

  return { showNotification };
};
