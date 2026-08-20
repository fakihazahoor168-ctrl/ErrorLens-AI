import React from 'react';
import { Sparkles, Code2, ShieldAlert, Cpu } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.9rem',
        borderRadius: '9999px',
        background: 'rgba(0, 242, 254, 0.08)',
        border: '1px solid rgba(0, 242, 254, 0.25)',
        color: '#38bdf8',
        fontSize: '0.8rem',
        fontWeight: 600,
        marginBottom: '1.25rem'
      }}>
        <Sparkles size={14} />
        <span>Next-Gen AI Debugging & Diagnostic Assistant</span>
      </div>

      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.25rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
        marginBottom: '1rem'
      }}>
        Decode Any Error in <span className="text-gradient">Plain English</span>
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.15rem)',
        color: 'var(--text-secondary)',
        maxWidth: '680px',
        margin: '0 auto 1.75rem',
        lineHeight: 1.6
      }}>
        Paste raw stack traces, terminal exceptions, or HTTP failures. Get immediate root-cause diagnosis, verified code fixes, and proactive best practices.
      </p>

      {/* Feature Highlights */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.75rem',
        marginTop: '1rem'
      }}>
        <div className="badge badge-cyan" style={{ padding: '0.4rem 0.8rem', textTransform: 'none' }}>
          <Code2 size={14} style={{ marginRight: '4px' }} />
          <span>Copyable Code Fixes</span>
        </div>
        <div className="badge badge-purple" style={{ padding: '0.4rem 0.8rem', textTransform: 'none' }}>
          <ShieldAlert size={14} style={{ marginRight: '4px' }} />
          <span>Root Cause Breakdown</span>
        </div>
        <div className="badge badge-emerald" style={{ padding: '0.4rem 0.8rem', textTransform: 'none' }}>
          <Cpu size={14} style={{ marginRight: '4px' }} />
          <span>Offline Fallback + Gemini AI</span>
        </div>
      </div>
    </section>
  );
}
