import React, { useState } from 'react';
import { Terminal, Key, History, Sparkles, ShieldCheck, Zap, Palette } from 'lucide-react';

export default function Navbar({ 
  onOpenHistory, 
  historyCount, 
  onOpenApiKey, 
  hasCustomKey,
  currentTheme,
  onSelectTheme
}) {
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const themes = [
    { id: 'aurora', label: 'Aurora Prism', color: '#818cf8', iconColor: '#ec4899' },
    { id: 'synthwave', label: 'Neon Synthwave', color: '#ff007f', iconColor: '#00f2fe' },
    { id: 'matrix', label: 'Cyber Matrix', color: '#10b981', iconColor: '#84cc16' },
    { id: 'solar', label: 'Solar Flare', color: '#f97316', iconColor: '#fbbf24' }
  ];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 0',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: '2rem',
      position: 'relative',
      zIndex: 50
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(236, 72, 153, 0.25))',
          border: '1px solid var(--border-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--gradient-glow)'
        }}>
          <Terminal size={22} color="var(--accent-primary)" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              ErrorLens<span className="text-gradient">.AI</span>
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>v2.0</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-2px' }}>
            Instant AI Error Diagnostics & Fix Engine
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Theme Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            style={{ 
              padding: '0.5rem 0.85rem', 
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
            title="Switch theme aesthetics"
          >
            <Palette size={15} color="var(--accent-secondary)" />
            <span style={{ textTransform: 'capitalize' }}>
              {themes.find(t => t.id === currentTheme)?.label.split(' ')[0] || 'Theme'}
            </span>
          </button>

          {isThemeOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '190px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-glow)',
              borderRadius: '12px',
              padding: '0.5rem',
              boxShadow: '0 12px 35px rgba(0,0,0,0.8), var(--gradient-glow)',
              zIndex: 100,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.3rem 0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Color Themes
              </div>
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTheme(t.id);
                    setIsThemeOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: currentTheme === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: currentTheme === t.id ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                >
                  <span>{t.label}</span>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${t.color}, ${t.iconColor})`,
                    boxShadow: `0 0 8px ${t.color}`
                  }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History Button */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenHistory}
          style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
          title="View recent diagnosed errors"
        >
          <History size={15} />
          <span>History</span>
          {historyCount > 0 && (
            <span style={{
              background: 'rgba(99, 102, 241, 0.25)',
              color: 'var(--accent-primary)',
              borderRadius: '9999px',
              padding: '1px 6px',
              fontSize: '0.7rem',
              fontWeight: 700,
              marginLeft: '2px'
            }}>
              {historyCount}
            </span>
          )}
        </button>

        {/* API Key / Engine Settings */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenApiKey}
          style={{ 
            padding: '0.5rem 0.85rem', 
            fontSize: '0.8rem',
            borderColor: hasCustomKey ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)'
          }}
          title="Configure API key or LLM provider"
        >
          {hasCustomKey ? (
            <ShieldCheck size={15} color="#10b981" />
          ) : (
            <Key size={15} color="#94a3b8" />
          )}
          <span>{hasCustomKey ? 'Custom Key' : 'API Key'}</span>
        </button>
      </div>
    </header>
  );
}
