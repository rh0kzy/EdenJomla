import React from 'react';
import { SnackbarProvider } from 'notistack';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={3000}
      preventDuplicate
      style={{ zIndex: 14000 }}
    >
      {children}
    </SnackbarProvider>
  );
}
