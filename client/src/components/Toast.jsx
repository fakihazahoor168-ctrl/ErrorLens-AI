import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.25rem',
      borderRadius: '12px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 242, 254, 0.3)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 242, 254, 0.2)',
      color: '#fff',
      fontSize: '0.875rem',
      fontWeight: 500,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {type === 'success' && <CheckCircle size={18} color="#00f2fe" />}
      {type === 'error' && <AlertCircle size={18} color="#f43f5e" />}
      {type === 'info' && <Info size={18} color="#a855f7" />}
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
