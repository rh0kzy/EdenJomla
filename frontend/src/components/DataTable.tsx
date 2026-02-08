import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, alpha } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
}

export default function DataTable({ rows, columns, loading }: DataTableProps) {
  const { darkMode } = useAppStore();
  
  return (
    <Box sx={{ height: 'auto', minHeight: 400, width: '100%' }}>
      <Paper 
        elevation={0}
        sx={{ 
          height: 'auto',
          minHeight: 400,
          p: 2,
          background: darkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow: darkMode
            ? '0 20px 60px rgba(0,0,0,0.3)'
            : '0 20px 60px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: darkMode
              ? '0 25px 70px rgba(0,0,0,0.4)'
              : '0 25px 70px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pagination={false}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              py: 1.5,
            },
            '& .MuiDataGrid-columnHeaders': {
              background: darkMode
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
              borderRadius: 2,
              borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              fontWeight: 600,
              fontSize: '0.95rem',
            },
            '& .MuiDataGrid-row': {
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: darkMode
                  ? alpha('#6366f1', 0.08)
                  : alpha('#4f46e5', 0.04),
                transform: 'scale(1.001)',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
              background: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
              borderRadius: 2,
              mt: 1,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
