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
  Stack,
  Avatar,
  Card,
  CardMedia,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Opacity as ParfumIcon, PhotoCamera as PhotoIcon, Delete as RemoveIcon, Upload as UploadIcon, Download as DownloadIcon, PictureAsPdf as PdfIcon, TableChart as CsvIcon, ContentCopy as ContentCopyIcon, Visibility as VisibilityIcon, QrCode as QrCodeIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import { GridColDef } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';

export default function ParfumsPage() {
  const { parfums, loading, fetchParfums } = useDataStore();
  const { darkMode } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedParfum, setSelectedParfum] = useState<any>(null);
  const [formData, setFormData] = useState({ nom: '', marque: '', description: '', image: '', notes: '', barcode: '', categoryId: '' });
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<Record<string, any>>({});
  const [filteredParfums, setFilteredParfums] = useState(parfums);

  useEffect(() => {
    fetchParfums();
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await window.api.categories.getAll();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await window.api.tags.getAll();
      if (response.success) {
        setTags(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

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
      setFormData({ 
        nom: parfum.nom, 
        marque: parfum.marque, 
        description: parfum.description || '',
        image: parfum.image || '',
        notes: parfum.notes || '',
        barcode: parfum.barcode || '',
        categoryId: parfum.categoryId || ''
      });
      setSelectedTags(parfum.tags?.map((pt: any) => pt.tagId) || []);
      setImagePreview(parfum.image ? `/images/parfums/${parfum.image}` : null);
    } else {
      setSelectedParfum(null);
      setFormData({ nom: '', marque: '', description: '', image: '', notes: '', barcode: '', categoryId: '' });
      setSelectedTags([]);
      setImagePreview(null);
    }
    setSelectedImage(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({ ...formData, image: '' });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          // Expected format: nom,marque,description
          if (!headers.includes('nom') || !headers.includes('marque')) {
            alert('Format CSV invalide. Colonnes requises: nom, marque, description (optionnelle)');
            return;
          }

          const importedCount = { success: 0, errors: 0 };
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const parfumData: any = {};
            
            headers.forEach((header, index) => {
              if (values[index]) {
                parfumData[header] = values[index];
              }
            });

            try {
              await window.api.parfums.create(parfumData);
              importedCount.success++;
            } catch (error) {
              console.error('Error importing parfum:', error);
              importedCount.errors++;
            }
          }
          
          fetchParfums();
          alert(`${importedCount.success} parfums importés avec succès${importedCount.errors > 0 ? `, ${importedCount.errors} erreurs` : ''}`);
        } catch (error) {
          console.error('Import error:', error);
          alert('Erreur lors de l\'importation');
        }
      }
    };
    input.click();
  };

  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = ['nom', 'marque', 'description', 'image'];
      const csvContent = [
        headers.join(','),
        ...parfums.map(parfum => [
          `"${parfum.nom}"`,
          `"${parfum.marque}"`,
          `"${parfum.description || ''}"`,
          `"${parfum.image || ''}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `parfums_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'exportation');
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Catalogue des Parfums', 20, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
      
      // Prepare table data
      const tableData = parfums.map(parfum => [
        parfum.nom,
        parfum.marque,
        parfum.description || '',
        parfum.image ? 'Oui' : 'Non'
      ]);
      
      // Add table
      (doc as any).autoTable({
        head: [['Nom', 'Marque', 'Description', 'Image']],
        body: tableData,
        startY: 45,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [236, 72, 153], // Pink color matching theme
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Light gray
        },
      });
      
      // Save the PDF
      doc.save(`parfums_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Erreur lors de l\'exportation PDF');
    }
  };

  const handleGenerateQR = async (parfum: any) => {
    try {
      // Create QR code data
      const qrData = JSON.stringify({
        id: parfum.id,
        nom: parfum.nom,
        marque: parfum.marque,
        barcode: parfum.barcode,
        type: 'parfum'
      });

      // Generate QR code as data URL
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Create a new window to display the QR code
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code - ${parfum.nom}</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .qr-container { margin: 20px auto; }
                .info { margin-top: 20px; }
                @media print { .no-print { display: none; } }
              </style>
            </head>
            <body>
              <h1>QR Code - ${parfum.nom}</h1>
              <div class="qr-container">
                <img src="${qrCodeDataURL}" alt="QR Code" style="max-width: 256px;" />
              </div>
              <div class="info">
                <p><strong>Nom:</strong> ${parfum.nom}</p>
                <p><strong>Marque:</strong> ${parfum.marque}</p>
                <p><strong>Code-barres:</strong> ${parfum.barcode || 'N/A'}</p>
                <p><strong>ID:</strong> ${parfum.id}</p>
              </div>
              <div class="no-print" style="margin-top: 20px;">
                <button onclick="window.print()">Imprimer</button>
                <button onclick="window.close()">Fermer</button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('QR code generation error:', error);
      alert('Erreur lors de la génération du QR code');
    }
  };

  const handleSubmit = async () => {
    try {
      let imagePath = formData.image;

      // Handle image upload if a new image is selected
      if (selectedImage) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedImage);
        formDataUpload.append('type', 'parfum');

        const uploadResponse = await window.api.uploadImage(formDataUpload);
        if (uploadResponse.success) {
          imagePath = uploadResponse.data.filename;
        }
      }

      const parfumData = {
        ...formData,
        image: imagePath,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
      };

      let savedParfum;
      if (selectedParfum) {
        const response = await window.api.parfums.update(selectedParfum.id, parfumData);
        if (response.success) {
          savedParfum = response.data;
        }
      } else {
        const response = await window.api.parfums.create(parfumData);
        if (response.success) {
          savedParfum = response.data;
        }
      }

      // Save tags if parfum was saved successfully
      if (savedParfum) {
        await window.api.tags.setForParfum(savedParfum.id, selectedTags);
      }

      fetchParfums();
      handleClose();
    } catch (error) {
      console.error('Error saving parfum:', error);
      // You could add toast notification here
    }
  };

  const handleDuplicate = async (parfum: any) => {
    if (confirm('Êtes-vous sûr de vouloir dupliquer ce parfum ?')) {
      try {
        await window.api.parfums.duplicate(parfum.id);
        fetchParfums();
      } catch (error) {
        console.error('Error duplicating parfum:', error);
        alert('Erreur lors de la duplication du parfum');
      }
    }
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
      label: 'Voir Détails',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (row: any) => navigate(`/parfums/${row.id}`),
    },
    {
      label: 'Modifier',
      icon: <EditIcon fontSize="small" />,
      onClick: (row: any) => handleOpen(row),
    },
    {
      label: 'Dupliquer',
      icon: <ContentCopyIcon fontSize="small" />,
      onClick: (row: any) => handleDuplicate(row),
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
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        params.value ? (
          <Avatar
            src={`/images/parfums/${params.value}`}
            alt="Parfum"
            sx={{ width: 40, height: 40, border: '2px solid rgba(0,0,0,0.1)' }}
          >
            <ParfumIcon />
          </Avatar>
        ) : (
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(0,0,0,0.1)' }}>
            <ParfumIcon />
          </Avatar>
        )
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
      field: 'category',
      headerName: 'Catégorie',
      flex: 1,
      renderCell: (params) => (
        params.row.category ? (
          <Chip
            label={params.row.category.nom}
            size="small"
            sx={{
              backgroundColor: params.row.category.couleur || '#e0e0e0',
              color: params.row.category.couleur ? '#fff' : '#000',
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">-</Typography>
        )
      )
    },
    {
      field: 'tags',
      headerName: 'Tags',
      flex: 1,
      renderCell: (params) => (
        params.row.tags && params.row.tags.length > 0 ? (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {params.row.tags.slice(0, 2).map((tagRelation: any) => (
              <Chip
                key={tagRelation.tag.id}
                label={tagRelation.tag.nom}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  backgroundColor: tagRelation.tag.couleur || '#e0e0e0',
                  color: tagRelation.tag.couleur ? '#fff' : '#000',
                }}
              />
            ))}
            {params.row.tags.length > 2 && (
              <Chip
                label={`+${params.row.tags.length - 2}`}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  backgroundColor: '#666',
                  color: '#fff',
                }}
              />
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">-</Typography>
        )
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            onClick={() => navigate(`/parfums/${params.row.id}`)}
            sx={{
              background: darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
              }
            }}
          >
            <VisibilityIcon fontSize="small" sx={{ color: '#10b981' }} />
          </IconButton>
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
            onClick={() => handleDuplicate(params.row)}
            sx={{
              background: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)',
              }
            }}
          >
            <ContentCopyIcon fontSize="small" sx={{ color: '#3b82f6' }} />
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
          <IconButton 
            size="small" 
            onClick={() => handleGenerateQR(params.row)}
            sx={{
              background: darkMode ? 'rgba(147, 51, 234, 0.15)' : 'rgba(147, 51, 234, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(147, 51, 234, 0.25)' : 'rgba(147, 51, 234, 0.15)',
              }
            }}
          >
            <QrCodeIcon fontSize="small" sx={{ color: '#9333ea' }} />
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<UploadIcon />} 
              onClick={handleImport}
              size="large"
            >
              Importer CSV
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />} 
              onClick={(e) => setExportMenuAnchor(e.currentTarget)}
              size="large"
            >
              Exporter
            </Button>
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
        </Box>
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => setExportMenuAnchor(null)}
          >
            <MenuItem onClick={() => { handleExportCSV(); setExportMenuAnchor(null); }}>
              <ListItemIcon>
                <CsvIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Exporter en CSV</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleExportPDF(); setExportMenuAnchor(null); }}>
              <ListItemIcon>
                <PdfIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Exporter en PDF</ListItemText>
            </MenuItem>
          </Menu>
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
            {/* Image Upload Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Image du Parfum
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageSelect}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Choisir une image
                  </Button>
                </label>
                {imagePreview && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RemoveIcon />}
                    onClick={handleRemoveImage}
                    sx={{ borderRadius: 2 }}
                  >
                    Supprimer
                  </Button>
                )}
              </Box>
              {imagePreview && (
                <Card sx={{ mt: 2, maxWidth: 200 }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={imagePreview}
                    alt="Aperçu de l'image"
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
              )}
            </Box>

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
            <TextField
              fullWidth
              label="Notes/Commentaires"
              margin="normal"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ajouter des notes internes ou commentaires..."
            />
            <TextField
              fullWidth
              label="Code-barres"
              margin="normal"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              placeholder="Scanner ou saisir le code-barres..."
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={formData.categoryId}
                label="Catégorie"
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <MenuItem value="">
                  <em>Aucune catégorie</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {category.couleur && (
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: category.couleur,
                          }}
                        />
                      )}
                      {category.nom}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Autocomplete
              multiple
              options={tags}
              getOptionLabel={(option) => option.nom}
              value={tags.filter(tag => selectedTags.includes(tag.id))}
              onChange={(event, newValue) => {
                setSelectedTags(newValue.map(tag => tag.id));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option.id}
                    label={option.nom}
                    {...getTagProps({ index })}
                    sx={{
                      backgroundColor: option.couleur || '#e0e0e0',
                      color: option.couleur ? '#fff' : '#000',
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags/Étiquettes"
                  placeholder="Sélectionner des tags..."
                  margin="normal"
                />
              )}
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
