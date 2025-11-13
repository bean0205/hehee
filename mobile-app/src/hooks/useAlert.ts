import { useState, useCallback } from 'react';
import { AlertType } from '../components/common/Alert';

interface AlertOptions {
  type?: AlertType;
  title: string;
  message: string;
  primaryButton?: {
    text: string;
    onPress: () => void;
  };
  secondaryButton?: {
    text: string;
    onPress: () => void;
  };
  showCloseButton?: boolean;
}

export const useAlert = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertOptions>({
    type: 'info',
    title: '',
    message: '',
    showCloseButton: true,
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertConfig({
      ...options,
      showCloseButton: options.showCloseButton ?? true,
    });
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
  }, []);

  // Helper methods for common alert types
  const showSuccess = useCallback((title: string, message: string, onOk?: () => void) => {
    showAlert({
      type: 'success',
      title,
      message,
      primaryButton: {
        text: 'Tuyệt vời!',
        onPress: onOk || (() => {}),
      },
    });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, onOk?: () => void) => {
    showAlert({
      type: 'error',
      title,
      message,
      primaryButton: {
        text: 'Thử lại',
        onPress: onOk || (() => {}),
      },
    });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    showAlert({
      type: 'warning',
      title,
      message,
      primaryButton: onConfirm ? {
        text: 'Xác nhận',
        onPress: onConfirm,
      } : undefined,
      secondaryButton: onCancel ? {
        text: 'Hủy',
        onPress: onCancel,
      } : undefined,
    });
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string, onOk?: () => void) => {
    showAlert({
      type: 'info',
      title,
      message,
      primaryButton: {
        text: 'Đã hiểu',
        onPress: onOk || (() => {}),
      },
    });
  }, [showAlert]);

  const confirm = useCallback((title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    showAlert({
      type: 'warning',
      title,
      message,
      primaryButton: {
        text: 'Đồng ý',
        onPress: onConfirm,
      },
      secondaryButton: {
        text: 'Hủy',
        onPress: onCancel || (() => {}),
      },
    });
  }, [showAlert]);

  return {
    alertVisible,
    alertConfig,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirm,
  };
};
