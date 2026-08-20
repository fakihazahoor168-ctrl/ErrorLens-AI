import React, { useState } from 'react';
import { History, X, Trash2, Search, ArrowRight, Tag, Clock } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onShowToast
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.diagnosis?.title?.toLowerCase().includes(term) ||
      item.diagnosis?.errorCode?.toLowerCase().includes(term) ||
      item.rawError?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9000,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      {/* Backdrop click to close */}
      <div style={{ flex: 1 }} onClick={onClose} />

      {/* Drawer Panel */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0a0e1a',
        borderLeft: '1px solid var(--border-subtle)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.8)',
        animation: 'slideLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={18} color="#00f2fe" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Diagnostic History</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '1rem'
        }}>
          <Search size={15} color="#64748b" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past errors..."
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.2rem',
              background: '#040711',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* History List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          paddingRight: '0.25rem'
        }}>
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Clock size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem' }}>No past diagnoses found.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 242, 254, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                    {item.diagnosis?.errorCode || 'ERROR'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.35rem', color: '#f8fafc' }}>
                  {item.diagnosis?.title || 'Diagnosed Error'}
                </h4>

                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {item.rawError}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Clear All History Footer */}
        {history.length > 0 && (
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
            <button
              onClick={() => {
                if (window.confirm('Clear all saved diagnostic history?')) {
                  onClearHistory();
                  if (onShowToast) onShowToast('History cleared', 'info');
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: 'none',
                border: 'none',
                color: '#f43f5e',
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
