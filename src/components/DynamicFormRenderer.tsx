import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import type { PromptTemplate } from '../types';

interface DynamicFormRendererProps {
  selectedTemplate: PromptTemplate | null;
  onGenerate: (substitutedPrompt: string, systemInstruction?: string) => Promise<void>;
  isLoading: boolean;
  isStreaming: boolean;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  selectedTemplate,
  onGenerate,
  isLoading,
  isStreaming,
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTemplate) {
      const initialValues: Record<string, string> = {};
      selectedTemplate.variables.forEach((variable) => {
        initialValues[variable] = '';
      });
      setFormValues(initialValues);
      setValidationError(null);
    }
  }, [selectedTemplate]);

  if (!selectedTemplate) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 bg-bg-card/30 border border-border-clinical/50 border-dashed rounded-2xl">
        <div className="p-4 bg-bg-darker rounded-full border border-border-clinical mb-4 animate-pulse-glow">
          <FileText className="w-8 h-8 text-text-muted" />
        </div>
        <p className="text-sm font-semibold text-white">No Template Selected</p>
        <p className="text-xs text-text-secondary mt-1 max-w-sm leading-relaxed">
          Please select a template from the left sidebar or the recent forms list to load its interactive UI form.
        </p>
      </div>
    );
  }

  const handleInputChange = (variableName: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [variableName]: value,
    }));
    if (validationError) setValidationError(null);
  };

  const substituteVariables = (text: string, values: Record<string, string>): string => {
    let result = text;
    Object.entries(values).forEach(([variable, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${variable}\\s*\\}\\}`, 'g');
      result = result.replace(regex, value.trim());
    });
    return result;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const unfilledVariables = selectedTemplate.variables.filter(
      (v) => !formValues[v] || !formValues[v].trim()
    );

    if (unfilledVariables.length > 0) {
      const fieldNames = unfilledVariables.map((v) => `"${v}"`).join(', ');
      setValidationError(`Please fill out all dynamic fields: ${fieldNames}.`);
      return;
    }

    setValidationError(null);

    const substitutedText = substituteVariables(selectedTemplate.systemInstruction, formValues);

    await onGenerate(
      substitutedText,
      "You are an expert AI prompt execution engine. Perform the user's detailed instructions exactly as formulated."
    );
  };

  const isMultiLineField = (variableName: string): boolean => {
    const term = variableName.toLowerCase();
    const multilineKeywords = [
      'context',
      'description',
      'background',
      'instruction',
      'body',
      'article',
      'code',
      'text',
      'prompt',
      'content',
      'details'
    ];
    return multilineKeywords.some((keyword) => term.includes(keyword));
  };

  const formatLabel = (variableName: string): string => {
    return variableName
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="glass-panel rounded-2xl border border-border-clinical p-6 shadow-xl space-y-6 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tech-blue via-tech-cyan to-tech-purple" />

      <div className="space-y-1.5 border-b border-border-clinical pb-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-tech-cyan uppercase tracking-widest bg-tech-cyan/10 border border-tech-cyan/20 px-2 py-0.5 rounded">
            Interactive Form
          </span>
          <span className="text-[10px] text-text-muted font-mono uppercase">
            Gemini 2.5 Flash
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
          {selectedTemplate.title}
        </h2>
        {selectedTemplate.description && (
          <p className="text-xs text-text-secondary leading-relaxed">
            {selectedTemplate.description}
          </p>
        )}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        {selectedTemplate.variables.length > 0 ? (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {selectedTemplate.variables.map((variable) => {
              const isLongField = isMultiLineField(variable);
              const label = formatLabel(variable);
              
              return (
                <div key={variable} className="space-y-1.5 animate-scale-up">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {label} *
                  </label>
                  
                  {isLongField ? (
                    <textarea
                      value={formValues[variable] || ''}
                      onChange={(e) => handleInputChange(variable, e.target.value)}
                      rows={4}
                      placeholder={`Provide detailed ${label.toLowerCase()} content here...`}
                      disabled={isLoading || isStreaming}
                      className="w-full px-4 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-tech-cyan disabled:text-text-muted disabled:bg-opacity-50 transition-all resize-none leading-relaxed text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formValues[variable] || ''}
                      onChange={(e) => handleInputChange(variable, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      disabled={isLoading || isStreaming}
                      className="w-full px-4 py-3 bg-bg-darker border border-border-clinical rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-tech-cyan disabled:text-text-muted disabled:bg-opacity-50 transition-all text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-bg-darker border border-border-clinical rounded-xl text-center text-xs text-text-secondary leading-relaxed">
            This is a static instruction form template. No parameters are required. Click "Compile & Generate" below to trigger execution.
          </div>
        )}

        {validationError && (
          <div className="flex items-center gap-2 text-xs text-tech-rose bg-tech-rose/5 border border-tech-rose/20 p-3 rounded-lg animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || isStreaming}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-tech-blue via-tech-cyan to-tech-purple rounded-xl text-sm font-semibold text-white hover:opacity-95 transition-all shadow-cyan-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-cyan-glow-intense"
        >
          {isLoading || isStreaming ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Streaming Gemini Response...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Compile & Run Prompts</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
