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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Opacity as ParfumIcon } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';

export default function ParfumsPage() {
  const { parfums, loading, fetchParfums } = useDataStore();
  const { darkMode } = useAppStore();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedParfum, setSelectedParfum] = useState<any>(null);
  const [formData, setFormData] = useState({ nom: '', marque: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<Record<string, any>>({});
  const [filteredParfums, setFilteredParfums] = useState(parfums);

  useEffect(() => {
    fetchParfums();
  }, []);

  useEffect(() => {
    // Handle global search from navigation
    const searchState = location.state as { search?: string };
    if (searchState?.search) {
      setSearchQuery(searchState.search);
    }
  }, [location.state]);

  useEffect(() => {
    let filtered = parfums;

    // Apply text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(parfum =>
        parfum.nom.toLowerCase().includes(query) ||
        parfum.marque.toLowerCase().includes(query) ||
        (parfum.description && parfum.description.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (searchFilters.marque) {
      filtered = filtered.filter(parfum => parfum.marque === searchFilters.marque);
    }

    setFilteredParfums(filtered);
  }, [parfums, searchQuery, searchFilters]);

  const handleOpen = (parfum: any = null) => {
    if (parfum) {
      setSelectedParfum(parfum);
      setFormData({ nom: parfum.nom, marque: parfum.marque, description: parfum.description || '' });
    } else {
      setSelectedParfum(null);
      setFormData({ nom: '', marque: '', description: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (selectedParfum) {
      await window.api.parfums.update(selectedParfum.id, formData);
    } else {
      await window.api.parfums.create(formData);
    }
    fetchParfums();
    handleClose();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce parfum ?')) {
      await window.api.parfums.delete(id);
      fetchParfums();
    }
  };

  const handleSearch = (query: string, filters: Record<string, any>) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  };

  const contextMenuItems = [
    {
      label: 'Modifier',
      icon: <EditIcon fontSize="small" />,
      onClick: (row: any) => handleOpen(row),
    },
    {
      label: 'Supprimer',
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row: any) => handleDelete(row.id),
    },
  ];

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
              ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)',
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
          <ParfumIcon sx={{ opacity: 0.5, fontSize: 18 }} />
          <Typography sx={{ fontWeight: 500 }}>{params.value}</Typography>
        </Box>
      )
    },
    { field: 'marque', headerName: 'Marque', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            onClick={() => handleOpen(params.row)}
            sx={{
              background: darkMode ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.15)',
              }
            }}
          >
            <EditIcon fontSize="small" sx={{ color: '#ec4899' }} />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDelete(params.row.id)}
            sx={{
              background: darkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)',
              }
            }}
          >
            <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
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
                  ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                  : 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Parfums
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Gérez votre catalogue de parfums
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            size="large"
            data-tour="add-button"
          >
            Nouveau Parfum
          </Button>
        </Box>

        <div data-tour="search-bar">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher des parfums..."
            filterOptions={[
              {
                key: 'marque',
                label: 'Marque',
                type: 'select',
                options: [...new Set(parfums.map(p => p.marque))].sort(),
              },
            ]}
            initialQuery={searchQuery}
          />
        </div>

        <div data-tour="data-table">
          <DataTable
            rows={filteredParfums}
            columns={columns}
            loading={loading}
            contextMenuItems={contextMenuItems}
          />
        </div>

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
            {selectedParfum ? 'Modifier Parfum' : 'Nouveau Parfum'}
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
              label="Marque"
              margin="normal"
              value={formData.marque}
              onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
