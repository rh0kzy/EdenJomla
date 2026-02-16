import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

export interface ErrorFeedbackProps {
  error: string | null;
  onClose?: () => void;
}

export default function ErrorFeedback({ error, onClose }: ErrorFeedbackProps) {
  if (!error) return null;
  return (
    <Alert severity="error" onClose={onClose} sx={{ mb: 2, borderRadius: 2 }}>
      <AlertTitle>Erreur</AlertTitle>
      {error}
    </Alert>
  );
}
