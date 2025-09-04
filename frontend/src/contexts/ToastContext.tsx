import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor, autoHideDuration?: number) => void;
  showError: (message: string, autoHideDuration?: number) => void;
  showSuccess: (message: string, autoHideDuration?: number) => void;
  showWarning: (message: string, autoHideDuration?: number) => void;
  showInfo: (message: string, autoHideDuration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000,
  });

  const showToast = (
    message: string, 
    severity: AlertColor = 'info', 
    autoHideDuration: number = 6000
  ) => {
    setToast({
      open: true,
      message,
      severity,
      autoHideDuration,
    });
  };

  const showError = (message: string, autoHideDuration: number = 8000) => {
    showToast(message, 'error', autoHideDuration);
  };

  const showSuccess = (message: string, autoHideDuration: number = 4000) => {
    showToast(message, 'success', autoHideDuration);
  };

  const showWarning = (message: string, autoHideDuration: number = 6000) => {
    showToast(message, 'warning', autoHideDuration);
  };

  const showInfo = (message: string, autoHideDuration: number = 6000) => {
    showToast(message, 'info', autoHideDuration);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const contextValue: ToastContextType = {
    showToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.autoHideDuration}
        onClose={hideToast}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};