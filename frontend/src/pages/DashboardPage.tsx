import React, { useEffect } from 'react';
import Tooltip from '../components/Tooltip';
import useTooltip from '../hooks/useTooltip';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Stack,
  Fade
} from '@mui/material';
import {
  Opacity as ParfumIcon,
  Inventory as ReferenceIcon,
  LocalShipping as SupplierIcon,
  People as ClientIcon,
  Storage as StockIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';

export default function DashboardPage() {
  const { darkMode } = useAppStore();
  const { getTooltip } = useTooltip();
  const {
    parfums,
    fournisseurs,
    clients,
    references,
    stock,
    fetchParfums,
    fetchFournisseurs,
    fetchClients,
    fetchReferences,
    fetchStock
  } = useDataStore();

  useEffect(() => {
    // Fetch all data for dashboard statistics
    fetchParfums();
    fetchFournisseurs();
    fetchClients();
    fetchReferences();
    fetchStock();
  }, []);

  // Calculate statistics
  const totalParfums = parfums.length;
  const totalReferences = references.length;
  const totalFournisseurs = fournisseurs.length;
  const totalClients = clients.length;

  // Calculate stock statistics
  const totalStockQuantity = stock.reduce((sum, item) => sum + item.quantite, 0);
  const lowStockItems = stock.filter(item => item.quantite < 10 && item.quantite > 0).length;
  const outOfStockItems = stock.filter(item => item.quantite === 0).length;

  // Calculate stock value (assuming price is per kg and we have kg quantities)
  const totalStockValue = references.reduce((sum, ref) => {
    const stockItem = stock.find(s => s.parfumReferenceId === ref.id);
    if (stockItem && stockItem.quantite > 0) {
      return sum + (ref.prixUnitaire * stockItem.quantite);
    }
    return sum;
  }, 0);

  // Get top brands
  const brandStats = parfums.reduce((acc, parfum) => {
    acc[parfum.marque] = (acc[parfum.marque] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBrands = Object.entries(brandStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const statsCards = [
    {
      title: 'Total Parfums',
      value: totalParfums,
      icon: <ParfumIcon />,
      color: '#ec4899',
      subtitle: 'Produits uniques'
    },
    {
      title: 'Total Références',
      value: totalReferences,
      icon: <ReferenceIcon />,
      color: '#8b5cf6',
      subtitle: 'Variantes disponibles'
    },
    {
      title: 'Fournisseurs',
      value: totalFournisseurs,
      icon: <SupplierIcon />,
      color: '#f59e0b',
      subtitle: 'Partenaires actifs'
    },
    {
      title: 'Clients',
      value: totalClients,
      icon: <ClientIcon />,
      color: '#10b981',
      subtitle: 'Base clientèle'
    },
    {
      title: 'Stock Total',
      value: `${totalStockQuantity.toFixed(1)} kg`,
      icon: <StockIcon />,
      color: '#3b82f6',
      subtitle: 'Quantité en stock'
    },
    {
      title: 'Valeur Stock',
      value: `${totalStockValue.toLocaleString()} DZD`,
      icon: <AssessmentIcon />,
      color: '#06b6d4',
      subtitle: 'Valeur totale'
    }
  ];

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: darkMode
                ? 'linear-gradient(135deg, #f472b6 0%, #c084fc 100%)'
                : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Tableau de Bord
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7, mb: 3 }}>
            Vue d'ensemble de votre gestion de stock de parfums
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={card.title}>
              <Fade in={true} timeout={600 + index * 100}>
                <Tooltip
                  title={getTooltip('dashboard.description') + ' — ' + card.title}
                  placement="top"
                  delay={400}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: darkMode
                        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      boxShadow: darkMode
                        ? '0 20px 60px rgba(0,0,0,0.3)'
                        : '0 20px 60px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: darkMode
                          ? '0 20px 60px rgba(0,0,0,0.4)'
                          : '0 20px 60px rgba(0,0,0,0.12)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${card.color}15`,
                            color: card.color,
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          {card.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: card.color }}>
                            {card.value}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            {card.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>
                        {card.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Tooltip>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Alerts and Quick Stats */}
        <Grid container spacing={3}>
          {/* Stock Alerts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: darkMode
                  ? '0 20px 60px rgba(0,0,0,0.3)'
                  : '0 20px 60px rgba(0,0,0,0.08)',
                height: '100%'
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>
                  Alertes de Stock
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#f59e0b' }}>
                        Stock Faible ({lowStockItems})
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f59e0b' }}>
                        {lowStockItems > 0 ? `${((lowStockItems / totalStockQuantity) * 100).toFixed(1)}%` : '0%'}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={lowStockItems > 0 ? (lowStockItems / totalStockQuantity) * 100 : 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: darkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#f59e0b',
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#ef4444' }}>
                        Rupture de Stock ({outOfStockItems})
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ef4444' }}>
                        {outOfStockItems > 0 ? `${((outOfStockItems / totalStockQuantity) * 100).toFixed(1)}%` : '0%'}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={outOfStockItems > 0 ? (outOfStockItems / totalStockQuantity) * 100 : 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#ef4444',
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Brands */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: darkMode
                  ? '0 20px 60px rgba(0,0,0,0.3)'
                  : '0 20px 60px rgba(0,0,0,0.08)',
                height: '100%'
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>
                  Top Marques
                </Typography>
                <Stack spacing={1.5}>
                  {topBrands.map(([brand, count], index) => (
                    <Box
                      key={brand}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          sx={{
                            mr: 2,
                            bgcolor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(99, 102, 241, 0.1)',
                            color: index === 0 ? '#000' : index === 1 ? '#000' : index === 2 ? '#000' : '#6366f1',
                            fontWeight: 600
                          }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {brand}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {count} parfum{count > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
