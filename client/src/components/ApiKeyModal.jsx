import React, { useState } from 'react';
import { Key, X, ShieldCheck, Info, ExternalLink, Trash2 } from 'lucide-react';

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  onRemoveApiKey,
  onShowToast
}) {
  const [keyInput, setKeyInput] = useState(apiKey || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    if (onShowToast) onShowToast('API Key saved to browser!', 'success');
    onClose();
  };

  const handleRemove = () => {
    setKeyInput('');
    onRemoveApiKey();
    if (onShowToast) onShowToast('Custom API Key removed. Using built-in engine.', 'info');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9500,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '1.75rem',
        background: '#0c111f',
        border: '1px solid rgba(0, 242, 254, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 242, 254, 0.15)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Key size={18} color="#00f2fe" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Engine Settings</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '10px',
          padding: '0.85rem',
          marginBottom: '1.25rem',
          fontSize: '0.8rem',
          color: '#93c5fd',
          lineHeight: '1.5',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Zero-Config Guarantee:</strong> ErrorLens AI includes a comprehensive built-in offline heuristic engine that works 100% out of the box. Adding your personal <strong>Google Gemini API Key</strong> unlocks deep dynamic reasoning and customized follow-up chats.
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Google Gemini API Key (optional):
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              background: '#040711',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              marginBottom: '1rem'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: '#38bdf8',
                textDecoration: 'none'
              }}
            >
              <span>Get a free Gemini API Key</span>
              <ExternalLink size={12} />
            </a>

            {apiKey && (
              <button
                type="button"
                onClick={handleRemove}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f43f5e',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <Trash2 size={12} />
                <span>Remove Custom Key</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
