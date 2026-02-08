import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Fade,
  Chip,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  LocalShipping as SupplierIcon,
  Opacity as ParfumIcon,
  Storage as StockIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';

import ParfumsPage from './pages/ParfumsPage';
import StockPage from './pages/StockPage';
import FournisseursPage from './pages/FournisseursPage';
import ClientsPage from './pages/ClientsPage';
import ReferencesPage from './pages/ReferencesPage';

const drawerWidth = 240;

import { useAppStore } from './store/useAppStore';

// ... (rest of imports)

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Parfums', icon: <ParfumIcon />, path: '/parfums', color: '#ec4899' },
    { text: 'Références', icon: <InventoryIcon />, path: '/references', color: '#8b5cf6' },
    { text: 'Fournisseurs', icon: <SupplierIcon />, path: '/fournisseurs', color: '#f59e0b' },
    { text: 'Clients', icon: <PeopleIcon />, path: '/clients', color: '#10b981' },
    { text: 'Stock', icon: <StockIcon />, path: '/stock', color: '#3b82f6' },
  ];

  const drawer = (
    <div>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            width: 48, 
            height: 48,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}
        >
          <ParfumIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Parfum Depot
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Gestion de Stock
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mx: 2, opacity: 0.1 }} />
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/parfums');
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: '60%',
                    background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}99 100%)`,
                    borderRadius: '0 4px 4px 0',
                  } : {},
                }}
              >
                <ListItemIcon sx={{ color: isActive ? item.color : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: darkMode 
                  ? 'linear-gradient(135deg, #f472b6 0%, #c084fc 100%)'
                  : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {menuItems.find(item => location.pathname === item.path || (location.pathname === '/' && item.path === '/parfums'))?.text || 'Dashboard'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6, display: { xs: 'none', sm: 'block' } }}>
              Gérez votre inventaire facilement
            </Typography>
          </Box>
          <IconButton 
            onClick={toggleDarkMode}
            sx={{
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
              }
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 }, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: darkMode 
            ? 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.03) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.03) 0%, transparent 50%)'
            : 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.03) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.03) 0%, transparent 50%)',
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Fade in={true} timeout={500}>
          <Box>
            <Routes>
              <Route path="/parfums" element={<ParfumsPage />} />
              <Route path="/references" element={<ReferencesPage />} />
              <Route path="/fournisseurs" element={<FournisseursPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/stock" element={<StockPage />} />
              <Route path="/" element={<ParfumsPage />} />
            </Routes>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}
