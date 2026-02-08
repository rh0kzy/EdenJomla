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
  MenuItem,
  Fade,
  Chip,
  Stack
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';

export default function ReferencesPage() {
  const { 
    references, 
    parfums, 
    fournisseurs, 
    loading, 
    fetchReferences, 
    fetchParfums, 
    fetchFournisseurs 
  } = useDataStore();
  const { darkMode } = useAppStore();
  
  const [open, setOpen] = useState(false);
  const [selectedRef, setSelectedRef] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    parfumId: '', 
    fournisseurId: '', 
    referenceCode: '', 
    unite: 'GRAMME', 
    prixUnitaire: 0 
  });

  useEffect(() => {
    fetchReferences();
    fetchParfums();
    fetchFournisseurs();
  }, []);

  const handleOpen = (ref: any = null) => {
    if (ref) {
      setSelectedRef(ref);
      setFormData({ 
        parfumId: ref.parfumId, 
        fournisseurId: ref.fournisseurId, 
        referenceCode: ref.referenceCode, 
        unite: ref.unite, 
        prixUnitaire: ref.prixUnitaire 
      });
    } else {
      setSelectedRef(null);
      setFormData({ 
        parfumId: '', 
        fournisseurId: '', 
        referenceCode: '', 
        unite: 'GRAMME', 
        prixUnitaire: 0 
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const data = {
      ...formData,
      parfumId: parseInt(formData.parfumId as string),
      fournisseurId: parseInt(formData.fournisseurId as string),
      prixUnitaire: parseFloat(formData.prixUnitaire as any)
    };

    if (selectedRef) {
      await window.api.references.update(selectedRef.id, data);
    } else {
      await window.api.references.create(data as any);
    }
    fetchReferences();
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
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          }}
        />
      )
    },
    { 
        field: 'parfum', 
        headerName: 'Parfum', 
        flex: 1, 
        valueGetter: (_value, row) => row.parfum?.nom,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon sx={{ opacity: 0.5, fontSize: 18 }} />
            <Typography sx={{ fontWeight: 500 }}>{params.value}</Typography>
          </Box>
        )
    },
    { 
        field: 'referenceCode', 
        headerName: 'Code', 
        flex: 1,
        renderCell: (params) => (
          <Chip 
            label={params.value} 
            size="small" 
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        )
    },
    { 
        field: 'fournisseur', 
        headerName: 'Fournisseur', 
        flex: 1, 
        valueGetter: (_value, row) => row.fournisseur?.nom 
    },
    { 
      field: 'unite', 
      headerName: 'Unité', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === 'KILOGRAMME' ? 'primary' : 'secondary'}
        />
      )
    },
    { 
      field: 'prixUnitaire', 
      headerName: 'Prix Unit.', 
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, color: '#10b981' }}>
          {params.value} DH
        </Typography>
      )
    },
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
              background: darkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)',
              }
            }}
          >
            <EditIcon fontSize="small" sx={{ color: '#8b5cf6' }} />
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
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Références Parfum
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Gérez les références fournisseurs de vos parfums
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            size="large"
          >
            Nouvelle Référence
          </Button>
        </Box>

        <DataTable rows={references} columns={columns} loading={loading} />

        <Dialog 
          open={open} 
          onClose={handleClose} 
          fullWidth 
          maxWidth="sm"
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
            {selectedRef ? 'Modifier Référence' : 'Nouvelle Référence'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              select
              label="Parfum"
              margin="normal"
              value={formData.parfumId}
              onChange={(e) => setFormData({ ...formData, parfumId: e.target.value })}
              autoFocus
            >
              {parfums.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nom} - {p.marque}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Fournisseur"
              margin="normal"
              value={formData.fournisseurId}
              onChange={(e) => setFormData({ ...formData, fournisseurId: e.target.value })}
            >
              {fournisseurs.map((f) => (
                <MenuItem key={f.id} value={f.id}>{f.nom}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Code Référence"
              margin="normal"
              value={formData.referenceCode}
              onChange={(e) => setFormData({ ...formData, referenceCode: e.target.value })}
            />

            <TextField
              fullWidth
              select
              label="Unité"
              margin="normal"
              value={formData.unite}
              onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
            >
              <MenuItem value="GRAMME">Gramme</MenuItem>
              <MenuItem value="KILOGRAMME">Kilogramme</MenuItem>
            </TextField>

            <TextField
              fullWidth
              type="number"
              label="Prix Unitaire"
              margin="normal"
              value={formData.prixUnitaire}
              onChange={(e) => setFormData({ ...formData, prixUnitaire: parseFloat(e.target.value) })}
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
              disabled={!formData.parfumId || !formData.fournisseurId || !formData.referenceCode}
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
