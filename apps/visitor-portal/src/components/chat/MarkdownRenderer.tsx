import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@musetrip360/ui-core';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom heading styles
          h1: ({ children }) => <h1 className="text-lg font-bold text-foreground mb-2 mt-4 first:mt-0">{children}</h1>,
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-foreground mb-2 mt-3 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-medium text-foreground mb-1 mt-2 first:mt-0">{children}</h3>
          ),

          // Paragraph styling
          p: ({ children }) => <p className="text-sm text-foreground mb-2 last:mb-0 leading-relaxed">{children}</p>,

          // List styling
          ul: ({ children }) => <ul className="text-sm text-foreground mb-2 pl-4 space-y-1">{children}</ul>,
          ol: ({ children }) => (
            <ol className="text-sm text-foreground mb-2 pl-4 space-y-1 list-decimal">{children}</ol>
          ),
          li: ({ children }) => <li className="text-sm leading-relaxed marker:text-muted-foreground">{children}</li>,

          // Code styling
          code: ({ children, className }) => {
            return (
              <code className={cn('block bg-muted p-3 rounded text-xs font-mono overflow-x-auto', className)}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>
          ),

          // Blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-3 my-2 text-sm text-muted-foreground italic">
              {children}
            </blockquote>
          ),

          // Link styling
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline text-sm"
            >
              {children}
            </a>
          ),

          // Table styling
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border border-border rounded text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
          th: ({ children }) => <th className="border border-border px-2 py-1 text-left font-medium">{children}</th>,
          td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,

          // Strong and em styling
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
