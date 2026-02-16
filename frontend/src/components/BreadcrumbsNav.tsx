import React from 'react';
import { Breadcrumbs, Link as MuiLink, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const labelMap: Record<string, string> = {
  '': 'Dashboard',
  dashboard: 'Dashboard',
  parfums: 'Parfums',
  references: 'Références',
  fournisseurs: 'Fournisseurs',
  clients: 'Clients',
  stock: 'Stock',
};

export default function BreadcrumbsNav() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  const crumbs = parts.length ? parts.map((p, idx) => {
    const to = '/' + parts.slice(0, idx + 1).join('/');
    const label = labelMap[p] ?? p;
    const isLast = idx === parts.length - 1;
    return isLast ? (
      <Typography color="text.primary" key={to} sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    ) : (
      <MuiLink
        component={RouterLink}
        to={to}
        underline="hover"
        color="inherit"
        key={to}
      >
        {label}
      </MuiLink>
    );
  }) : [
    <Typography color="text.primary" key="/" sx={{ fontWeight: 600 }}>
      {labelMap['']}
    </Typography>
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs aria-label="breadcrumb">
        {crumbs}
      </Breadcrumbs>
    </Box>
  );
}
