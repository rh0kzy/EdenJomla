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
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Inventory as InventoryIcon,
  UploadFile as UploadIcon,
  ShoppingCart as OrdersIcon
} from '@mui/icons-material';
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
  const [openImport, setOpenImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [selectedRef, setSelectedRef] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    parfumId: '', 
    fournisseurId: '', 
    referenceCode: '', 
    unite: 'GRAMME', 
    prixUnitaire: 0,
    prixPar100g: undefined as number | undefined,
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
        prixUnitaire: ref.prixUnitaire,
        prixPar100g: ref.prixPar100g ?? undefined,
      });
    } else {
      setSelectedRef(null);
      setFormData({ 
        parfumId: '', 
        fournisseurId: '', 
        referenceCode: '', 
        unite: 'GRAMME', 
        prixUnitaire: 0,
        prixPar100g: undefined,
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importData);
      if (!Array.isArray(parsed)) throw new Error('Format invalide: un tableau est attendu');
      
      const response = await window.api.references.import(parsed);
      if (response.success) {
        fetchReferences();
        setOpenImport(false);
        setImportData('');
      } else {
        alert(response.error);
      }
    } catch (e: any) {
      alert('Erreur: ' + e.message);
    }
  };

  const handleSubmit = async () => {
    const data = {
      ...formData,
      parfumId: parseInt(formData.parfumId as string),
      fournisseurId: parseInt(formData.fournisseurId as string),
      prixUnitaire: parseFloat(formData.prixUnitaire as any),
      prixPar100g: formData.prixPar100g,
    };

    if (selectedRef) {
      await window.api.references.update(selectedRef.id, data);
      if (data.prixPar100g !== undefined && data.prixPar100g !== null) {
        await window.api.references.setPricePer100g(selectedRef.id, data.prixPar100g);
      }
    } else {
      await window.api.references.create(data as any);
      // newly created reference: try to set prixPar100g if provided by calling setPricePer100g on returned id is skipped here for brevity
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
      field: 'prixPar100g',
      headerName: 'Prix /100g',
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, color: '#f59e0b' }}>
          {params.value ? `${params.value} DH` : '-'}
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
          <IconButton size="small" onClick={async () => {
            // open price history dialog
            setHistoryReferenceId(params.row.id);
            setOpenHistory(true);
          }} sx={{ background: darkMode ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)' }}>
            <InventoryIcon fontSize="small" sx={{ color: '#6366f1' }} />
          </IconButton>
          <IconButton size="small" onClick={async () => {
            setTiersReferenceId(params.row.id);
            setOpenTiers(true);
          }} sx={{ background: darkMode ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.06)' }}>
            <EditIcon fontSize="small" sx={{ color: '#10b981' }} />
          </IconButton>
          <IconButton size="small" onClick={async () => {
            setOrderRefId(params.row.id);
            setOpenOrders(true);
          }} sx={{ background: darkMode ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.06)' }}>
            <OrdersIcon fontSize="small" sx={{ color: '#f59e0b' }} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // Order history dialog state
  const [openOrders, setOpenOrders] = useState(false);
  const [orderRefId, setOrderRefId] = useState<number | null>(null);
  const [orderHistory, setOrderHistory] = useState<{ purchases: any[], sales: any[] }>({ purchases: [], sales: [] });

  // Price history dialog state
  const [openHistory, setOpenHistory] = useState(false);
  const [historyReferenceId, setHistoryReferenceId] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  // Price tiers dialog state
  const [openTiers, setOpenTiers] = useState(false);
  const [tiersReferenceId, setTiersReferenceId] = useState<number | null>(null);
  const [priceTiers, setPriceTiers] = useState<any[]>([]);

  useEffect(() => {
    if (openHistory && historyReferenceId) {
      window.api.references.getPriceHistory(historyReferenceId, 50).then((res) => {
        if (res.success) setPriceHistory(res.data || []);
      });
    }
  }, [openHistory, historyReferenceId]);

  useEffect(() => {
    if (openTiers && tiersReferenceId) {
      window.api.references.getPriceTiers(tiersReferenceId).then((res) => {
        if (res.success) setPriceTiers(res.data || []);
      });
    }
  }, [openTiers, tiersReferenceId]);

  useEffect(() => {
    if (openOrders && orderRefId) {
      window.api.references.getOrderHistory(orderRefId).then((res) => {
        if (res.success) setOrderHistory(res.data);
      });
    }
  }, [openOrders, orderRefId]);

  const saveTiers = async () => {
    if (!tiersReferenceId) return;
    // map tiers to expected payload
    const payload = priceTiers.map((t) => ({ minQty: Number(t.minQty), maxQty: t.maxQty === null ? undefined : (t.maxQty !== undefined ? Number(t.maxQty) : undefined), price: Number(t.price) }));
    const res = await window.api.references.setPriceTiers(tiersReferenceId, payload);
    if (res.success) {
      setOpenTiers(false);
    }
  };

  const computePrixPar100g = () => {
    const unit = formData.unite;
    const pu = Number(formData.prixUnitaire) || 0;
    let result = undefined as number | undefined;
    if (unit === 'GRAMME') {
      result = pu * 100;
    } else if (unit === 'KILOGRAMME') {
      result = pu * 0.1; // 100g is 0.1 kg
    }
    setFormData({ ...formData, prixPar100g: result });
  };

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
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setOpenImport(true)}
              sx={{ borderRadius: 2 }}
            >
              Import Auto
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => handleOpen()}
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Nouvelle Référence
            </Button>
          </Stack>
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

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                label="Prix /100g"
                type="number"
                value={formData.prixPar100g ?? ''}
                onChange={(e) => setFormData({ ...formData, prixPar100g: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                sx={{ flex: 1 }}
              />
              <Button onClick={computePrixPar100g} variant="outlined">Calc</Button>
            </Box>
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
        {/* Price History Dialog */}
        <Dialog open={openHistory} onClose={() => setOpenHistory(false)} fullWidth maxWidth="sm">
          <DialogTitle>Historique Prix</DialogTitle>
          <DialogContent>
            {priceHistory.length === 0 ? (
              <Typography sx={{ py: 2 }}>Aucun historique.</Typography>
            ) : (
              priceHistory.map((h) => (
                <Box key={h.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{h.oldPrice} → {h.newPrice} DH</Typography>
                    <Typography variant="caption">{h.reason || ''}</Typography>
                  </Box>
                  <Typography variant="caption">{new Date(h.createdAt).toLocaleString()}</Typography>
                </Box>
              ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHistory(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Order History Dialog */}
        <Dialog open={openOrders} onClose={() => setOpenOrders(false)} fullWidth maxWidth="md">
          <DialogTitle>Historique des Commandes</DialogTitle>
          <DialogContent>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Achats (Fournisseurs)</Typography>
            {orderHistory.purchases.length === 0 ? (
              <Typography variant="body2" sx={{ opacity: 0.6 }}>Aucun achat enregistré.</Typography>
            ) : (
              <Stack spacing={1}>
                {orderHistory.purchases.map((p) => (
                  <Box key={p.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{p.party}</Typography>
                      <Typography variant="caption">{new Date(p.date).toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 600, color: '#10b981' }}>{p.quantity} unités @ {p.price} DH</Typography>
                      <Chip label={p.status} size="small" variant="outlined" />
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}

            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Ventes (Clients)</Typography>
            {orderHistory.sales.length === 0 ? (
              <Typography variant="body2" sx={{ opacity: 0.6 }}>Aucune vente enregistrée.</Typography>
            ) : (
              <Stack spacing={1}>
                {orderHistory.sales.map((s) => (
                  <Box key={s.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{s.party}</Typography>
                      <Typography variant="caption">{new Date(s.date).toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 600, color: '#6366f1' }}>{s.quantity} unités @ {s.price} DH</Typography>
                      <Chip label={s.status} size="small" variant="outlined" />
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenOrders(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Price Tiers Dialog */}
        <Dialog open={openTiers} onClose={() => setOpenTiers(false)} fullWidth maxWidth="sm">
          <DialogTitle>Tarifs Dégressifs</DialogTitle>
          <DialogContent>
            {priceTiers.map((t, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 1 }}>
                <TextField label="Min Qty" type="number" value={t.minQty} onChange={(e) => { const v = Number(e.target.value); setPriceTiers((old) => { const copy = [...old]; copy[idx].minQty = v; return copy; }); }} sx={{ width: 100 }} />
                <TextField label="Max Qty" type="number" value={t.maxQty ?? ''} onChange={(e) => { const v = e.target.value === '' ? null : Number(e.target.value); setPriceTiers((old) => { const copy = [...old]; copy[idx].maxQty = v; return copy; }); }} sx={{ width: 100 }} />
                <TextField label="Price" type="number" value={t.price} onChange={(e) => { const v = Number(e.target.value); setPriceTiers((old) => { const copy = [...old]; copy[idx].price = v; return copy; }); }} sx={{ width: 140 }} />
                <IconButton onClick={() => setPriceTiers((old) => old.filter((_, i) => i !== idx))}><DeleteIcon /></IconButton>
              </Box>
            ))}

            <Button onClick={() => setPriceTiers((old) => [...old, { minQty: 1, maxQty: null, price: 0 }])} startIcon={<AddIcon />}>Ajouter palier</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTiers(false)}>Annuler</Button>
            <Button onClick={saveTiers} variant="contained">Enregistrer</Button>
          </DialogActions>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={openImport} onClose={() => setOpenImport(false)} fullWidth maxWidth="sm">
          <DialogTitle>Import Automatique des Références</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
              Collez le JSON des références ici. Le format doit être un tableau d'objets :
              {'[{"referenceCode": "...", "parfumId": 1, "fournisseurId": 1, "prixUnitaire": 50, ...}]'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              placeholder='[{"referenceCode": "REF001", "parfumId": 1, ...}]'
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              sx={{ fontFamily: 'monospace' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenImport(false)}>Annuler</Button>
            <Button onClick={handleImport} variant="contained">Lancer l'Import</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}
