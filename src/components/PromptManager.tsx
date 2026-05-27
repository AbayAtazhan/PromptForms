import { useState, useEffect } from 'react';
import { Trash2, Edit2, Save, X, LayoutGrid, AlertCircle, Info, Sparkles } from 'lucide-react';
import type { PromptTemplate } from '../types';

interface PromptManagerProps {
  templates: PromptTemplate[];
  onAddTemplate: (template: Omit<PromptTemplate, 'id' | 'createdAt'>) => void;
  onUpdateTemplate: (id: string, updatedFields: Partial<PromptTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
}

export const PromptManager: React.FC<PromptManagerProps> = ({
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [parsedVariables, setParsedVariables] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches: string[] = [];
    let match;
    
    if (!systemInstruction.trim()) {
      setParsedVariables([]);
      return;
    }

    while ((match = regex.exec(systemInstruction)) !== null) {
      const varName = match[1].trim();
      if (varName && !matches.includes(varName)) {
        matches.push(varName);
      }
    }
    
    setParsedVariables(matches);
  }, [systemInstruction]);

  const handleStartEdit = (template: PromptTemplate) => {
    setEditingId(template.id);
    setTitle(template.title);
    setDescription(template.description);
    setSystemInstruction(template.systemInstruction);
    setFormError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setSystemInstruction('');
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Please enter a Template Title.');
      return;
    }

    if (!systemInstruction.trim()) {
      setFormError('Please enter the System Instruction template.');
      return;
    }

    const templateData = {
      title: title.trim(),
      description: description.trim(),
      systemInstruction: systemInstruction,
      variables: parsedVariables,
    };

    if (editingId) {
      onUpdateTemplate(editingId, templateData);
      setEditingId(null);
    } else {
      onAddTemplate(templateData);
    }

    setTitle('');
    setDescription('');
    setSystemInstruction('');
    setFormError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto animate-fade-in p-2">
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel rounded-2xl border border-border-clinical p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tech-blue via-tech-cyan to-tech-purple" />
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-tech-cyan" />
            {editingId ? 'Edit Prompt Template' : 'Create Prompt Template'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Template Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SaaS Blog Writer, Code Optimizer..."
                className="w-full px-4 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-tech-cyan transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Short Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Write search-optimized copy for marketing products..."
                className="w-full px-4 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-tech-cyan transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Instruction & Prompts Template *
                </label>
                <div className="group relative flex items-center text-text-muted hover:text-white cursor-help">
                  <Info className="w-3.5 h-3.5" />
                  <span className="absolute bottom-6 right-0 w-64 p-3 bg-bg-dark border border-border-clinical text-[11px] text-text-secondary rounded-lg shadow-xl opacity-0 scale-95 origin-bottom-right group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none z-10 leading-relaxed">
                    Write instructions normally. Wrap variables in double brackets like <code className="text-tech-cyan bg-tech-cyan/5 px-1 py-0.5 rounded font-mono">{"{{topic}}"}</code>. They will dynamically compile into form fields for users.
                  </span>
                </div>
              </div>
              <textarea
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                rows={7}
                placeholder={`You are a world-class copywriter. Write a blog article about {{topic}} for a {{audience}} audience. Ensure the tone is {{tone}} and focus on details like {{specific_focus}}.`}
                className="w-full px-4 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white placeholder-text-muted font-mono text-sm focus:outline-none focus:ring-2 focus:ring-tech-cyan transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Detected Variables ({parsedVariables.length})
              </span>
              {parsedVariables.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 bg-bg-darker border border-border-clinical rounded-xl">
                  {parsedVariables.map((v) => (
                    <span
                      key={v}
                      className="px-2.5 py-1 text-xs font-mono font-semibold bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan rounded-lg shadow-cyan-glow"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-text-muted italic p-3 bg-bg-darker border border-border-clinical/40 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  No variables found. Wrap dynamic fields in double curly brackets to generate form inputs.
                </div>
              )}
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-xs text-tech-rose bg-tech-rose/5 border border-tech-rose/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-1/2 flex items-center justify-center gap-2 py-3 bg-border-clinical hover:bg-bg-card-hover rounded-xl text-sm font-medium text-white transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
              <button
                type="submit"
                className={`flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-tech-blue to-tech-cyan rounded-xl text-sm font-semibold text-white hover:opacity-95 transition-all shadow-cyan-glow hover:shadow-cyan-glow-intense ${
                  editingId ? 'w-1/2' : 'w-full'
                }`}
              >
                <Save className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Template'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <LayoutGrid className="w-5 h-5 text-tech-blue" />
            My Templates Catalogue
          </h2>
          <span className="text-xs font-mono text-text-secondary bg-bg-card border border-border-clinical px-2.5 py-1 rounded-full">
            Total: {templates.length}
          </span>
        </div>

        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-1">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group relative flex flex-col justify-between p-5 bg-bg-card border border-border-clinical rounded-2xl shadow-lg hover:border-tech-blue/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 border border-transparent rounded-2xl group-hover:border-tech-cyan/20 pointer-events-none transition-colors" />

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-tech-cyan transition-colors truncate pr-4">
                      {template.title}
                    </h3>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {template.description || 'No description provided.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {template.variables.length > 0 ? (
                      template.variables.slice(0, 3).map((v) => (
                        <span key={v} className="px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-bg-darker border border-border-clinical text-text-secondary rounded">
                          {v}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-text-muted italic">Static prompt (0 variables)</span>
                    )}
                    {template.variables.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono bg-bg-darker border border-border-clinical text-tech-cyan rounded font-bold">
                        +{template.variables.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border-clinical/50 pt-4 mt-5">
                  <span className="text-[10px] text-text-muted font-mono">
                    {new Date(template.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit',
                    })}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(template)}
                      className="p-2 bg-bg-dark border border-border-clinical text-text-secondary hover:text-tech-cyan hover:border-tech-cyan/30 rounded-lg transition-colors group/btn"
                      title="Edit Template"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(template.id)}
                      className="p-2 bg-bg-dark border border-border-clinical text-text-secondary hover:text-tech-rose hover:border-tech-rose/30 rounded-lg transition-colors group/btn"
                      title="Delete Template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-bg-card border border-border-clinical border-dashed rounded-2xl text-center space-y-4">
            <div className="p-4 bg-bg-darker rounded-full border border-border-clinical">
              <LayoutGrid className="w-8 h-8 text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">No Prompt Templates Found</p>
              <p className="text-xs text-text-secondary mt-1">Create your first dynamic form prompt using the builder panel on the left.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
