import React, { useEffect, useState, useRef } from 'react';
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
  Card,
  CardContent,
  Grid,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Cancel as CancelIcon,
  QrCodeScanner as ScannerIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as ReportIcon,
  CameraAlt as CameraIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';

interface Inventory {
  id: number;
  nom: string;
  description?: string;
  warehouseId?: number;
  warehouse?: { nom: string };
  status: string;
  startedAt?: string;
  completedAt?: string;
  user?: string;
  lines?: InventoryLine[];
  createdAt?: string;
}

interface InventoryLine {
  id: number;
  stockId: number;
  stock?: any;
  expectedQty: number;
  countedQty?: number;
  difference?: number;
  notes?: string;
  scannedAt?: string;
}

export default function InventoryPage() {
  const { darkMode } = useAppStore();
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState<InventoryLine | null>(null);
  const [countedQty, setCountedQty] = useState('');
  const [notes, setNotes] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuInventory, setMenuInventory] = useState<Inventory | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [createForm, setCreateForm] = useState({
    nom: '',
    description: '',
    warehouseId: ''
  });

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    setLoading(true);
    const res = await window.api.inventory.getAll();
    if (res.success) {
      setInventories(res.data);
    }
    setLoading(false);
  };

  const handleCreateInventory = async () => {
    const res = await window.api.inventory.create({
      nom: createForm.nom,
      description: createForm.description,
      warehouseId: createForm.warehouseId ? parseInt(createForm.warehouseId) : undefined
    });
    if (res.success) {
      fetchInventories();
      setCreateDialogOpen(false);
      setCreateForm({ nom: '', description: '', warehouseId: '' });
    }
  };

  const handleStartInventory = async (inventory: Inventory) => {
    const res = await window.api.inventory.start(inventory.id);
    if (res.success) {
      fetchInventories();
    }
  };

  const handleCompleteInventory = async (inventory: Inventory) => {
    const res = await window.api.inventory.complete(inventory.id);
    if (res.success) {
      fetchInventories();
    }
  };

  const handleCancelInventory = async (inventory: Inventory) => {
    const res = await window.api.inventory.cancel(inventory.id);
    if (res.success) {
      fetchInventories();
    }
  };

  const handleScanProduct = async () => {
    if (!searchBarcode.trim()) return;

    const res = await window.api.inventory.findByBarcode(searchBarcode);
    if (res.success && selectedInventory) {
      const stock = res.data;
      const existingLine = selectedInventory.lines?.find(line => line.stockId === stock.id);

      if (existingLine) {
        setCurrentLine(existingLine);
        setCountedQty(existingLine.countedQty?.toString() || '');
        setNotes(existingLine.notes || '');
      } else {
        // Create new line if not exists
        const newLine: InventoryLine = {
          id: Date.now(), // Temporary ID
          stockId: stock.id,
          stock,
          expectedQty: stock.quantite
        };
        setCurrentLine(newLine);
        setCountedQty('');
        setNotes('');
      }
      setScanDialogOpen(true);
    }
  };

  const handleSaveCount = async () => {
    if (!selectedInventory || !currentLine) return;

    const qty = parseFloat(countedQty);
    if (isNaN(qty)) return;

    const res = await window.api.inventory.updateLine(
      selectedInventory.id,
      currentLine.stockId,
      qty,
      notes
    );

    if (res.success) {
      fetchInventories();
      setScanDialogOpen(false);
      setCurrentLine(null);
      setCountedQty('');
      setNotes('');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, inventory: Inventory) => {
    setAnchorEl(event.currentTarget);
    setMenuInventory(inventory);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuInventory(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Terminé';
      case 'IN_PROGRESS': return 'En cours';
      case 'CANCELLED': return 'Annulé';
      default: return 'Brouillon';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'nom',
      headerName: 'Nom',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'warehouse',
      headerName: 'Entrepôt',
      flex: 1,
      valueGetter: (_value, row) => row.warehouse?.nom || 'Tous',
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          size="small"
          color={getStatusColor(params.value)}
        />
      )
    },
    {
      field: 'progress',
      headerName: 'Progression',
      width: 150,
      renderCell: (params) => {
        const total = params.row.lines?.length || 0;
        const counted = params.row.lines?.filter((line: InventoryLine) => line.countedQty !== null).length || 0;
        const percentage = total > 0 ? (counted / total) * 100 : 0;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ flex: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" sx={{ minWidth: 35 }}>
              {counted}/{total}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'startedAt',
      headerName: 'Début',
      width: 120,
      valueGetter: (_value, row) => row.startedAt ? new Date(row.startedAt).toLocaleDateString() : '-'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row)}
        >
          <MoreVertIcon />
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
              Inventaire Périodique
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Gestion des sessions d'inventaire avec scan de codes-barres
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Nouvelle Session
          </Button>
        </Box>

        {/* Quick Scan Section */}
        {inventories.some(inv => inv.status === 'IN_PROGRESS') && (
          <Card sx={{ mb: 3, background: alpha('#3b82f6', 0.05) }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScannerIcon />
                Scan Rapide
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Code-barres ou référence"
                    value={searchBarcode}
                    onChange={(e) => setSearchBarcode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScanProduct()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleScanProduct} disabled={!searchBarcode.trim()}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CameraIcon />}
                    onClick={() => {/* Camera scanning would go here */}}
                  >
                    Scanner Caméra
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <DataTable rows={inventories} columns={columns} loading={loading} />

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {menuInventory?.status === 'DRAFT' && (
            <MenuItem onClick={() => { handleStartInventory(menuInventory); handleMenuClose(); }}>
              <ListItemIcon>
                <PlayIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Démarrer</ListItemText>
            </MenuItem>
          )}
          {menuInventory?.status === 'IN_PROGRESS' && (
            <MenuItem onClick={() => { handleCompleteInventory(menuInventory); handleMenuClose(); }}>
              <ListItemIcon>
                <StopIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Terminer</ListItemText>
            </MenuItem>
          )}
          {(menuInventory?.status === 'DRAFT' || menuInventory?.status === 'IN_PROGRESS') && (
            <MenuItem onClick={() => { handleCancelInventory(menuInventory); handleMenuClose(); }}>
              <ListItemIcon>
                <CancelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Annuler</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={() => { setSelectedInventory(menuInventory); setReportDialogOpen(true); handleMenuClose(); }}>
            <ListItemIcon>
              <ReportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rapport</ListItemText>
          </MenuItem>
        </Menu>

        {/* Create Inventory Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Nouvelle Session d'Inventaire</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nom de la session"
              margin="normal"
              value={createForm.nom}
              onChange={(e) => setCreateForm({ ...createForm, nom: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description (optionnel)"
              margin="normal"
              multiline
              rows={3}
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="ID Entrepôt (optionnel)"
              margin="normal"
              type="number"
              value={createForm.warehouseId}
              onChange={(e) => setCreateForm({ ...createForm, warehouseId: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateInventory} variant="contained" disabled={!createForm.nom.trim()}>
              Créer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Scan/Count Dialog */}
        <Dialog
          open={scanDialogOpen}
          onClose={() => setScanDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Comptage Produit</DialogTitle>
          <DialogContent>
            {currentLine?.stock && (
              <Box sx={{ mb: 3, p: 2, borderRadius: 2, background: alpha('#3b82f6', 0.05) }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {currentLine.stock.reference?.parfum?.nom}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label={currentLine.stock.reference?.referenceCode} size="small" />
                  <Chip label={currentLine.stock.reference?.fournisseur?.nom} size="small" color="primary" />
                </Stack>
                <Typography variant="body2">
                  Quantité attendue: <strong>{currentLine.expectedQty}</strong> {currentLine.stock.reference?.unite}
                </Typography>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Quantité comptée"
                  type="number"
                  value={countedQty}
                  onChange={(e) => setCountedQty(e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Différence"
                  value={countedQty ? (parseFloat(countedQty) - (currentLine?.expectedQty || 0)).toFixed(2) : ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Notes (optionnel)"
                  multiline
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScanDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveCount} variant="contained" disabled={!countedQty}>
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Report Dialog */}
        <Dialog
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Rapport d'Inventaire</DialogTitle>
          <DialogContent>
            {selectedInventory && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Session: {selectedInventory.nom}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {selectedInventory.lines?.length || 0}
                        </Typography>
                        <Typography variant="body2">Total Produits</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {selectedInventory.lines?.filter(l => l.countedQty !== null).length || 0}
                        </Typography>
                        <Typography variant="body2">Comptés</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          {selectedInventory.lines?.filter(l => l.difference !== 0 && l.difference !== null).length || 0}
                        </Typography>
                        <Typography variant="body2">Écarts</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color={
                          selectedInventory.lines && selectedInventory.lines.length > 0
                            ? ((selectedInventory.lines.filter(l => l.countedQty !== null).length / selectedInventory.lines.length) * 100 >= 80 ? 'success.main' : 'warning.main')
                            : 'text.secondary'
                        }>
                          {selectedInventory.lines && selectedInventory.lines.length > 0
                            ? Math.round((selectedInventory.lines.filter(l => l.countedQty !== null).length / selectedInventory.lines.length) * 100)
                            : 0}%
                        </Typography>
                        <Typography variant="body2">Progression</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Produit</TableCell>
                        <TableCell>Référence</TableCell>
                        <TableCell align="right">Attendu</TableCell>
                        <TableCell align="right">Compté</TableCell>
                        <TableCell align="right">Écart</TableCell>
                        <TableCell>Statut</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedInventory.lines?.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell>{line.stock?.reference?.parfum?.nom}</TableCell>
                          <TableCell>{line.stock?.reference?.referenceCode}</TableCell>
                          <TableCell align="right">{line.expectedQty}</TableCell>
                          <TableCell align="right">
                            {line.countedQty !== null ? line.countedQty : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {line.difference !== undefined && line.difference !== null ? (
                              <Typography color={line.difference !== 0 ? 'error' : 'success'}>
                                {line.difference > 0 ? '+' : ''}{line.difference}
                              </Typography>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {line.countedQty !== null ? (
                              <CheckIcon color="success" />
                            ) : (
                              <ErrorIcon color="warning" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportDialogOpen(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Hidden video and canvas for camera scanning */}
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>
    </Fade>
  );
}