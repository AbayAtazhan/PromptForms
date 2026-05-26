import { 
  Sparkles, 
  Layers, 
  Settings, 
  Terminal, 
  ShieldCheck, 
  FileText
} from 'lucide-react';
import type { PromptTemplate } from '../types';

interface SidebarProps {
  activeTab: 'playground' | 'templates' | 'waitlist';
  setActiveTab: (tab: 'playground' | 'templates' | 'waitlist') => void;
  templates: PromptTemplate[];
  apiKeySaved: boolean;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  templates,
  apiKeySaved,
  onOpenSettings,
}) => {
  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-border-clinical bg-bg-dark h-screen sticky top-0 p-6">
      {/* Upper Section */}
      <div className="space-y-8">
        {/* Glowing Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-tech-blue via-tech-cyan to-tech-purple p-[1px] shadow-cyan-glow">
            <div className="flex items-center justify-center w-full h-full bg-bg-darker rounded-xl">
              <Terminal className="w-5 h-5 text-tech-cyan" />
            </div>
            {/* Pulsing indicator orb */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-tech-cyan animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-tech-cyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white m-0 leading-none">
              Prompt<span className="text-tech-cyan">Forms</span>
            </h1>
            <span className="text-[10px] text-text-muted font-mono tracking-widest uppercase">v1.0 Open-Source</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <span className="block text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 mb-2">
            Main Dashboard
          </span>

          <button
            onClick={() => setActiveTab('playground')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              activeTab === 'playground'
                ? 'bg-tech-blue/10 text-tech-cyan border-l-2 border-tech-cyan shadow-clinical-glow'
                : 'text-text-secondary hover:text-white hover:bg-bg-card'
            }`}
          >
            <Sparkles className={`w-4 h-4 transition-colors ${
              activeTab === 'playground' ? 'text-tech-cyan' : 'text-text-muted group-hover:text-text-secondary'
            }`} />
            Playground
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              activeTab === 'templates'
                ? 'bg-tech-blue/10 text-tech-cyan border-l-2 border-tech-cyan shadow-clinical-glow'
                : 'text-text-secondary hover:text-white hover:bg-bg-card'
            }`}
          >
            <Layers className={`w-4 h-4 transition-colors ${
              activeTab === 'templates' ? 'text-tech-cyan' : 'text-text-muted group-hover:text-text-secondary'
            }`} />
            <span>Templates Manager</span>
            <span className="ml-auto text-xs px-2 py-0.5 bg-bg-darker border border-border-clinical text-text-secondary rounded-full font-mono">
              {templates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              activeTab === 'waitlist'
                ? 'bg-tech-purple/10 text-tech-purple border-l-2 border-tech-purple shadow-purple-glow'
                : 'text-text-secondary hover:text-white hover:bg-bg-card'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 transition-colors ${
              activeTab === 'waitlist' ? 'text-tech-purple' : 'text-text-muted group-hover:text-text-secondary'
            }`} />
            <span>Teams Upgrade</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 bg-tech-purple/20 text-tech-purple font-semibold rounded uppercase tracking-wider">
              PRO
            </span>
          </button>
        </div>

        {/* Templates Quick List (if any templates exist, show titles up to 3) */}
        {templates.length > 0 && (
          <div className="pt-4 border-t border-border-clinical/60">
            <span className="block text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 mb-2">
              Recent Forms
            </span>
            <div className="space-y-1 overflow-y-auto max-h-40">
              {templates.slice(0, 4).map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setActiveTab('playground');
                    // Selection handling will be managed in parent component
                    const event = new CustomEvent('selectTemplate', { detail: template.id });
                    window.dispatchEvent(event);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-white hover:bg-bg-card rounded-lg text-left transition-colors truncate"
                  title={template.title}
                >
                  <FileText className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  <span className="truncate">{template.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        {/* API Settings Quick Access */}
        <button
          onClick={onOpenSettings}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium border border-border-clinical text-text-secondary hover:text-white hover:bg-bg-card transition-all ${
            !apiKeySaved ? 'border-tech-amber/30 text-tech-amber/95 hover:bg-tech-amber/5' : ''
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Settings & Key
          <span className={`ml-auto w-2 h-2 rounded-full ${
            apiKeySaved ? 'bg-tech-emerald' : 'bg-tech-amber animate-pulse'
          }`} />
        </button>

        {/* Footer Credit */}
        <div className="text-[10px] text-text-muted leading-relaxed px-1">
          <p>Open source license. Secure client-side execution.</p>
        </div>
      </div>
    </aside>
  );
};
