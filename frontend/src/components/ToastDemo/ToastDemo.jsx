import React from 'react';
import { toast } from '../../utils/notifications.js';
import './ToastDemo.css';

const ToastDemo = () => {
  return (
    <div className="toast-demo">
      <h2>Toast Notification System Demo</h2>
      
      <div className="demo-section">
        <h3>Basic Notifications</h3>
        <div className="button-grid">
          <button 
            className="btn btn-success" 
            onClick={() => toast.success('Operation completed successfully!')}
          >
            Success Toast
          </button>
          
          <button 
            className="btn btn-error" 
            onClick={() => toast.error('Something went wrong!')}
          >
            Error Toast
          </button>
          
          <button 
            className="btn btn-warning" 
            onClick={() => toast.warning('This is a warning message')}
          >
            Warning Toast
          </button>
          
          <button 
            className="btn btn-info" 
            onClick={() => toast.info('Here is some helpful information')}
          >
            Info Toast
          </button>
          
          <button 
            className="btn btn-loading" 
            onClick={() => {
              const id = toast.loading('Loading...');
              setTimeout(() => toast.dismiss(id), 3000);
            }}
          >
            Loading Toast
          </button>
        </div>
      </div>

      <div className="demo-section">
        <h3>Server Connection Notifications</h3>
        <div className="button-grid">
          <button 
            className="btn btn-connecting" 
            onClick={() => toast.serverConnecting('Connecting to server...')}
          >
            Server Connecting
          </button>
          
          <button 
            className="btn btn-connected" 
            onClick={() => toast.serverConnected('Connected to server!')}
          >
            Server Connected
          </button>
          
          <button 
            className="btn btn-disconnected" 
            onClick={() => toast.serverDisconnected('Connection lost')}
          >
            Server Disconnected
          </button>
          
          <button 
            className="btn btn-server-error" 
            onClick={() => toast.serverError('Server error occurred')}
          >
            Server Error
          </button>
        </div>
      </div>

      <div className="demo-section">
        <h3>API Operations</h3>
        <div className="button-grid">
          <button 
            className="btn btn-api" 
            onClick={() => {
              const id = toast.apiRequest('Making API request...');
              setTimeout(() => {
                toast.dismiss(id);
                toast.apiSuccess('API request completed!');
              }, 2000);
            }}
          >
            API Request Success
          </button>
          
          <button 
            className="btn" 
            onClick={() => toast.copied('Link copied to clipboard!')}
          >
            Copy to Clipboard
          </button>
          
          <button 
            className="btn btn-clear" 
            onClick={() => toast.clear()}
          >
            Clear All Notifications
          </button>
        </div>
      </div>

      <div className="demo-info">
        <h3>Features</h3>
        <ul>
          <li>Professional SVG icons for all notification types</li>
          <li>Auto-dismiss with configurable duration</li>
          <li>Manual dismiss capability</li>
          <li>Server connection monitoring</li>
          <li>Responsive design for mobile and desktop</li>
          <li>Dark mode support</li>
          <li>Accessibility features</li>
          <li>API integration with automatic loading states</li>
        </ul>
      </div>
    </div>
  );
};

export default ToastDemo;
