import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, X, Sparkles } from 'lucide-react';

export default function FollowUpChat({ 
  isOpen, 
  onClose, 
  diagnosis, 
  rawError, 
  customApiKey,
  onShowToast 
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I've analyzed your error trace for **${diagnosis?.title || 'this issue'}**. Ask me anything specific—for example, how to fix this in Docker, macOS, or production environments!`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickQuestions = [
    'How do I fix this in Docker?',
    'What command frees up port 5000?',
    'How do I prevent this on Vercel?',
    'How to test if the fix worked?'
  ];

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const newHistory = [...messages, { role: 'user', content: text }];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (customApiKey) {
        headers['x-gemini-api-key'] = customApiKey;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          history: newHistory,
          errorContext: {
            title: diagnosis?.title,
            whatHappened: diagnosis?.whatHappened,
            errorCode: diagnosis?.errorCode,
            rawError: rawError
          }
        })
      });

      const data = await res.json();
      if (data.success && data.data?.reply) {
        setMessages([...newHistory, { role: 'assistant', content: data.data.reply }]);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err) {
      setMessages([
        ...newHistory,
        { 
          role: 'assistant', 
          content: `⚠️ Sorry, couldn't process this request. (${err.message}). Double check your connection or try again.` 
        }
      ]);
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2.5rem', border: '1px solid rgba(138, 43, 226, 0.4)' }}>
      {/* Chat Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={16} color="#fff" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Interactive Debug Chat</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ask questions specific to your system or deployment</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          title="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Questions Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: '#cbd5e1',
              padding: '0.25rem 0.6rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Sparkles size={11} color="#c084fc" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        maxHeight: '350px',
        overflowY: 'auto',
        paddingRight: '0.5rem',
        marginBottom: '1rem'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '0.65rem',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Bot size={13} color="#00f2fe" />
              </div>
            )}

            <div style={{
              background: msg.role === 'user' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'rgba(255, 255, 255, 0.04)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              lineHeight: '1.55',
              color: '#f8fafc',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>

            {msg.role === 'user' && (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <User size={13} color="#93c5fd" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Loader2 size={15} className="animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        style={{ display: 'flex', gap: '0.5rem' }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a follow-up question..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: '#040711',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: '#fff',
            padding: '0.6rem 0.85rem',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1rem' }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
