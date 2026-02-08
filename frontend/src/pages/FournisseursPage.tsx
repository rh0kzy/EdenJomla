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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, LocalShipping as SupplierIcon } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';

export default function FournisseursPage() {
  const { fournisseurs, loading, fetchFournisseurs } = useDataStore();
  const { darkMode } = useAppStore();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formData, setFormData] = useState({ nom: '', telephone: '', email: '' });

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const handleOpen = (item: any = null) => {
    if (item) {
      setSelected(item);
      setFormData({ nom: item.nom, telephone: item.telephone || '', email: item.email || '' });
    } else {
      setSelected(null);
      setFormData({ nom: '', telephone: '', email: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (selected) {
      await window.api.fournisseurs.update(selected.id, formData);
    } else {
      await window.api.fournisseurs.create(formData);
    }
    fetchFournisseurs();
    handleClose();
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          sx={{ 
            fontWeight: 600,
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 146, 60, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)',
          }}
        />
      )
    },
    { 
      field: 'nom', 
      headerName: 'Nom', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupplierIcon sx={{ opacity: 0.5, fontSize: 18 }} />
          <Typography sx={{ fontWeight: 500 }}>{params.value}</Typography>
        </Box>
      )
    },
    { field: 'telephone', headerName: 'Téléphone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            onClick={() => handleOpen(params.row)}
            sx={{
              background: darkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.15)',
              }
            }}
          >
            <EditIcon fontSize="small" sx={{ color: '#f59e0b' }} />
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
                  ? 'linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fournisseurs
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Gérez vos fournisseurs et leurs coordonnées
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            size="large"
          >
            Nouveau Fournisseur
          </Button>
        </Box>
        
        <DataTable rows={fournisseurs} columns={columns} loading={loading} />
        
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
            {selected ? 'Modifier Fournisseur' : 'Nouveau Fournisseur'}
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
            <TextField
              fullWidth 
              label="Email" 
              margin="normal"
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
