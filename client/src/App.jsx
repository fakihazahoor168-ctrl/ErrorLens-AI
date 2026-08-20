import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import PresetChips from './components/PresetChips';
import ErrorInput from './components/ErrorInput';
import DiagnosisView from './components/DiagnosisView';
import FollowUpChat from './components/FollowUpChat';
import HistoryDrawer from './components/HistoryDrawer';
import ApiKeyModal from './components/ApiKeyModal';
import Toast from './components/Toast';

export default function App() {
  const [errorText, setErrorText] = useState('');
  const [framework, setFramework] = useState('Auto-Detect');
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState('aurora');

  const diagnosisRef = useRef(null);

  // Load saved state from localStorage on startup
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('errorlens_theme') || 'aurora';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);

      const savedKey = localStorage.getItem('errorlens_custom_key');
      if (savedKey) setCustomApiKey(savedKey);

      const savedHistory = localStorage.getItem('errorlens_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error('Failed to read localStorage:', e);
    }
  }, []);

  // Theme change handler
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('errorlens_theme', newTheme);
    showToast(`Switched theme to ${newTheme.toUpperCase()}`, 'info');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Save API key
  const handleSaveApiKey = (key) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('errorlens_custom_key', key);
    } else {
      localStorage.removeItem('errorlens_custom_key');
    }
  };

  const handleRemoveApiKey = () => {
    setCustomApiKey('');
    localStorage.removeItem('errorlens_custom_key');
  };

  // Perform Error Diagnosis
  const handleDiagnose = async (overrideText) => {
    const textToAnalyze = (overrideText || errorText).trim();
    if (!textToAnalyze) {
      showToast('Please enter an error message or stack trace first.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (customApiKey) {
        headers['x-gemini-api-key'] = customApiKey;
      }

      const response = await fetch('/api/explain', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          errorText: textToAnalyze,
          context: { framework }
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        setDiagnosis(json.data);
        showToast('Error analyzed successfully!', 'success');

        // Append to history
        const newHistoryItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          rawError: textToAnalyze,
          diagnosis: json.data
        };

        const updatedHistory = [newHistoryItem, ...history.slice(0, 24)];
        setHistory(updatedHistory);
        localStorage.setItem('errorlens_history', JSON.stringify(updatedHistory));

        // Smooth scroll to diagnosis
        setTimeout(() => {
          diagnosisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        throw new Error(json.error || 'Diagnostic server error');
      }
    } catch (err) {
      console.error('Diagnosis failed:', err);
      showToast(err.message || 'Failed to analyze error. Check backend connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Select Preset Handler
  const handleSelectPreset = (presetText) => {
    setErrorText(presetText);
    handleDiagnose(presetText);
  };

  // Select History Item Handler
  const handleSelectHistoryItem = (item) => {
    setErrorText(item.rawError);
    setDiagnosis(item.diagnosis);
    showToast('Loaded diagnosis from history', 'info');
    setTimeout(() => {
      diagnosisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Clear History
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('errorlens_history');
  };

  return (
    <>
      <div className="ambient-bg" />
      <div className="grid-overlay" />

      <div className="app-container">
        {/* Navigation Bar */}
        <Navbar
          onOpenHistory={() => setIsHistoryOpen(true)}
          historyCount={history.length}
          onOpenApiKey={() => setIsApiKeyOpen(true)}
          hasCustomKey={Boolean(customApiKey)}
          currentTheme={theme}
          onSelectTheme={handleThemeChange}
        />

        {/* Hero Section */}
        <HeroBanner />

        {/* Quick Test Presets */}
        <PresetChips onSelectPreset={handleSelectPreset} />

        {/* Terminal Input Box */}
        <ErrorInput
          errorText={errorText}
          setErrorText={setErrorText}
          onDiagnose={() => handleDiagnose()}
          isLoading={isLoading}
          framework={framework}
          setFramework={setFramework}
          onShowToast={showToast}
        />

        {/* Diagnostic Results Section */}
        <div ref={diagnosisRef}>
          {diagnosis && (
            <>
              <DiagnosisView
                diagnosis={diagnosis}
                rawError={errorText}
                onToggleChat={() => setIsChatOpen(!isChatOpen)}
                isChatOpen={isChatOpen}
                onShowToast={showToast}
              />

              <FollowUpChat
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                diagnosis={diagnosis}
                rawError={errorText}
                customApiKey={customApiKey}
                onShowToast={showToast}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: 'auto',
          paddingTop: '2.5rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <p>
            ErrorLens AI &copy; 2026 — Built with React, Node.js, Express & Vercel Serverless Architecture.
          </p>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
            <span>Single-Command Vercel Deployment</span>
            <span>•</span>
            <span>Zero-Config Offline Fallback</span>
            <span>•</span>
            <span>Dynamic Aurora Theme</span>
          </div>
        </footer>
      </div>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onShowToast={showToast}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={customApiKey}
        onSaveApiKey={handleSaveApiKey}
        onRemoveApiKey={handleRemoveApiKey}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
