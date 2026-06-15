import React from 'react';
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { muiToastService } from './muiToastService.js';
import './MuiToastContainer.css';

const MuiToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = muiToastService.subscribe((toast) => {
      if (toast.action === 'close') {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      } else if (toast.action === 'clear') {
        setToasts([]);
      } else if (toast.action === 'update') {
        setToasts(prev => prev.map(t => 
          t.id === toast.id ? { ...t, ...toast } : t
        ));
      } else {
        setToasts(prev => [...prev, toast]);
        
        // Auto-remove after duration (if not persistent)
        if (toast.duration > 0) {
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
          }, toast.duration);
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleClose = (toastId) => (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration > 0 ? toast.duration : null}
          onClose={handleClose(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ 
            top: `${24 + index * 80}px`,
            bottom: 'auto',
            right: '24px',
            zIndex: 9999
          }}
        >
          <Alert
            variant="outlined"
            severity={toast.severity}
            onClose={handleClose(toast.id)}
            sx={{
              width: '360px',
              maxWidth: 'calc(100vw - 48px)',
              background: 'linear-gradient(135deg, rgba(0, 30, 30, 0.95) 0%, rgba(0, 10, 10, 0.95) 100%) !important',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid !important',
              borderColor: toast.severity === 'error' ? 'rgba(239, 68, 68, 0.8) !important' :
                           toast.severity === 'warning' ? 'rgba(245, 158, 11, 0.8) !important' :
                           'rgba(195, 143, 33, 0.85) !important', // Gold border for success, info & loading!
              boxShadow: toast.severity === 'error' ? '0 8px 32px rgba(239, 68, 68, 0.2), 0 0 15px rgba(239, 68, 68, 0.1)' :
                         toast.severity === 'warning' ? '0 8px 32px rgba(245, 158, 11, 0.2), 0 0 15px rgba(245, 158, 11, 0.1)' :
                         '0 8px 32px rgba(195, 143, 33, 0.3), 0 0 20px rgba(195, 143, 33, 0.15)', // Premium Gold glow!
              color: '#ffffff',
              fontSize: '14px',
              padding: '14px 18px',
              alignItems: 'center',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: toast.severity === 'error' ? '0 12px 40px rgba(239, 68, 68, 0.3)' :
                           toast.severity === 'warning' ? '0 12px 40px rgba(245, 158, 11, 0.3)' :
                           '0 12px 40px rgba(195, 143, 33, 0.45)',
              },
              '& .MuiAlert-icon': {
                color: toast.severity === 'error' ? '#ef4444 !important' :
                       toast.severity === 'warning' ? '#f59e0b !important' :
                       '#ffe066 !important', // Premium Gold icons!
                fontSize: '24px',
                marginRight: '12px',
              },
              '& .MuiAlert-message': {
                color: '#ffffff',
                padding: '4px 0',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.02em',
              },
              '& .MuiAlert-action': {
                color: 'rgba(255, 255, 255, 0.7)',
                padding: 0,
                marginRight: '-4px',
                marginLeft: '8px',
              },
              '& .MuiIconButton-root': {
                color: 'rgba(195, 143, 33, 0.85)', // Gold close button!
                padding: '6px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#ffe066',
                  transform: 'rotate(90deg) scale(1.15)',
                  background: 'rgba(195, 143, 33, 0.15)',
                }
              },
            }}
            icon={toast.loading ? (
              <CircularProgress size={20} sx={{ color: '#ffe066' }} /> // Gold loading spinner!
            ) : toast.icon ? (
              <Box sx={{ fontSize: '22px', display: 'flex', alignItems: 'center' }}>
                {toast.icon}
              </Box>
            ) : undefined}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default MuiToastContainer;
