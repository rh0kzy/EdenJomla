import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import {
  Star as StarIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Opacity as ParfumIcon,
  Inventory as ReferenceIcon,
  LocalShipping as SupplierIcon,
  People as ClientIcon,
  Storage as StockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import FavoritesManager from './FavoritesManager';

interface FavoriteItem {
  id: string;
  type: 'page' | 'action';
  label: string;
  icon: string;
  path?: string;
  action?: () => void;
  color: string;
}

const iconMap: Record<string, any> = {
  Dashboard: DashboardIcon,
  Opacity: ParfumIcon,
  Inventory: ReferenceIcon,
  LocalShipping: SupplierIcon,
  People: ClientIcon,
  Storage: StockIcon,
};

export default function FavoritesBar() {
  const navigate = useNavigate();
  const { darkMode } = useAppStore();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [showManager, setShowManager] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('user-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        setFavorites([]);
      }
    }

    // Show welcome dialog for first-time users
    const hasSeenWelcome = localStorage.getItem('has-seen-favorites-welcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem('has-seen-favorites-welcome', 'true');
    }
  }, []);

  const handleFavoriteClick = (favorite: FavoriteItem) => {
    if (favorite.path) {
      navigate(favorite.path);
    } else if (favorite.action) {
      favorite.action();
    }
  };

  const handleFavoritesChange = (newFavorites: FavoriteItem[]) => {
    setFavorites(newFavorites);
  };

  const IconComponent = (iconName: string) => {
    const Icon = iconMap[iconName] || StarIcon;
    return Icon;
  };

  if (favorites.length === 0) {
    return (
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            borderRadius: 2,
            background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            border: '1px dashed',
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        >
          <Button
            onClick={() => setShowManager(true)}
            startIcon={<StarIcon />}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              },
            }}
          >
            Personnaliser vos raccourcis favoris
          </Button>
        </Box>

        <FavoritesManager
          open={showManager}
          onClose={() => setShowManager(false)}
          onFavoritesChange={handleFavoritesChange}
        />

        <Dialog
          open={showWelcome}
          onClose={() => setShowWelcome(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}>
            🎉 Bienvenue dans Parfum Depot!
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Découvrez la nouvelle fonctionnalité des raccourcis favoris !
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Personnalisez votre barre de favoris pour accéder rapidement à vos pages et actions préférées.
              Cliquez sur l'étoile pour commencer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowWelcome(false)} variant="contained">
              Commencer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderRadius: 2,
          background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          border: '1px solid',
          borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        }}
      >
        <Chip
          icon={<StarIcon />}
          label="Favoris"
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        />

        <Stack direction="row" spacing={1} sx={{ flex: 1, overflowX: 'auto' }}>
          {favorites.map((favorite) => {
            const Icon = IconComponent(favorite.icon);
            return (
              <Tooltip key={favorite.id} title={favorite.label}>
                <IconButton
                  onClick={() => handleFavoriteClick(favorite)}
                  sx={{
                    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: '1px solid',
                    borderColor: favorite.color + '40',
                    '&:hover': {
                      background: favorite.color + '20',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Icon sx={{ color: favorite.color }} />
                </IconButton>
              </Tooltip>
            );
          })}
        </Stack>

        <Tooltip title="Gérer les favoris">
          <IconButton
            onClick={() => setShowManager(true)}
            size="small"
            sx={{
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              '&:hover': {
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
              },
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <FavoritesManager
        open={showManager}
        onClose={() => setShowManager(false)}
        onFavoritesChange={handleFavoritesChange}
      />
    </Box>
  );
}