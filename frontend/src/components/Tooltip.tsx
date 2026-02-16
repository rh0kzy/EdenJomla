import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps, Fade } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

interface CustomTooltipProps extends Omit<TooltipProps, 'title'> {
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
}

export default function Tooltip({ 
  title, 
  placement = 'top', 
  delay = 300,
  maxWidth = 300,
  children, 
  ...props 
}: CustomTooltipProps) {
  const { darkMode } = useAppStore();

  return (
    <MuiTooltip
      title={
        <span style={{ 
          fontSize: '0.875rem',
          lineHeight: '1.4'
        }}>
          {title}
        </span>
      }
      placement={placement}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: { enter: 200, exit: 100 } }}
      enterDelay={delay}
      leaveDelay={100}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: darkMode 
              ? 'rgba(30, 41, 59, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
            color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
            fontSize: '0.875rem',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: darkMode
              ? '0 8px 24px rgba(0, 0, 0, 0.3)'
              : '0 8px 24px rgba(0, 0, 0, 0.1)',
            maxWidth,
            lineHeight: '1.4',
            fontWeight: 400,
          }
        },
        arrow: {
          sx: {
            color: darkMode 
              ? 'rgba(30, 41, 59, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
          }
        }
      }}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
}