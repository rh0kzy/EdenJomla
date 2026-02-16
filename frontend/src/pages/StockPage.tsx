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
  alpha,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  Edit as EditIcon,
  Search as SearchIcon,
  Storage as StockIcon,
  TrendingUp,
  TrendingDown,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    seuilMin: '',
    seuilMax: '',
    emplacement: '',
    lot: '',
    datePeremption: ''
  });
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [highStockAlerts, setHighStockAlerts] = useState<any[]>([]);
  const [expiringStock, setExpiringStock] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuStock, setMenuStock] = useState<any>(null);

  useEffect(() => {
    fetchStock();
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const [lowRes, highRes, expiringRes] = await Promise.all([
        window.api.stock.getLowAlerts(),
        window.api.stock.getHighAlerts(),
        window.api.stock.getExpiring(30)
      ]);
      if (lowRes.success) setLowStockAlerts(lowRes.data);
      if (highRes.success) setHighStockAlerts(highRes.data);
      if (expiringRes.success) setExpiringStock(expiringRes.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleOpenAdjustment = (stockItem: any) => {
    setSelectedStock(stockItem);
    setAdjustment(0);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEditOpen = (stockItem: any) => {
    setSelectedStock(stockItem);
    setEditData({
      seuilMin: stockItem.seuilMin?.toString() || '',
      seuilMax: stockItem.seuilMax?.toString() || '',
      emplacement: stockItem.emplacement || '',
      lot: stockItem.lot || '',
      datePeremption: stockItem.datePeremption ? new Date(stockItem.datePeremption).toISOString().split('T')[0] : ''
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => setEditDialogOpen(false);

  const handleEditSave = async () => {
    if (selectedStock) {
      const data = {
        seuilMin: editData.seuilMin ? parseFloat(editData.seuilMin) : undefined,
        seuilMax: editData.seuilMax ? parseFloat(editData.seuilMax) : undefined,
        emplacement: editData.emplacement || undefined,
        lot: editData.lot || undefined,
        datePeremption: editData.datePeremption ? new Date(editData.datePeremption) : undefined
      };
      await window.api.stock.updateDetails(selectedStock.parfumReferenceId, data);
      fetchStock();
      fetchAlerts();
    }
    handleEditClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, stockItem: any) => {
    setAnchorEl(event.currentTarget);
    setMenuStock(stockItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuStock(null);
  };

  const handleApplyAdjustment = async () => {
    if (selectedStock) {
      await window.api.stock.updateQuantity(selectedStock.parfumReferenceId, adjustment, 'user', 'Manual adjustment');
      fetchStock();
      fetchAlerts();
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
      width: 120,
      renderCell: (params) => {
        const isLow = params.row.seuilMin && params.value <= params.row.seuilMin;
        const isHigh = params.row.seuilMax && params.value >= params.row.seuilMax;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.1rem',
                color: isLow ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981',
              }}
            >
              {params.value}
            </Typography>
            {isLow && <WarningIcon sx={{ color: '#ef4444', fontSize: 16 }} />}
            {isHigh && <WarningIcon sx={{ color: '#f59e0b', fontSize: 16 }} />}
          </Box>
        );
      }
    },
    {
      field: 'seuils',
      headerName: 'Seuils',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {params.row.seuilMin && (
            <Chip 
              label={`Min: ${params.row.seuilMin}`} 
              size="small" 
              color="error" 
              variant="outlined"
            />
          )}
          {params.row.seuilMax && (
            <Chip 
              label={`Max: ${params.row.seuilMax}`} 
              size="small" 
              color="warning" 
              variant="outlined"
            />
          )}
        </Box>
      )
    },
    {
      field: 'emplacement',
      headerName: 'Emplacement',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocationIcon sx={{ fontSize: 16, opacity: 0.7 }} />
          <Typography variant="body2">{params.value || '-'}</Typography>
        </Box>
      )
    },
    {
      field: 'lot',
      headerName: 'Lot',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2">{params.value || '-'}</Typography>
      )
    },
    {
      field: 'datePeremption',
      headerName: 'Péremption',
      width: 120,
      renderCell: (params) => {
        if (!params.value) return <Typography variant="body2">-</Typography>;
        const date = new Date(params.value);
        const isExpiring = date.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 16, opacity: 0.7 }} />
            <Typography 
              variant="body2" 
              sx={{ color: isExpiring ? '#ef4444' : 'inherit' }}
            >
              {date.toLocaleDateString()}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      renderCell: (params) => (
        <IconButton 
          size="small" 
          onClick={(e) => handleMenuOpen(e, params.row)}
          sx={{
            background: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
            '&:hover': {
              background: darkMode ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)',
            }
          }}
        >
          <MoreVertIcon fontSize="small" sx={{ color: '#3b82f6' }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Fade in timeout={500}>
      <Box>
        {/* Alerts Section */}
        {(lowStockAlerts.length > 0 || highStockAlerts.length > 0 || expiringStock.length > 0) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon />
              Alertes Stock
            </Typography>
            <Grid container spacing={2}>
              {lowStockAlerts.length > 0 && (
                <Grid item xs={12} md={4}>
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    <AlertTitle>Stock Faible</AlertTitle>
                    {lowStockAlerts.length} produit(s) en dessous du seuil minimum
                  </Alert>
                </Grid>
              )}
              {highStockAlerts.length > 0 && (
                <Grid item xs={12} md={4}>
                  <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    <AlertTitle>Stock Élevé</AlertTitle>
                    {highStockAlerts.length} produit(s) au-dessus du seuil maximum
                  </Alert>
                </Grid>
              )}
              {expiringStock.length > 0 && (
                <Grid item xs={12} md={4}>
                  <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    <AlertTitle>Péremption Prochaine</AlertTitle>
                    {expiringStock.length} produit(s) expirent dans moins de 30 jours
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

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

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleOpenAdjustment(menuStock); handleMenuClose(); }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Ajuster Quantité</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { handleEditOpen(menuStock); handleMenuClose(); }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Modifier Détails</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Voir Historique</ListItemText>
          </MenuItem>
        </Menu>

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

        {/* Edit Stock Details Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={handleEditClose}
          maxWidth="md"
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
            Modifier les Détails du Stock
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ 
              p: 2, 
              mb: 3, 
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
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Seuil Minimum"
                  value={editData.seuilMin}
                  onChange={(e) => setEditData({ ...editData, seuilMin: e.target.value })}
                  helperText="Alerte quand le stock passe en dessous"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Seuil Maximum"
                  value={editData.seuilMax}
                  onChange={(e) => setEditData({ ...editData, seuilMax: e.target.value })}
                  helperText="Alerte quand le stock dépasse ce niveau"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emplacement"
                  value={editData.emplacement}
                  onChange={(e) => setEditData({ ...editData, emplacement: e.target.value })}
                  helperText="Emplacement physique du stock"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Numéro de Lot"
                  value={editData.lot}
                  onChange={(e) => setEditData({ ...editData, lot: e.target.value })}
                  helperText="Numéro de lot/série"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date de Péremption"
                  value={editData.datePeremption}
                  onChange={(e) => setEditData({ ...editData, datePeremption: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  helperText="Date de péremption du lot"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={handleEditClose}
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleEditSave} 
              variant="contained"
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}
