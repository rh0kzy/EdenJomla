import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Fade, 
  Skeleton,
  Chip,
  alpha
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  PriceChange as PriceIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  LocalShipping as SupplierIcon
} from '@mui/icons-material';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import Tooltip from '../components/Tooltip';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactElement;
  color: string;
  tooltip: string;
}

function DashboardCard({ title, value, subtitle, icon, color, tooltip }: DashboardCardProps) {
  const { darkMode } = useAppStore();
  
  return (
    <Tooltip title={tooltip} placement="top">
      <Card 
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          background: darkMode
            ? `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`
            : `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: darkMode ? `1px solid ${alpha(color, 0.1)}` : `1px solid ${alpha(color, 0.05)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.5)} 100%)`,
          },
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: darkMode
              ? `0 12px 40px ${alpha(color, 0.2)}`
              : `0 12px 40px ${alpha(color, 0.1)}`,
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {value}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {subtitle}
              </Typography>
            </Box>
            <Box 
              sx={{ 
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              {icon}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label="Actif" 
              size="small" 
              sx={{ 
                background: `linear-gradient(135deg, ${alpha('#10b981', 0.2)} 0%, ${alpha('#10b981', 0.1)} 100%)`,
                color: '#10b981',
                fontWeight: 600,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Tooltip>
  );
}

export default function DashboardPage() {
  const { parfums, references, fournisseurs, clients, fetchParfums, fetchReferences, fetchFournisseurs, fetchClients } = useDataStore();
  const { darkMode } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchParfums(),
          fetchReferences(),
          fetchFournisseurs(),
          fetchClients()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const dashboardCards = [
    {
      title: 'Parfums',
      value: loading ? '-' : parfums.length,
      subtitle: 'En stock',
      icon: <InventoryIcon />,
      color: '#ec4899',
      tooltip: 'Nombre total de parfums disponibles en stock'
    },
    {
      title: 'Références',
      value: loading ? '-' : references.length,
      subtitle: 'Produits référencés',
      icon: <PriceIcon />,
      color: '#8b5cf6',
      tooltip: 'Nombre total de références produits dans le catalogue'
    },
    {
      title: 'Fournisseurs',
      value: loading ? '-' : fournisseurs.length,
      subtitle: 'Partenaires',
      icon: <SupplierIcon />,
      color: '#f59e0b',
      tooltip: 'Nombre de fournisseurs enregistrés dans le système'
    },
    {
      title: 'Clients',
      value: loading ? '-' : clients.length,
      subtitle: 'Actifs',
      icon: <PeopleIcon />,
      color: '#10b981',
      tooltip: 'Nombre total de clients dans la base de données'
    },
  ];

  return (
    <Fade in timeout={500}>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 1,
              fontWeight: 800,
              background: darkMode
                ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
                : 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Tableau de Bord
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7, maxWidth: 600 }}>
            Vue d'ensemble de votre activité et statistiques clés pour une gestion optimale de votre inventaire
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              {loading ? (
                <Card elevation={0} sx={{ p: 3, height: '100%' }}>
                  <Skeleton variant="rectangular" width="100%" height={120} />
                </Card>
              ) : (
                <DashboardCard {...card} />
              )}
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Vue Rapide
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Tooltip title="Parfums nécessitant une attention particulière">
                <Card 
                  elevation={0}
                  sx={{
                    p: 3,
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <WarningIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Surveillance Requise
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Aucun produit en rupture de stock
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={6}>
              <Tooltip title="Performance et tendances récentes">
                <Card 
                  elevation={0}
                  sx={{
                    p: 3,
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.02) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <TrendingIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Performance
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Système opérationnel et stable
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fade>
  );
}