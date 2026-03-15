import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Force these styles to ensure it looks professional
  const toastStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#111827',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderLeft: '5px solid #6366f1',
    minWidth: '280px',
    maxWidth: '350px',
    height: 'auto', // Explicitly set height to auto to prevent stretching
  };

  return (
    <div style={toastStyle}>
      <CheckCircle2 size={22} color="#6366f1" />
      <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{message}</span>
    </div>
  );
};

export default Toast;