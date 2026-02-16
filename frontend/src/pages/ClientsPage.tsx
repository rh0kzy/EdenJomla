import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  IconButton,
  Fade,
  Chip,
  Stack
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';
import TableSkeleton from '../components/TableSkeleton';
import Tooltip from '../components/Tooltip';
import useTooltip from '../hooks/useTooltip';
import { useToast } from '../hooks/useToast';
import ErrorFeedback from '../components/ErrorFeedback';

export default function ClientsPage() {
  const { clients, loading, fetchClients } = useDataStore();
  const { darkMode } = useAppStore();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formData, setFormData] = useState({ nom: '', telephone: '' });
  const { getTooltip } = useTooltip();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpen = (item: any = null) => {
    if (item) {
      setSelected(item);
      setFormData({ nom: item.nom, telephone: item.telephone || '' });
    } else {
      setSelected(null);
      setFormData({ nom: '', telephone: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    setError(null);
    try {
      if (selected) {
        await window.api.clients.update(selected.id, formData);
        toast('Client modifié avec succès', 'success');
      } else {
        await window.api.clients.create(formData);
        toast('Client ajouté avec succès', 'success');
      }
      fetchClients();
      handleClose();
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la sauvegarde du client.');
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      renderHeader: () => (
        <Tooltip title={getTooltip('form.client')} placement="top">
          <span>ID</span>
        </Tooltip>
      ),
      width: 80,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          sx={{ 
            fontWeight: 600,
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
          }}
        />
      )
    },
    { 
      field: 'nom', 
      renderHeader: () => (
        <Tooltip title={getTooltip('form.name')} placement="top">
          <span>Nom</span>
        </Tooltip>
      ),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ opacity: 0.5, fontSize: 18 }} />
          <Typography sx={{ fontWeight: 500 }}>{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'telephone', 
      renderHeader: () => (
        <Tooltip title={getTooltip('form.client')} placement="top">
          <span>Téléphone</span>
        </Tooltip>
      ),
      flex: 1 
    },
    {
      field: 'actions',
      renderHeader: () => (
        <Tooltip title={getTooltip('actions.edit')} placement="top">
          <span>Actions</span>
        </Tooltip>
      ),
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            onClick={() => handleOpen(params.row)}
            sx={{
              background: darkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.15)',
              }
            }}
          >
            <EditIcon fontSize="small" sx={{ color: '#6366f1' }} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Fade in timeout={500}>
      <Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 0.5,
                background: darkMode
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Clients
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Gérez vos clients et leurs coordonnées
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            size="large"
          >
            Nouveau Client
          </Button>
        </Box>
        
        <ErrorFeedback error={error} onClose={() => setError(null)} />
        {loading ? <TableSkeleton rows={8} columns={3} /> : <DataTable rows={clients} columns={columns} loading={false} />}
        
        <Dialog 
          open={open} 
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 1,
            fontSize: '1.5rem',
            fontWeight: 700,
          }}>
            {selected ? 'Modifier Client' : 'Nouveau Client'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth 
              label="Nom" 
              margin="normal"
              value={formData.nom} 
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              autoFocus
            />
            <TextField
              fullWidth 
              label="Téléphone" 
              margin="normal"
              value={formData.telephone} 
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={handleClose}
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}
