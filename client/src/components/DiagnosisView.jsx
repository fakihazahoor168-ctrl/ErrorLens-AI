import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Wrench, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  MessageSquare, 
  Sparkles, 
  Tag, 
  Layers,
  Cpu,
  Share2
} from 'lucide-react';
import { formatDiagnosticReport, downloadMarkdownFile } from '../utils/exportHelper';

export default function DiagnosisView({ 
  diagnosis, 
  rawError, 
  onToggleChat, 
  isChatOpen,
  onShowToast 
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!diagnosis) return null;

  // Copy code snippet helper
  const handleCopyCode = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      if (onShowToast) onShowToast('Code copied to clipboard!', 'success');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      if (onShowToast) onShowToast('Failed to copy', 'error');
    }
  };

  // Copy full report summary
  const handleCopySummary = async () => {
    try {
      const summary = formatDiagnosticReport(diagnosis, rawError);
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      if (onShowToast) onShowToast('Full diagnostic report copied!', 'success');
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch (e) {
      if (onShowToast) onShowToast('Failed to copy summary', 'error');
    }
  };

  // Download Markdown file
  const handleDownloadReport = () => {
    const reportMd = formatDiagnosticReport(diagnosis, rawError);
    const filename = `error-diagnosis-${diagnosis.errorCode || 'report'}-${Date.now()}.md`;
    downloadMarkdownFile(filename, reportMd);
    if (onShowToast) onShowToast(`Downloaded "${filename}"`, 'success');
  };

  // Severity color mapping
  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'badge-rose';
      case 'medium':
        return 'badge-amber';
      case 'low':
        return 'badge-emerald';
      default:
        return 'badge-cyan';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
      {/* Top Banner Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #00f2fe' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {/* Title */}
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
              Diagnostic Report
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '2px' }}>
              {diagnosis.title || 'Error Analysis'}
            </h2>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
            {diagnosis.errorCode && (
              <span className="badge badge-purple">
                <Tag size={12} />
                <span>{diagnosis.errorCode}</span>
              </span>
            )}
            <span className={`badge ${getSeverityBadgeClass(diagnosis.severity)}`}>
              <span>Severity: {diagnosis.severity || 'Medium'}</span>
            </span>
            <span className="badge badge-cyan">
              <Layers size={12} />
              <span>{diagnosis.detectedLanguage || 'General'}</span>
            </span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
              <Cpu size={12} />
              <span>{diagnosis.source === 'ai-gemini' ? 'Gemini 1.5 Flash' : 'Expert Engine'}</span>
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleCopySummary}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            {copiedSummary ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedSummary ? 'Copied Summary' : 'Copy Summary'}</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={handleDownloadReport}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <Download size={14} />
            <span>Download Report (.md)</span>
          </button>

          <button 
            className="btn btn-glow" 
            onClick={onToggleChat}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', marginLeft: 'auto' }}
          >
            <MessageSquare size={14} />
            <span>{isChatOpen ? 'Close Debug Chat' : 'Ask Follow-up Questions'}</span>
          </button>
        </div>
      </div>

      {/* Grid: What Happened & Why It Occurred */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* What Happened Card */}
        <div className="glass-panel" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle size={16} color="#00f2fe" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>What Happened</h3>
          </div>
          <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.65' }}>
            {diagnosis.whatHappened}
          </p>
        </div>

        {/* Why It Occurred Card */}
        <div className="glass-panel" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={16} color="#c084fc" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Why It Occurred</h3>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {diagnosis.whyItOccurred}
          </div>
        </div>
      </div>

      {/* How To Solve It — Step-by-Step Solutions */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wrench size={16} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>How to Solve It</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(diagnosis.solutions || []).map((sol, index) => (
            <div 
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.15rem'
              }}
            >
              {/* Step Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00f2fe, #2563eb)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {sol.step || index + 1}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {sol.title}
                  </h4>
                </div>
              </div>

              {/* Step Description */}
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', paddingLeft: '2rem' }}>
                {sol.description}
              </p>

              {/* Code Snippet Box */}
              {sol.code && (
                <div style={{ marginLeft: '2rem', position: 'relative' }}>
                  <div className="code-box">
                    <button
                      onClick={() => handleCopyCode(sol.code, index)}
                      style={{
                        position: 'absolute',
                        top: '0.6rem',
                        right: '0.6rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: copiedIndex === index ? '#10b981' : '#cbd5e1',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      title="Copy code"
                    >
                      {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                    </button>
                    <code>{sol.code}</code>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prevention & Best Practices */}
      {diagnosis.prevention && (
        <div className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <ShieldCheck size={18} color="#10b981" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
              Prevention & Best Practices
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {diagnosis.prevention}
          </p>
        </div>
      )}
    </div>
  );
}
