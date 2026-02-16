import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Edit as EditIcon,
  Dashboard as DashboardIcon,
  Opacity as ParfumIcon,
  Inventory as ReferenceIcon,
  LocalShipping as SupplierIcon,
  People as ClientIcon,
  Storage as StockIcon
} from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';

interface FavoriteItem {
  id: string;
  type: 'page' | 'action';
  label: string;
  icon: string;
  path?: string;
  action?: () => void;
  color: string;
}

const availableItems: FavoriteItem[] = [
  {
    id: 'dashboard',
    type: 'page',
    label: 'Dashboard',
    icon: 'Dashboard',
    path: '/dashboard',
    color: '#6366f1'
  },
  {
    id: 'parfums',
    type: 'page',
    label: 'Parfums',
    icon: 'Opacity',
    path: '/parfums',
    color: '#ec4899'
  },
  {
    id: 'references',
    type: 'page',
    label: 'Références',
    icon: 'Inventory',
    path: '/references',
    color: '#8b5cf6'
  },
  {
    id: 'fournisseurs',
    type: 'page',
    label: 'Fournisseurs',
    icon: 'LocalShipping',
    path: '/fournisseurs',
    color: '#f59e0b'
  },
  {
    id: 'clients',
    type: 'page',
    label: 'Clients',
    icon: 'People',
    path: '/clients',
    color: '#10b981'
  },
  {
    id: 'stock',
    type: 'page',
    label: 'Stock',
    icon: 'Storage',
    path: '/stock',
    color: '#3b82f6'
  }
];

const iconMap: Record<string, any> = {
  Dashboard: DashboardIcon,
  Opacity: ParfumIcon,
  Inventory: ReferenceIcon,
  LocalShipping: SupplierIcon,
  People: ClientIcon,
  Storage: StockIcon,
};

interface FavoritesManagerProps {
  open: boolean;
  onClose: () => void;
  onFavoritesChange: (favorites: FavoriteItem[]) => void;
}

export default function FavoritesManager({ open, onClose, onFavoritesChange }: FavoritesManagerProps) {
  const { darkMode } = useAppStore();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [availableFavorites, setAvailableFavorites] = useState<FavoriteItem[]>(availableItems);
  const [draggedItem, setDraggedItem] = useState<FavoriteItem | null>(null);

  useEffect(() => {
    if (open) {
      // Load favorites from localStorage or use defaults
      const saved = localStorage.getItem('user-favorites');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFavorites(parsed);
          setAvailableFavorites(availableItems.filter(item =>
            !parsed.some((fav: FavoriteItem) => fav.id === item.id)
          ));
        } catch (e) {
          setFavorites([]);
          setAvailableFavorites(availableItems);
        }
      } else {
        setFavorites([]);
        setAvailableFavorites(availableItems);
      }
    }
  }, [open]);

  const handleAddFavorite = (item: FavoriteItem) => {
    const newFavorites = [...favorites, item];
    setFavorites(newFavorites);
    setAvailableFavorites(prev => prev.filter(fav => fav.id !== item.id));
  };

  const handleRemoveFavorite = (item: FavoriteItem) => {
    const newFavorites = favorites.filter(fav => fav.id !== item.id);
    setFavorites(newFavorites);
    setAvailableFavorites(prev => [...prev, item]);
  };

  const handleDragStart = (item: FavoriteItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedIndex = favorites.findIndex(fav => fav.id === draggedItem.id);
    if (draggedIndex === -1) return;

    const newFavorites = [...favorites];
    newFavorites.splice(draggedIndex, 1);
    newFavorites.splice(targetIndex, 0, draggedItem);

    setFavorites(newFavorites);
    setDraggedItem(null);
  };

  const handleSave = () => {
    localStorage.setItem('user-favorites', JSON.stringify(favorites));
    onFavoritesChange(favorites);
    onClose();
  };

  const handleReset = () => {
    localStorage.removeItem('user-favorites');
    setFavorites([]);
    setAvailableFavorites(availableItems);
    onFavoritesChange([]);
  };

  const IconComponent = (iconName: string) => {
    const Icon = iconMap[iconName] || StarIcon;
    return <Icon />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: darkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          boxShadow: darkMode
            ? '0 25px 50px rgba(0,0,0,0.5)'
            : '0 25px 50px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle sx={{
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Gérer les Favoris
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Personnalisez vos raccourcis favoris pour un accès rapide aux pages et actions les plus utilisées.
        </Alert>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Available Items */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarBorderIcon />
              Éléments Disponibles
            </Typography>
            <List sx={{
              border: '1px solid',
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderRadius: 2,
              minHeight: 200
            }}>
              {availableFavorites.map((item) => (
                <ListItem key={item.id} sx={{ borderRadius: 1 }}>
                  <ListItemIcon sx={{ color: item.color }}>
                    {IconComponent(item.icon)}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleAddFavorite(item)}
                      sx={{
                        background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        '&:hover': {
                          background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                        },
                      }}
                    >
                      <AddIcon sx={{ color: '#10b981' }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {availableFavorites.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Tous les éléments sont dans vos favoris"
                    sx={{ textAlign: 'center', opacity: 0.6 }}
                  />
                </ListItem>
              )}
            </List>
          </Box>

          {/* Current Favorites */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon />
              Mes Favoris ({favorites.length}/6)
            </Typography>
            <List sx={{
              border: '1px solid',
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderRadius: 2,
              minHeight: 200
            }}>
              {favorites.map((item, index) => (
                <ListItem
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  sx={{
                    borderRadius: 1,
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' }
                  }}
                >
                  <ListItemIcon sx={{ cursor: 'grab' }}>
                    <DragIcon />
                  </ListItemIcon>
                  <ListItemIcon sx={{ color: item.color }}>
                    {IconComponent(item.icon)}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleRemoveFavorite(item)}
                      sx={{
                        background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        '&:hover': {
                          background: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                        },
                      }}
                    >
                      <DeleteIcon sx={{ color: '#ef4444' }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {favorites.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Aucun favori défini"
                    secondary="Ajoutez des éléments depuis la liste disponible"
                    sx={{ textAlign: 'center', opacity: 0.6 }}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
          Glissez-déposez les éléments pour réorganiser vos favoris
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={handleReset}
          sx={{ color: 'text.secondary' }}
        >
          Réinitialiser
        </Button>

        <Stack direction="row" spacing={1}>
          <Button onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
              },
            }}
          >
            Enregistrer
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}