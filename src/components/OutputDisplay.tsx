import { useState } from 'react';
import { Copy, Check, Terminal, Loader, AlertTriangle, CornerDownLeft } from 'lucide-react';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  output,
  isLoading,
  isStreaming,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="glass-panel rounded-2xl border border-tech-rose/20 p-6 shadow-xl space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-tech-rose/10 border border-tech-rose/25 text-tech-rose">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Execution Failed</h3>
            <p className="text-xs text-text-secondary mt-0.5">Gemini could not complete this request.</p>
          </div>
        </div>
        <div className="p-4 bg-bg-darker border border-border-clinical rounded-xl text-xs text-text-secondary leading-relaxed font-mono overflow-x-auto">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-border-clinical p-6 shadow-xl space-y-5 relative overflow-hidden flex flex-col h-full min-h-[400px] animate-fade-in">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tech-blue via-tech-cyan to-tech-purple" />

      <div className="flex items-center justify-between border-b border-border-clinical pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Terminal className="w-4 h-4 text-tech-cyan" />
            {(isLoading || isStreaming) && (
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-tech-cyan animate-ping" />
            )}
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Streaming Console Output
          </span>
        </div>

        {output && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-white bg-bg-dark border border-border-clinical hover:border-tech-cyan/30 rounded-xl transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-tech-emerald" />
                <span className="text-tech-emerald">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-text-muted" />
                <span>Copy Output</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="grow overflow-y-auto pr-1 select-text space-y-4 min-h-[300px]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full space-y-3 py-16 animate-pulse">
            <Loader className="w-6 h-6 animate-spin text-tech-cyan" />
            <p className="text-xs font-semibold text-text-secondary tracking-wider uppercase">
              Establishing Handshake...
            </p>
          </div>
        )}

        {!isLoading && !output && (
          <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center space-y-3">
            <div className="p-3 bg-bg-darker border border-border-clinical rounded-2xl text-text-muted animate-pulse-glow">
              <CornerDownLeft className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Awaiting Execution</h4>
            <p className="text-[11px] text-text-secondary max-w-[240px] leading-relaxed">
              Fill out the variables form and click "Compile & Run" to initiate the Gemini stream.
            </p>
          </div>
        )}

        {output && (
          <div className="markdown-body font-sans text-sm text-text-secondary leading-relaxed space-y-4 break-words">
            {parseMarkdown(output)}
          </div>
        )}
        
        {isStreaming && (
          <div className="flex items-center gap-2 mt-4 text-xs font-mono text-tech-cyan/80 bg-tech-cyan/5 border border-tech-cyan/15 px-3 py-2 rounded-xl w-max animate-pulse">
            <span className="w-1.5 h-1.5 bg-tech-cyan rounded-full animate-ping" />
            <span>Receiving active stream packets...</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border-clinical bg-bg-darker shadow-lg">
      <div className="flex items-center justify-between bg-bg-dark px-4 py-2 border-b border-border-clinical/60">
        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <Terminal className="w-3.5 h-3.5 text-tech-cyan" />
          <span className="text-white text-[11px] font-semibold">{language || 'code'}</span>
        </div>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-bg-darker hover:bg-border-clinical border border-border-clinical/80 text-text-secondary hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-tech-emerald" />
              <span className="text-tech-emerald">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-white leading-relaxed bg-[#020617] max-h-96">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const parseMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;

  const blocks = text.split(/(```[\s\S]*?```)/g);

  return blocks.map((block, index) => {
    if (block.startsWith('```')) {
      const match = block.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : 'code';
      const code = match ? match[2] : block.replace(/```/g, '');

      return <CodeBlock key={index} code={code.trim()} language={language} />;
    }

    return (
      <div key={index} className="space-y-2.5">
        {block.split('\n').map((line, lineIndex) => {
          const trimmed = line.trim();

          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={lineIndex} className="text-xl font-bold text-white pt-4 pb-1 border-b border-border-clinical/50 leading-tight">
                {parseInline(trimmed.slice(2))}
              </h1>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={lineIndex} className="text-lg font-bold text-white pt-3 pb-1 leading-snug">
                {parseInline(trimmed.slice(3))}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={lineIndex} className="text-base font-bold text-white pt-2 leading-normal">
                {parseInline(trimmed.slice(4))}
              </h3>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={lineIndex} className="text-sm font-bold text-white pt-1">
                {parseInline(trimmed.slice(5))}
              </h4>
            );
          }

          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
              <ul key={lineIndex} className="list-disc pl-5 space-y-1 my-0.5">
                <li className="text-xs text-text-secondary leading-relaxed">
                  {parseInline(trimmed.slice(2))}
                </li>
              </ul>
            );
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const content = trimmed.replace(/^\d+\.\s/, '');
            const number = trimmed.match(/^(\d+)\.\s/)?.[1] || '1';
            return (
              <ol key={lineIndex} className="list-decimal pl-5 space-y-1 my-0.5" start={parseInt(number)}>
                <li className="text-xs text-text-secondary leading-relaxed">
                  {parseInline(content)}
                </li>
              </ol>
            );
          }

          if (trimmed === '---') {
            return <hr key={lineIndex} className="border-border-clinical/60 my-4" />;
          }

          if (trimmed === '') {
            return <div key={lineIndex} className="h-1.5" />;
          }

          return (
            <p key={lineIndex} className="text-xs text-text-secondary leading-relaxed">
              {parseInline(line)}
            </p>
          );
        })}
      </div>
    );
  });
};

const parseInline = (text: string): React.ReactNode[] => {
  let elements: React.ReactNode[] = [text];

  elements = splitAndMap(elements, /\*\*(.*?)\*\*/g, (match, key) => (
    <strong key={key} className="font-bold text-white">{match}</strong>
  ));

  elements = splitAndMap(elements, /\*([^*]+)\*/g, (match, key) => (
    <em key={key} className="italic text-text-primary">{match}</em>
  ));

  elements = splitAndMap(elements, /`([^`]+)`/g, (match, key) => (
    <code key={key} className="px-1.5 py-0.5 rounded bg-bg-darker border border-border-clinical text-tech-cyan text-[11px] font-mono">
      {match}
    </code>
  ));

  return elements;
};

const splitAndMap = (
  nodes: React.ReactNode[],
  regex: RegExp,
  mapper: (match: string, index: number) => React.ReactNode
): React.ReactNode[] => {
  const result: React.ReactNode[] = [];

  nodes.forEach((node) => {
    if (typeof node !== 'string') {
      result.push(node);
      return;
    }

    regex.lastIndex = 0;
    const parts = node.split(regex);
    
    parts.forEach((part, index) => {
      if (index % 2 === 1) {
        result.push(mapper(part, result.length));
      } else if (part) {
        result.push(part);
      }
    });
  });

  return result;
};
