import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  IconButton,
  Chip,
  Fade,
  Stack,
  alpha
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  Edit as EditIcon,
  Search as SearchIcon,
  Storage as StockIcon,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';

export default function StockPage() {
  const { stock, loading, fetchStock } = useDataStore();
  const { darkMode } = useAppStore();
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [adjustment, setAdjustment] = useState<number>(0);

  useEffect(() => {
    fetchStock();
  }, []);

  const handleOpenAdjustment = (stockItem: any) => {
    setSelectedStock(stockItem);
    setAdjustment(0);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleApplyAdjustment = async () => {
    if (selectedStock) {
      await window.api.stock.updateQuantity(selectedStock.parfumReferenceId, adjustment);
      fetchStock();
    }
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
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          }}
        />
      )
    },
    { 
      field: 'parfum', 
      headerName: 'Parfum', 
      flex: 1, 
      valueGetter: (_value, row) => row.reference?.parfum?.nom,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StockIcon sx={{ opacity: 0.5, fontSize: 18 }} />
          <Typography sx={{ fontWeight: 500 }}>{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'referenceCode', 
      headerName: 'Code Réf', 
      flex: 0.8, 
      valueGetter: (_value, row) => row.reference?.referenceCode,
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
      valueGetter: (_value, row) => row.reference?.fournisseur?.nom 
    },
    { 
      field: 'quantite', 
      headerName: 'Quantité', 
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.1rem',
              color: params.value > 100 ? '#10b981' : params.value > 50 ? '#f59e0b' : '#ef4444',
            }}
          >
            {params.value}
          </Typography>
          <Chip 
            size="small" 
            label={params.row.reference?.unite} 
            sx={{
              background: params.row.reference?.unite === 'KILOGRAMME' 
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Ajuster',
      width: 120,
      renderCell: (params) => (
        <IconButton 
          size="small" 
          onClick={() => handleOpenAdjustment(params.row)}
          sx={{
            background: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
            '&:hover': {
              background: darkMode ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)',
            }
          }}
        >
          <EditIcon fontSize="small" sx={{ color: '#3b82f6' }} />
        </IconButton>
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
                  ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Gestion de Stock
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Suivez et ajustez vos niveaux de stock en temps réel
            </Typography>
          </Box>
        </Box>

        <DataTable rows={stock} columns={columns} loading={loading} />

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
            Ajuster le Stock
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ 
              p: 2, 
              mb: 2, 
              borderRadius: 2, 
              background: darkMode 
                ? alpha('#3b82f6', 0.1) 
                : alpha('#3b82f6', 0.05),
              border: `1px solid ${darkMode ? alpha('#3b82f6', 0.2) : alpha('#3b82f6', 0.1)}`
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedStock?.reference?.parfum?.nom}
              </Typography>
              <Chip 
                label={selectedStock?.reference?.referenceCode} 
                size="small" 
                sx={{ mr: 1 }}
              />
              <Chip 
                label={selectedStock?.reference?.fournisseur?.nom} 
                size="small" 
                color="primary"
              />
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 600 }}>
                Quantité actuelle: 
                <Typography component="span" sx={{ ml: 1, fontSize: '1.2rem', color: '#3b82f6' }}>
                  {selectedStock?.quantite} {selectedStock?.reference?.unite}
                </Typography>
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              type="number"
              label="Ajustement (ex: 5 pour ajouter ou -2 pour retirer)"
              margin="normal"
              value={adjustment}
              onChange={(e) => setAdjustment(parseFloat(e.target.value))}
              autoFocus
              helperText={adjustment !== 0 && `Nouvelle quantité: ${(selectedStock?.quantite || 0) + adjustment} ${selectedStock?.reference?.unite}`}
              InputProps={{
                startAdornment: adjustment > 0 ? <TrendingUp sx={{ mr: 1, color: '#10b981' }} /> : adjustment < 0 ? <TrendingDown sx={{ mr: 1, color: '#ef4444' }} /> : null,
              }}
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
              onClick={handleApplyAdjustment} 
              variant="contained" 
              disabled={adjustment === 0}
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              Appliquer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}
