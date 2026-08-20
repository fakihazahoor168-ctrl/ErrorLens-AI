import React, { useState, useRef } from 'react';
import { Terminal, Clipboard, Upload, Trash2, Zap, Loader2, Settings2 } from 'lucide-react';

export default function ErrorInput({ 
  errorText, 
  setErrorText, 
  onDiagnose, 
  isLoading, 
  framework, 
  setFramework,
  onShowToast 
}) {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Line numbers calculation
  const lineCount = Math.max(errorText.split('\n').length, 5);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Clipboard paste handler
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setErrorText(text);
        if (onShowToast) onShowToast('Pasted error from clipboard!', 'info');
      }
    } catch (err) {
      if (onShowToast) onShowToast('Please paste manually using Ctrl+V', 'error');
    }
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setErrorText(event.target.result);
      if (onShowToast) onShowToast(`Loaded "${file.name}"`, 'success');
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-panel glass-panel-glow" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
      {/* Terminal Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="terminal-dots">
            <div className="terminal-dot dot-red"></div>
            <div className="terminal-dot dot-yellow"></div>
            <div className="terminal-dot dot-green"></div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <Terminal size={14} color="#00f2fe" />
            <span>stack-trace.log</span>
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePasteClipboard}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            title="Paste from clipboard"
          >
            <Clipboard size={13} />
            <span>Paste</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            title="Upload log file"
          >
            <Upload size={13} />
            <span>Upload Log</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.err,.json"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          {errorText && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setErrorText('')}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#f43f5e' }}
              title="Clear text"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor with line numbers */}
      <div style={{
        display: 'flex',
        background: '#040711',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        overflow: 'hidden',
        minHeight: '180px'
      }}>
        {/* Line numbers gutter */}
        <div style={{
          padding: '0.85rem 0.65rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          color: '#475569',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: '1.5',
          textAlign: 'right',
          userSelect: 'none'
        }}>
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
          placeholder="// Paste your error message, stack trace, or terminal log here...&#10;// Example:&#10;Error: connect ECONNREFUSED 127.0.0.1:5000&#10;TypeError: Cannot read properties of undefined"
          rows={Math.max(6, Math.min(lineCount, 16))}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            padding: '0.85rem',
            resize: 'vertical',
            minHeight: '160px'
          }}
        />
      </div>

      {/* Footer bar with environment tag and Diagnose button */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {/* Environment Filter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings2 size={15} color="#94a3b8" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Environment:</span>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Auto-Detect" style={{ background: '#0c1222' }}>Auto-Detect</option>
            <option value="Node.js / Express" style={{ background: '#0c1222' }}>Node.js / Express</option>
            <option value="React / Next.js" style={{ background: '#0c1222' }}>React / Next.js</option>
            <option value="Python / Django / Flask" style={{ background: '#0c1222' }}>Python / Django / Flask</option>
            <option value="Docker / Containers" style={{ background: '#0c1222' }}>Docker / Containers</option>
            <option value="Database / SQL / Mongo" style={{ background: '#0c1222' }}>Database (SQL / Mongo)</option>
          </select>
        </div>

        {/* Primary Action Button */}
        <button
          className="btn btn-primary"
          onClick={onDiagnose}
          disabled={isLoading || !errorText.trim()}
          style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem' }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Analyzing Error...</span>
            </>
          ) : (
            <>
              <Zap size={18} />
              <span>Diagnose & Fix Error</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
