import { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, Check, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testError, setTestError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('promptforms_gemini_api_key') || '';
      setApiKey(savedKey);
      setTestState('idle');
      setTestError(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('promptforms_gemini_api_key', apiKey.trim());
    onKeySaved();
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('promptforms_gemini_api_key');
    setApiKey('');
    onKeySaved();
    setTestState('idle');
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestState('failed');
      setTestError('Please enter an API Key first.');
      return;
    }

    setTestState('testing');
    setTestError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'Respond with the word "OK".' }] }]
      });
      
      const responseText = result.response.text();
      if (responseText) {
        setTestState('success');
      } else {
        throw new Error('Empty response received from the model.');
      }
    } catch (err: any) {
      console.error('Connection Test Failed:', err);
      setTestState('failed');
      setTestError(err?.message || 'Invalid API Key or networking error.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden glass-panel-accent rounded-2xl shadow-2xl border border-tech-cyan/20 animate-scale-up">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tech-cyan via-tech-blue to-tech-purple" />

        <div className="flex items-center justify-between p-6 pb-4 border-b border-border-clinical">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-tech-blue/10 border border-tech-blue/20">
              <Key className="w-5 h-5 text-tech-cyan" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Gemini API Key Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-white hover:bg-border-clinical transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-text-secondary leading-relaxed">
            PromptForms communicates directly with Google Gemini 2.5 Flash using your browser. 
            Your API key is stored securely in your browser's <code className="text-xs text-tech-cyan bg-tech-cyan/5 px-1.5 py-0.5 rounded">LocalStorage</code> and is never transmitted to any external third-party server.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Google AI Studio API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-4 pr-24 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-border-clinical transition-colors"
                  title={showKey ? 'Hide Key' : 'Show Key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testState === 'testing' || !apiKey.trim()}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-tech-cyan disabled:text-text-muted hover:bg-border-clinical disabled:hover:bg-transparent transition-colors"
                  title="Test Connection"
                >
                  {testState === 'testing' ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-tech-cyan" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {testState === 'success' && (
            <div className="flex items-start gap-3 p-4 bg-tech-emerald/10 border border-tech-emerald/30 rounded-xl animate-fade-in">
              <Check className="w-5 h-5 text-tech-emerald mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-tech-emerald">Connection Successful!</p>
                <p className="text-xs text-text-secondary mt-0.5">Your API key is valid and connected to Gemini 2.5 Flash.</p>
              </div>
            </div>
          )}

          {testState === 'failed' && (
            <div className="flex items-start gap-3 p-4 bg-tech-rose/10 border border-tech-rose/30 rounded-xl animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-tech-rose mt-0.5 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-tech-rose">Connection Failed</p>
                <p className="text-xs text-text-secondary mt-0.5 break-words max-h-16 overflow-y-auto">{testError}</p>
              </div>
            </div>
          )}

          <div className="p-4 bg-bg-dark border border-border-clinical rounded-xl space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">How to get a free API Key?</h4>
            <ol className="text-xs text-text-secondary list-decimal pl-4 space-y-1.5">
              <li>
                Go to{' '}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-tech-cyan hover:underline"
                >
                  Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Sign in with your Google account.</li>
              <li>Click on the prominent <span className="font-semibold text-white">"Get API key"</span> button.</li>
              <li>Create a new key (free tier is fast and fully supported).</li>
            </ol>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border-clinical bg-bg-dark/50">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-tech-rose hover:bg-tech-rose/10 rounded-xl transition-all"
          >
            Delete Key
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-tech-blue to-tech-cyan rounded-xl hover:opacity-90 transition-all shadow-cyan-glow hover:shadow-cyan-glow-intense"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
