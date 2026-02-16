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
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  LinearProgress,
  Tooltip,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as SupplierIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  ContactPhone as ContactIcon,
  History as HistoryIcon,
  Description as DocIcon,
  Star as StarIcon,
  TrendingUp as TrendIcon,
  Event as EventIcon,
  Timer as DeliveryIcon,
  CheckCircle as ReliabilityIcon
} from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';
import { useToast } from '../hooks/useToast';
import ErrorFeedback from '../components/ErrorFeedback';

export default function FournisseursPage() {
  const { fournisseurs, loading, fetchFournisseurs } = useDataStore();
  const { darkMode } = useAppStore();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    rating: 0,
    notes: ''
  });
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = (item: any = null) => {
    setTabValue(0);
    if (item) {
      setSelected(item);
      setFormData({
        nom: item.nom,
        telephone: item.telephone || '',
        email: item.email || '',
        adresse: item.adresse || '',
        rating: item.rating || 0,
        notes: item.notes || ''
      });
    } else {
      setSelected(null);
      setFormData({
        nom: '',
        telephone: '',
        email: '',
        adresse: '',
        rating: 0,
        notes: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (selected) {
        await window.api.fournisseurs.update(selected.id, formData);
        toast('Fournisseur mis à jour', 'success');
      } else {
        await window.api.fournisseurs.create(formData);
        toast('Fournisseur créé', 'success');
      }
      fetchFournisseurs();
      handleClose();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{ fontWeight: 600, background: darkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)' }}
        />
      )
    },
    {
      field: 'nom',
      headerName: 'Nom',
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupplierIcon sx={{ opacity: 0.5, fontSize: 18 }} />
          <Typography sx={{ fontWeight: 600 }}>{params.value}</Typography>
        </Box>
      )
    },
    { field: 'telephone', headerName: 'Téléphone', flex: 1 },
    {
      field: 'reliabilityRate',
      headerName: 'Fiabilité',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ width: '100%', mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{Math.round(params.value || 100)}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={params.value || 100}
            color={(params.value || 100) > 80 ? "success" : "warning"}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )
    },
    {
      field: 'rating',
      headerName: 'Note',
      width: 120,
      renderCell: (params) => (
        <Rating value={params.value || 0} readOnly size="small" precision={0.5} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => handleOpen(params.row)}
            sx={{
              background: darkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.08)',
              '&:hover': { background: darkMode ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.15)' }
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
                background: 'linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800
              }}
            >
              Fournisseurs
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Gérez votre réseau de distribution et évaluez les performances
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}
          >
            Nouveau Fournisseur
          </Button>
        </Box>

        <ErrorFeedback error={error} onClose={() => setError(null)} />
        <DataTable rows={fournisseurs} columns={columns} loading={loading} />

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)'
                : '#fff',
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{
            pb: 0,
            pt: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <SupplierIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {selected ? selected.nom : 'Nouveau Fournisseur'}
              </Typography>
              {selected && <Typography variant="caption" sx={{ opacity: 0.6 }}>ID: #{selected.id}</Typography>}
            </Box>
          </DialogTitle>

          <Box sx={{ px: 3, mt: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab icon={<SupplierIcon />} iconPosition="start" label="Informations" />
              <Tab icon={<ContactIcon />} iconPosition="start" label="Contacts" disabled={!selected} />
              <Tab icon={<HistoryIcon />} iconPosition="start" label="Commandes" disabled={!selected} />
              <Tab icon={<DocIcon />} iconPosition="start" label="Documents" disabled={!selected} />
            </Tabs>
          </Box>

          <DialogContent sx={{ pt: 3, minHeight: 450 }}>
            {tabValue === 0 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                <Box sx={{ gridColumn: 'span 8' }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Nom de l'entreprise"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, opacity: 0.5 }} /> }}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, opacity: 0.5 }} /> }}
                      />
                    </Stack>
                    <TextField
                      fullWidth
                      label="Adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      InputProps={{ startAdornment: <BusinessIcon sx={{ mr: 1, opacity: 0.5 }} /> }}
                    />
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </Stack>
                </Box>

                <Box sx={{ gridColumn: 'span 4' }}>
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} /> Évaluation
                      </Typography>
                      <Rating
                        value={formData.rating}
                        onChange={(_, val) => setFormData({ ...formData, rating: val || 0 })}
                        precision={0.5}
                      />
                    </Box>

                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReliabilityIcon sx={{ color: '#10b981', fontSize: 18 }} /> Taux de Fiabilité
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
                        {selected?.reliabilityRate ? Math.round(selected.reliabilityRate) : 100}%
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6 }}>Basé sur les livraisons passées</Typography>
                    </Box>

                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeliveryIcon sx={{ color: '#3b82f6', fontSize: 18 }} /> Délai Moyen
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#3b82f6' }}>
                        {selected?.avgDeliveryTime ? Math.round(selected.avgDeliveryTime) : '--'} j
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6 }}>Délai de livraison moyen</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Gestion des contacts</Typography>
                  <Button startIcon={<AddIcon />} variant="outlined" size="small">Nouveau Contact</Button>
                </Box>
                <List>
                  {selected?.contacts && selected.contacts.length > 0 ? (
                    selected.contacts.map((c: any) => (
                      <ListItem key={c.id} sx={{ mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <ListItemIcon><ContactIcon /></ListItemIcon>
                        <ListItemText
                          primary={c.nom}
                          secondary={`${c.fonction || ''} • ${c.telephone || ''} • ${c.email || ''}`}
                        />
                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
                      <ContactIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>Aucun contact enregistré</Typography>
                    </Box>
                  )}
                </List>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Historique des commandes d'achat</Typography>
                <List>
                  {selected?.purchaseOrders && selected.purchaseOrders.length > 0 ? (
                    selected.purchaseOrders.map((o: any) => (
                      <ListItem key={o.id} sx={{ mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText
                          primary={`Commande #${o.id} - ${o.totalAmount.toLocaleString()} DZD`}
                          secondary={`${new Date(o.createdAt).toLocaleDateString()} • Statut: ${o.status}`}
                        />
                        <Chip label={o.status} size="small" color={o.status === 'RECEIVED' ? 'success' : 'warning'} variant="outlined" />
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
                      <HistoryIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>Aucune commande enregistrée</Typography>
                    </Box>
                  )}
                </List>
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Documents contractuels</Typography>
                  <Button startIcon={<DocIcon />} variant="outlined" size="small">Upload Document</Button>
                </Box>
                <List>
                  {selected?.documents && selected.documents.length > 0 ? (
                    selected.documents.map((d: any) => (
                      <ListItem key={d.id} sx={{ mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <ListItemIcon><DocIcon /></ListItemIcon>
                        <ListItemText
                          primary={d.nom}
                          secondary={`Type: ${d.type || 'Non spécifié'} • Ajouté le ${new Date(d.createdAt).toLocaleDateString()}`}
                        />
                        <Button variant="text" size="small">Voir</Button>
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
                      <DocIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>Aucun document attaché</Typography>
                    </Box>
                  )}
                </List>
              </Box>
            )}
          </DialogContent>

          <Divider />
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Annuler</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                px: 4,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
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

