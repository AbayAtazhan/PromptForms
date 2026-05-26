import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { PromptManager } from './components/PromptManager';
import { DynamicFormRenderer } from './components/DynamicFormRenderer';
import { OutputDisplay } from './components/OutputDisplay';
import { useGemini } from './hooks/useGemini';
import type { PromptTemplate } from './types';
import { Key, BookOpen } from 'lucide-react';
import { WaitlistSection } from './components/WaitlistSection';

// Initial high-fidelity template presets to seed LocalStorage on fresh start
const PRESET_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-saas-copy',
    title: 'SaaS Copywriting Wizard',
    description: 'Generates high-converting landing page headlines and CTA variations.',
    systemInstruction: `You are an expert SaaS copywriter. Write a highly persuasive landing page hero section for {{product_name}}, targeting {{target_audience}}. The core value proposition is {{core_value_prop}}. Write 3 variations in a {{tone}} tone. Each variation must include a Headline (max 8 words), a Subheadline (max 20 words), and a Call-to-Action button label. Add a short analytical rationale for why each works.`,
    variables: ['product_name', 'target_audience', 'core_value_prop', 'tone'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tpl-code-opt',
    title: 'Clean Code Architect',
    description: 'Refactors scripts to optimize time complexity, security, and cleanliness.',
    systemInstruction: `You are a Principal Software Engineer. Analyze and refactor the following {{language}} code block to optimize execution speed, memory footprint, security vulnerabilities, and adherence to clean architectural principles:

\`\`\`
{{code_snippet}}
\`\`\`

Explain the optimizations step-by-step. Compare time/space complexity before and after (Big O notation). Note any potential edge cases or unit tests required.`,
    variables: ['language', 'code_snippet'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tpl-seo-meta',
    title: 'SEO Click-Through Optimizer',
    description: 'Creates highly optimized meta titles and descriptions to boost Google Search CTR.',
    systemInstruction: `You are a Senior SEO Strategist. Generate 5 high-CTR Google Search result snippets for a blog post about {{article_topic}}. The target keywords are {{primary_keywords}} and the searcher intent is {{search_intent}}. The tone should be {{tone}}. For each variation, write a Title Tag (max 60 characters) and a Meta Description (max 155 characters). Make sure the keyword is naturally integrated, and use psychological triggers to maximize clicks.`,
    variables: ['article_topic', 'primary_keywords', 'search_intent', 'tone'],
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'templates' | 'waitlist'>('playground');
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // API settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Gemini stream hook integration
  const { output, isLoading, isStreaming, error, generateStream, clearOutput } = useGemini();

  // Load templates & check API key status on launch
  useEffect(() => {
    // 1. Check API Key
    const key = localStorage.getItem('promptforms_gemini_api_key');
    setApiKeySaved(!!key);

    // 2. Load or Seed Templates
    const stored = localStorage.getItem('promptforms_templates');
    if (stored) {
      const parsed = JSON.parse(stored) as PromptTemplate[];
      setTemplates(parsed);
      if (parsed.length > 0) {
        setSelectedTemplateId(parsed[0].id);
      }
    } else {
      // Seed preset templates
      localStorage.setItem('promptforms_templates', JSON.stringify(PRESET_TEMPLATES));
      setTemplates(PRESET_TEMPLATES);
      setSelectedTemplateId(PRESET_TEMPLATES[0].id);
    }
  }, []);

  // Sync templates to localStorage on changes
  const saveTemplates = (newTemplates: PromptTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('promptforms_templates', JSON.stringify(newTemplates));
  };

  // Listen to deep-links from Sidebar custom events
  useEffect(() => {
    const handleSelectTemplate = (e: Event) => {
      const id = (e as CustomEvent).detail;
      setSelectedTemplateId(id);
      setActiveTab('playground');
      clearOutput();
    };

    window.addEventListener('selectTemplate', handleSelectTemplate);
    return () => window.removeEventListener('selectTemplate', handleSelectTemplate);
  }, [clearOutput]);

  const handleKeySavedStatus = () => {
    const key = localStorage.getItem('promptforms_gemini_api_key');
    setApiKeySaved(!!key);
  };

  // CRUD Template Managers
  const handleAddTemplate = (newTplData: Omit<PromptTemplate, 'id' | 'createdAt'>) => {
    const newTpl: PromptTemplate = {
      ...newTplData,
      id: `tpl-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newTpl, ...templates];
    saveTemplates(updated);
    setSelectedTemplateId(newTpl.id);
  };

  const handleUpdateTemplate = (id: string, updatedFields: Partial<PromptTemplate>) => {
    const updated = templates.map((tpl) => {
      if (tpl.id === id) {
        return { ...tpl, ...updatedFields } as PromptTemplate;
      }
      return tpl;
    });
    saveTemplates(updated);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter((tpl) => tpl.id !== id);
    saveTemplates(updated);
    if (selectedTemplateId === id) {
      setSelectedTemplateId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-darker text-text-primary">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        templates={templates}
        apiKeySaved={apiKeySaved}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Core View Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Unified Premium Header Topbar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-border-clinical bg-bg-dark/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-tech-cyan animate-pulse shadow-cyan-glow" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              {activeTab === 'playground' && 'AI Execution Playground'}
              {activeTab === 'templates' && 'Prompt Templates CRUD Workspace'}
              {activeTab === 'waitlist' && 'B2B Enterprise Upgrade'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Connection Indicator Box */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                apiKeySaved
                  ? 'bg-tech-emerald/5 border-tech-emerald/30 text-tech-emerald'
                  : 'bg-tech-amber/5 border-tech-amber/30 text-tech-amber animate-pulse'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{apiKeySaved ? 'Gemini Key Active' : 'Configure Gemini Key'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${apiKeySaved ? 'bg-tech-emerald' : 'bg-tech-amber'}`} />
            </button>
          </div>
        </header>

        {/* Content Viewer body (scroll isolated) */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto h-full items-start">
              {/* Template Selector & Variable Inputs Column */}
              <div className="xl:col-span-5 space-y-6">
                {/* Quick Switch Dropdown */}
                {templates.length > 0 && (
                  <div className="glass-panel border-border-clinical rounded-2xl p-4 flex flex-col gap-2 shadow-md">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-tech-cyan" /> Switch Form Template
                    </label>
                    <select
                      value={selectedTemplateId || ''}
                      onChange={(e) => {
                        setSelectedTemplateId(e.target.value);
                        clearOutput();
                      }}
                      className="w-full px-3 py-2 bg-bg-darker border border-border-clinical rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-tech-cyan transition-all"
                    >
                      {templates.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <DynamicFormRenderer
                  selectedTemplate={activeTemplate}
                  isLoading={isLoading}
                  isStreaming={isStreaming}
                  onGenerate={generateStream}
                />
              </div>

              {/* Streaming Output Column */}
              <div className="xl:col-span-7 h-full">
                <OutputDisplay
                  output={output}
                  isLoading={isLoading}
                  isStreaming={isStreaming}
                  error={error}
                />
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <PromptManager
              templates={templates}
              onAddTemplate={handleAddTemplate}
              onUpdateTemplate={handleUpdateTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          )}

          {activeTab === 'waitlist' && <WaitlistSection />}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={handleKeySavedStatus}
      />
    </div>
  );
}
