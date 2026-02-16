import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import {
  Help as HelpIcon,
  Keyboard as KeyboardIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';

interface HelpButtonProps {
  page: string;
  size?: 'small' | 'medium' | 'large';
}

const helpContent: Record<string, {
  title: string;
  description: string;
  shortcuts: Array<{ keys: string; description: string }>;
  tips: string[];
}> = {
  parfums: {
    title: 'Aide - Gestion des Parfums',
    description: 'Gérez votre catalogue de parfums avec des fonctionnalités avancées de recherche et d\'édition.',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Recherche globale' },
      { keys: 'Alt+1-6', description: 'Navigation entre sections' },
      { keys: 'Alt+S', description: 'Basculer la sidebar' },
      { keys: 'Entrée', description: 'Valider la recherche' },
      { keys: 'Échap', description: 'Fermer les dialogues' },
    ],
    tips: [
      'Utilisez la recherche avancée pour filtrer par marque ou nom',
      'Clic droit sur une ligne pour accéder au menu contextuel',
      'Utilisez les raccourcis clavier pour une navigation rapide',
      'Les filtres sont sauvegardés automatiquement',
    ],
  },
  references: {
    title: 'Aide - Gestion des Références',
    description: 'Gérez les références de produits fournisseurs avec suivi des prix et disponibilité.',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Recherche globale' },
      { keys: 'Alt+1-6', description: 'Navigation entre sections' },
      { keys: 'Alt+S', description: 'Basculer la sidebar' },
    ],
    tips: [
      'Comparez les prix entre différents fournisseurs',
      'Suivez l\'historique des prix automatiquement',
      'Importez en masse depuis Excel/CSV',
    ],
  },
  fournisseurs: {
    title: 'Aide - Gestion des Fournisseurs',
    description: 'Gérez vos relations fournisseurs avec évaluation et historique des commandes.',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Recherche globale' },
      { keys: 'Alt+1-6', description: 'Navigation entre sections' },
      { keys: 'Alt+S', description: 'Basculer la sidebar' },
    ],
    tips: [
      'Évaluez vos fournisseurs sur la qualité et les délais',
      'Consultez l\'historique complet des commandes',
      'Ajoutez plusieurs contacts par fournisseur',
    ],
  },
  clients: {
    title: 'Aide - Gestion des Clients',
    description: 'Gérez votre base clients avec fidélité et historique d\'achats.',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Recherche globale' },
      { keys: 'Alt+1-6', description: 'Navigation entre sections' },
      { keys: 'Alt+S', description: 'Basculer la sidebar' },
    ],
    tips: [
      'Configurez des programmes de fidélité personnalisés',
      'Suivez l\'historique d\'achats détaillé',
      'Envoyez des emails automatiques pour les anniversaires',
    ],
  },
  stock: {
    title: 'Aide - Gestion du Stock',
    description: 'Surveillez et gérez vos niveaux de stock en temps réel.',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Recherche globale' },
      { keys: 'Alt+1-6', description: 'Navigation entre sections' },
      { keys: 'Alt+S', description: 'Basculer la sidebar' },
    ],
    tips: [
      'Configurez des alertes de stock minimum',
      'Utilisez le scan code-barres pour l\'inventaire',
      'Suivez la traçabilité complète des mouvements',
    ],
  },
  dashboard: {
    title: 'Aide - Tableau de Bord',
    description: 'Vue d\'ensemble de votre activité avec statistiques et KPIs.',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Recherche globale' },
      { keys: 'Alt+1-6', description: 'Navigation entre sections' },
      { keys: 'Alt+S', description: 'Basculer la sidebar' },
    ],
    tips: [
      'Les widgets sont personnalisables et déplaçables',
      'Cliquez sur les graphiques pour voir les détails',
      'Les données se mettent à jour automatiquement',
    ],
  },
};

export default function HelpButton({ page, size = 'medium' }: HelpButtonProps) {
  const { darkMode } = useAppStore();
  const [open, setOpen] = useState(false);

  const content = helpContent[page] || helpContent.dashboard;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Aide contextuelle (?)">
        <IconButton
          size={size}
          onClick={handleOpen}
          sx={{
            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            },
          }}
        >
          <HelpIcon sx={{ fontSize: size === 'small' ? 18 : size === 'large' ? 24 : 20 }} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          fontSize: '1.5rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {content.title}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
            {content.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <KeyboardIcon />
              Raccourcis Clavier
            </Typography>
            <List dense>
              {content.shortcuts.map((shortcut, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 80 }}>
                    <Chip
                      label={shortcut.keys}
                      size="small"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        color: 'white',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={shortcut.description} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider sx={{ my: 3, opacity: 0.3 }} />

          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpIcon />
              Conseils Utiles
            </Typography>
            <List dense>
              {content.tips.map((tip, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      •
                    </Typography>
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}