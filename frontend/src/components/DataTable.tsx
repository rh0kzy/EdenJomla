import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, alpha, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  onRowContextMenu?: (event: React.MouseEvent, row: any) => void;
  contextMenuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (row: any) => void;
    disabled?: boolean;
  }>;
}

export default function DataTable({ rows, columns, loading, onRowContextMenu, contextMenuItems }: DataTableProps) {
  const { darkMode } = useAppStore();
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
    row: any;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const rowId = (event.currentTarget as HTMLElement).getAttribute('data-id');
    const row = rows.find(r => r.id.toString() === rowId);
    if (row) {
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        row,
      });
      onRowContextMenu?.(event, row);
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleContextMenuItemClick = (item: any) => {
    item.onClick(contextMenu?.row);
    handleCloseContextMenu();
  };
  
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
          disableRowSelectionOnClick
          onRowClick={(params, event) => {
            if (event.button === 2) { // Right click
              handleContextMenu(event as any);
            }
          }}
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

      {contextMenuItems && contextMenuItems.length > 0 && (
        <Menu
          open={contextMenu !== null}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
          PaperProps={{
            sx: {
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              boxShadow: darkMode
                ? '0 20px 60px rgba(0,0,0,0.5)'
                : '0 20px 60px rgba(0,0,0,0.15)',
            },
          }}
        >
          {contextMenuItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => handleContextMenuItemClick(item)}
              disabled={item.disabled}
              sx={{
                '&:hover': {
                  background: darkMode
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'rgba(79, 70, 229, 0.08)',
                },
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
}
