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
    // Using a dynamic right value for better mobile placement
    right: window.innerWidth < 600 ? '50%' : '30px',
    transform: window.innerWidth < 600 ? 'translateX(50%)' : 'none',
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
    maxWidth: '90vw', // Prevents it from being wider than the screen
    height: 'auto',
    animation: 'slideIn 0.3s ease-out', // Assuming you have this in your CSS
  };

  return (
    <div style={toastStyle}>
      <CheckCircle2 size={22} color="#6366f1" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.4' }}>
        {message}
      </span>
    </div>
  );
};

export default Toast;