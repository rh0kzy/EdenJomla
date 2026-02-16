import React from 'react';
import { Skeleton, Box } from '@mui/material';

export default function TableSkeleton({ rows = 8, columns = 4 }) {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Skeleton variant="rectangular" height={40} sx={{ mb: 1, borderRadius: 2 }} />
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={32} sx={{ mb: 1, borderRadius: 2 }} />
      ))}
    </Box>
  );
}
