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
  Assessment as AssessmentIcon,
  ShoppingCart as SalesIcon,
  Schedule as CalendarIcon,
  Timeline as TimelineIcon
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

  // Mock data for best-selling references (will be replaced with real sales data later)
  const bestSellingReferences = references
    .map(ref => {
      const parfum = parfums.find(p => p.id === ref.parfumId);
      const stockItem = stock.find(s => s.parfumReferenceId === ref.id);
      // Mock sales calculation based on stock movement and price
      const mockSales = Math.floor(Math.random() * 50) + 10;
      return {
        ...ref,
        parfumName: parfum?.nom || 'Unknown',
        marque: parfum?.marque || 'Unknown',
        stockQuantity: stockItem?.quantite || 0,
        salesCount: mockSales,
        revenue: mockSales * ref.prixUnitaire
      };
    })
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  // Mock data for latest transactions
  const latestTransactions = [
    { id: 1, date: '2026-02-16', client: 'Ahmed Bennani', reference: 'Chanel No.5 - 100ml', quantity: 2, total: 45000, status: 'completed' },
    { id: 2, date: '2026-02-16', client: 'Fatima Alaoui', reference: 'Dior Sauvage - 50ml', quantity: 1, total: 22000, status: 'completed' },
    { id: 3, date: '2026-02-15', client: 'Karim Tazi', reference: 'Gucci Bloom - 75ml', quantity: 3, total: 67500, status: 'completed' },
    { id: 4, date: '2026-02-15', client: 'Leila Mansouri', reference: 'Yves Saint Laurent Black Opium - 30ml', quantity: 1, total: 18000, status: 'pending' },
    { id: 5, date: '2026-02-14', client: 'Omar Rachid', reference: 'Tom Ford Oud Wood - 50ml', quantity: 2, total: 52000, status: 'completed' }
  ];

  // Mock data for replenishment calendar
  const replenishmentCalendar = stock
    .filter(item => item.quantite < 10)
    .map(item => {
      const reference = references.find(r => r.id === item.parfumReferenceId);
      const parfum = parfums.find(p => p.id === reference?.parfumId);
      const daysToReorder = Math.max(0, Math.floor(Math.random() * 14) + 1); // 1-14 days
      return {
        id: item.id,
        productName: parfum?.nom || 'Unknown',
        reference: reference?.referenceCode || 'Unknown',
        currentStock: item.quantite,
        reorderPoint: 10,
        estimatedDays: daysToReorder,
        priority: item.quantite === 0 ? 'urgent' : item.quantite < 5 ? 'high' : 'medium'
      };
    })
    .sort((a, b) => {
      // Sort by priority: urgent > high > medium, then by days
      const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.estimatedDays - b.estimatedDays;
    })
    .slice(0, 6);

  // Mock data for supplier new products (Nouveautés Fournisseurs)
  const supplierNews = [
    { id: 1, fournisseur: 'Argeville', product: 'Nouveau Musc Blanc 2026', date: 'Aujourd\'hui', price: '45€/kg' },
    { id: 2, fournisseur: 'Givaudan', product: 'Essence de Rose Rare', date: 'Hier', price: '120€/kg' },
    { id: 3, fournisseur: 'Robertet', product: 'Oud Synthétique Bio', date: 'Il y a 2 jours', price: '85€/kg' },
  ];

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

        {/* Advanced Dashboard Widgets */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Best Selling References */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SalesIcon sx={{ mr: 1, color: '#10b981' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>
                    Références les Plus Vendues
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  {bestSellingReferences.map((ref, index) => (
                    <Box
                      key={ref.id}
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
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              mr: 1,
                              bgcolor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(16, 185, 129, 0.1)',
                              color: index === 0 ? '#000' : index === 1 ? '#000' : index === 2 ? '#000' : '#10b981',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                            {ref.parfumName}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                          {ref.referenceCode} • {ref.salesCount} ventes
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                        {ref.revenue.toLocaleString()} DZD
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Latest Transactions */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimelineIcon sx={{ mr: 1, color: '#f59e0b' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>
                    Dernières Transactions
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  {latestTransactions.map((transaction) => (
                    <Box
                      key={transaction.id}
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
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                            {transaction.client}
                          </Typography>
                          <Chip
                            label={transaction.status === 'completed' ? 'Terminée' : 'En attente'}
                            size="small"
                            sx={{
                              fontSize: '0.6rem',
                              height: 18,
                              bgcolor: transaction.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              color: transaction.status === 'completed' ? '#10b981' : '#f59e0b'
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                          {transaction.reference} • {transaction.quantity} unité{transaction.quantity > 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6 }}>
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b', ml: 1 }}>
                        {transaction.total.toLocaleString()} DZD
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Replenishment Calendar */}
          <Grid size={{ xs: 12, md: 12, lg: 4 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, color: '#ef4444' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>
                    Calendrier Réapprovisionnement
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  {replenishmentCalendar.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderLeft: `4px solid ${
                          item.priority === 'urgent' ? '#ef4444' :
                          item.priority === 'high' ? '#f59e0b' : '#10b981'
                        }`,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        }
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0.5 }}>
                          {item.productName}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                          {item.reference}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" sx={{ opacity: 0.6 }}>
                            Stock: {item.currentStock}kg
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.6 }}>
                            •
                          </Typography>
                          <Typography variant="caption" sx={{
                            color: item.priority === 'urgent' ? '#ef4444' :
                                   item.priority === 'high' ? '#f59e0b' : '#10b981',
                            fontWeight: 600
                          }}>
                            {item.estimatedDays} jour{item.estimatedDays > 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={
                          item.priority === 'urgent' ? 'Urgent' :
                          item.priority === 'high' ? 'Élevé' : 'Moyen'
                        }
                        size="small"
                        sx={{
                          fontSize: '0.6rem',
                          height: 18,
                          bgcolor: item.priority === 'urgent' ? 'rgba(239, 68, 68, 0.1)' :
                                  item.priority === 'high' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: item.priority === 'urgent' ? '#ef4444' :
                                 item.priority === 'high' ? '#f59e0b' : '#10b981'
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Nouveautés Fournisseurs */}
          <Grid size={{ xs: 12, md: 12, lg: 4 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SupplierIcon sx={{ mr: 1, color: '#6366f1' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>
                    Nouveautés Fournisseurs
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  {supplierNews.map((news) => (
                    <Box
                      key={news.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366f1' }}>
                          {news.fournisseur}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6 }}>
                          {news.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {news.product}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 700, color: '#10b981' }}>
                        {news.price}
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
