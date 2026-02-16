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
  MenuItem,
  Tab,
  Tabs,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  EmojiEvents as PointsIcon,
  Notes as NotesIcon,
  Cake as BirthdayIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  Stars as SegmentIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';


import { GridColDef } from '@mui/x-data-grid';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import DataTable from '../components/DataTable';
import TableSkeleton from '../components/TableSkeleton';
import Tooltip from '../components/Tooltip';
import useTooltip from '../hooks/useTooltip';
import { useToast } from '../hooks/useToast';
import ErrorFeedback from '../components/ErrorFeedback';
import QRCode from 'qrcode';

export default function ClientsPage() {
  const { clients, loading, fetchClients } = useDataStore();
  const { darkMode } = useAppStore();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    segment: 'Nouveau',
    notes: '',
    anniversaire: null as string | null
  });
  const [tabValue, setTabValue] = useState(0);
  const { getTooltip } = useTooltip();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGenerateLoyaltyCard = async (client: any) => {
    try {
      const qrData = JSON.stringify({
        id: client.id,
        nom: client.nom,
        segment: client.segment,
        points: client.points,
        type: 'loyalty_card'
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#FFFFFF'
        }
      });

      const printWindow = window.open('', '_blank');
      if (printWindow) { // ... (window content)
        printWindow.document.write(`<html><head><title>Carte de Fidélité - ${client.nom}</title><style>body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f8fafc; } .card { width: 400px; padding: 30px; border-radius: 20px; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; border: 2px solid #10b981; } .header { color: #059669; font-size: 24px; font-weight: bold; margin-bottom: 20px; } .qr { margin: 20px auto; } .name { font-size: 20px; font-weight: 600; margin: 10px 0; } .segment { display: inline-block; padding: 4px 12px; border-radius: 20px; background: #10b981; color: white; font-size: 14px; margin-bottom: 10px; } .points { font-size: 18px; color: #64748b; } @media print { .no-print { display: none; } body { background: white; } .card { box-shadow: none; border: 1px solid #ddd; } }</style></head><body><div class="card"><div class="header">EDEN JOMLA</div><div class="segment">${client.segment || 'Nouveau'}</div><div class="qr"><img src="${qrCodeDataURL}" width="200"/></div><div class="name">${client.nom}</div><div class="points">${client.points} Points de Fidélité</div><div class="no-print" style="margin-top: 30px;"><button onclick="window.print()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimer la carte</button></div></div></body></html>`);
        printWindow.document.close();
      }
    } catch (e) {
      toast('Erreur lors de la génération de la carte', 'error');
    }
  };

  const handleOpen = (item: any = null) => {
    setTabValue(0);
    if (item) {
      setSelected(item);
      setFormData({
        nom: item.nom,
        telephone: item.telephone || '',
        email: item.email || '',
        segment: item.segment || 'Nouveau',
        notes: item.notes || '',
        anniversaire: item.anniversaire ? new Date(item.anniversaire).toISOString().split('T')[0] : null
      });
    } else {
      setSelected(null);
      setFormData({
        nom: '',
        telephone: '',
        email: '',
        segment: 'Nouveau',
        notes: '',
        anniversaire: null
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    setError(null);
    try {
      const dataToSave = {
        ...formData,
        anniversaire: formData.anniversaire ? new Date(formData.anniversaire) : null
      };

      if (selected) {
        await window.api.clients.update(selected.id, dataToSave);
        toast('Client modifié avec succès', 'success');
      } else {
        await window.api.clients.create(dataToSave);
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
      headerName: 'ID',
      width: 70,
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
      headerName: 'Nom',
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ opacity: 0.5, fontSize: 18 }} />
          <Typography sx={{ fontWeight: 600 }}>{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'telephone',
      headerName: 'Téléphone',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2
    },
    {
      field: 'points',
      headerName: 'Points',
      width: 90,
      renderCell: (params) => (
        <Chip
          label={`${params.value} pts`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'segment',
      headerName: 'Segment',
      width: 110,
      renderCell: (params) => {
        const colors: any = {
          'VIP': '#f59e0b',
          'Régulier': '#3b82f6',
          'Nouveau': '#10b981'
        };
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: colors[params.value] || '#64748b',
              color: 'white',
              fontWeight: 600
            }}
          />
        );
      }
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
              background: darkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.15)',
              }
            }}
          >
            <EditIcon fontSize="small" sx={{ color: '#6366f1' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleGenerateLoyaltyCard(params.row)}
            sx={{
              background: darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)',
              '&:hover': {
                background: darkMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
              }
            }}
            title="Générer Carte de Fidélité"
          >
            <QrCodeIcon fontSize="small" sx={{ color: '#10b981' }} />
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
              Gérez votre base clients et le système de fidélité
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
        {loading ? <TableSkeleton rows={8} columns={6} /> : <DataTable rows={clients} columns={columns} loading={false} />}

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{
            pb: 0,
            pt: 3,
            fontSize: '1.5rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            {selected ? (
              <>
                <PersonIcon sx={{ color: '#10b981', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{selected.nom}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>ID: #{selected.id}</Typography>
                </Box>
              </>
            ) : 'Nouveau Client'}
          </DialogTitle>

          <Box sx={{ px: 3, mt: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<PersonIcon />} iconPosition="start" label="Informations" />
              <Tab icon={<HomeIcon />} iconPosition="start" label="Adresses" disabled={!selected} />
              <Tab icon={<HistoryIcon />} iconPosition="start" label="Historique" disabled={!selected} />
            </Tabs>
          </Box>

          <DialogContent sx={{ pt: 3, minHeight: 400 }}>
            {tabValue === 0 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Nom Complet"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, opacity: 0.5 }} />
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, opacity: 0.5 }} />
                  }}
                />
                <TextField
                  fullWidth
                  label="Date d'anniversaire"
                  type="date"
                  value={formData.anniversaire || ''}
                  onChange={(e) => setFormData({ ...formData, anniversaire: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <BirthdayIcon sx={{ mr: 1, opacity: 0.5 }} />
                  }}
                />
                <TextField
                  fullWidth
                  select
                  label="Segment Client"
                  value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  InputProps={{
                    startAdornment: <SegmentIcon sx={{ mr: 1, opacity: 0.5 }} />
                  }}
                >
                  <MenuItem value="Nouveau">Nouveau</MenuItem>
                  <MenuItem value="Régulier">Régulier</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                </TextField>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <PointsIcon color="primary" />
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Points de fidélité</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{selected?.points || 0} pts</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField
                    fullWidth
                    label="Notes internes"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Préférences, allergies, historique de contact..."
                    InputProps={{
                      startAdornment: <NotesIcon sx={{ mr: 1, mt: 1, opacity: 0.5, alignSelf: 'flex-start' }} />
                    }}
                  />
                </Box>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Adresses enregistrées</Typography>
                  <Button startIcon={<AddIcon />}>Ajouter</Button>
                </Box>
                <List>
                  {selected?.adresses && selected.adresses.length > 0 ? (
                    selected.adresses.map((addr: any) => (
                      <ListItem
                        key={addr.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: addr.isDefault ? (darkMode ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.02)') : 'transparent'
                        }}
                      >
                        <ListItemIcon><HomeIcon color={addr.isDefault ? "success" : "inherit"} /></ListItemIcon>
                        <ListItemText
                          primary={`${addr.rue}, ${addr.ville}`}
                          secondary={addr.codePostal}
                        />
                        {addr.isDefault && <Chip label="Défaut" size="small" color="success" variant="outlined" />}
                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ py: 4, textAlign: 'center', opacity: 0.5 }}>
                      <HomeIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>Aucune adresse enregistrée</Typography>
                    </Box>
                  )}
                </List>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Historique des achats</Typography>
                <List>
                  {selected?.salesOrders && selected.salesOrders.length > 0 ? (
                    selected.salesOrders.map((order: any) => (
                      <ListItem
                        key={order.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 1,
                        }}
                      >
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText
                          primary={`Commande #${order.id} - ${order.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' })}`}
                          secondary={new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        />
                        <Chip
                          label={order.status}
                          size="small"
                          color={order.status === 'COMPLETED' ? "success" : "warning"}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ py: 4, textAlign: 'center', opacity: 0.5 }}>
                      <HistoryIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>Aucun achat récent trouvé</Typography>
                      <Button variant="outlined" sx={{ mt: 2 }}>Voir toutes les commandes</Button>
                    </Box>
                  )}
                </List>
              </Box>
            )}

          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleClose}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 4,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Enregistrer les modifications
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}

