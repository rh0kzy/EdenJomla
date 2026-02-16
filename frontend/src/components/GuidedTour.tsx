import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  Chip,
  Stack,
  Fade
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  PlayArrow as PlayIcon,
  SkipNext as SkipIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';

interface TourStep {
  title: string;
  content: string;
  target?: string; // CSS selector
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: Record<string, TourStep[]> = {
  dashboard: [
    {
      title: 'Bienvenue dans Parfum Depot!',
      content: 'Découvrez votre tableau de bord principal avec toutes les statistiques importantes.',
      placement: 'bottom'
    },
    {
      title: 'Navigation',
      content: 'Utilisez la barre latérale pour naviguer entre les différentes sections.',
      target: '[data-tour="sidebar"]',
      placement: 'right'
    },
    {
      title: 'Recherche Globale',
      content: 'Recherchez rapidement dans toute l\'application avec Ctrl+K.',
      target: '[data-tour="global-search"]',
      placement: 'bottom'
    },
    {
      title: 'Aide Contextuelle',
      content: 'Cliquez sur le bouton ? pour obtenir de l\'aide sur n\'importe quelle page.',
      target: '[data-tour="help-button"]',
      placement: 'bottom'
    }
  ],
  parfums: [
    {
      title: 'Gestion des Parfums',
      content: 'Ajoutez, modifiez et supprimez vos parfums facilement.',
      placement: 'bottom'
    },
    {
      title: 'Recherche Avancée',
      content: 'Utilisez les filtres pour trouver rapidement vos parfums.',
      target: '[data-tour="search-bar"]',
      placement: 'bottom'
    },
    {
      title: 'Actions Rapides',
      content: 'Clic droit sur une ligne pour accéder aux actions rapides.',
      target: '[data-tour="data-table"]',
      placement: 'top'
    },
    {
      title: 'Nouveau Parfum',
      content: 'Cliquez ici pour ajouter un nouveau parfum à votre catalogue.',
      target: '[data-tour="add-button"]',
      placement: 'bottom'
    }
  ]
};

interface GuidedTourProps {
  page: string;
  open: boolean;
  onClose: () => void;
}

export default function GuidedTour({ page, open, onClose }: GuidedTourProps) {
  const { darkMode } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const steps = tourSteps[page] || tourSteps.dashboard;

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setCompleted(new Set());
    }
  }, [open]);

  const handleNext = () => {
    setCompleted(prev => new Set([...prev, activeStep]));
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSkip = () => {
    setCompleted(new Set(steps.map((_, index) => index)));
    onClose();
  };

  const handleFinish = () => {
    setCompleted(new Set(steps.map((_, index) => index)));
    onClose();
  };

  const currentStep = steps[activeStep];

  if (!open || !currentStep) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: darkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          boxShadow: darkMode
            ? '0 25px 50px rgba(0,0,0,0.5)'
            : '0 25px 50px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle sx={{
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {currentStep.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={index} completed={completed.has(index)}>
                <StepLabel>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    Étape {index + 1}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {currentStep.content}
        </Typography>

        {currentStep.target && (
          <Box sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            border: '1px solid',
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              💡 Conseil:
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Regardez l'élément mis en évidence sur la page pour voir cette fonctionnalité en action.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={handleSkip}
          startIcon={<SkipIcon />}
          sx={{ color: 'text.secondary' }}
        >
          Passer le tour
        </Button>

        <Stack direction="row" spacing={1}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<PrevIcon />}
          >
            Précédent
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleFinish}
              variant="contained"
              startIcon={<CheckIcon />}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              Terminer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<NextIcon />}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                },
              }}
            >
              Suivant
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}