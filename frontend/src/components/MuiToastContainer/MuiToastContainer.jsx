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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          style={{ 
            bottom: `${16 + index * 72}px`,
            zIndex: 9999
          }}
        >
          <Alert
            variant="outlined"
            severity={toast.severity}
            onClose={handleClose(toast.id)}
            sx={{
              width: '360px',
              maxWidth: 'calc(100vw - 32px)',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid',
              borderColor: toast.severity === 'success' ? 'success.main' :
                           toast.severity === 'error' ? 'error.main' :
                           toast.severity === 'warning' ? 'warning.main' :
                           'info.main',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              fontSize: '14px',
              padding: '12px 16px',
              alignItems: 'center',
              borderRadius: '4px',
              '& .MuiAlert-icon': {
                color: toast.severity === 'success' ? '#4caf50' :
                       toast.severity === 'error' ? '#f44336' :
                       toast.severity === 'warning' ? '#ff9800' :
                       '#2196f3',
                fontSize: '22px',
                marginRight: '12px',
              },
              '& .MuiAlert-message': {
                color: '#ffffff',
                padding: '6px 0',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 400,
              },
              '& .MuiAlert-action': {
                color: 'rgba(255, 255, 255, 0.7)',
                padding: 0,
                marginRight: '-4px',
                marginLeft: '8px',
              },
              '& .MuiIconButton-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '4px',
                '&:hover': {
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)',
                }
              },
            }}
            icon={toast.loading ? (
              <CircularProgress size={20} sx={{ color: '#2196f3' }} />
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
