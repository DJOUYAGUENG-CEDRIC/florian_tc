'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Markdown fusionne les retours à la ligne simples. On les transforme en
 * sauts de ligne "durs" pour que chaque étape citée par l'assistant reste
 * bien sur sa propre ligne.
 */
function preserveLineBreaks(raw) {
  return raw
    .split('\n')
    .map((line) => (line.trim() === '' ? line : `${line.replace(/\s+$/, '')}  `))
    .join('\n');
}

const mdComponents = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
};

export default function ChatBubble({ sender, text, children }) {
  const isUser = sender === 'user';

  let content;
  if (isUser) {
    content = <p style={{ whiteSpace: 'pre-wrap' }}>{text ?? children}</p>;
  } else if (text) {
    content = (
      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {preserveLineBreaks(text)}
        </ReactMarkdown>
      </div>
    );
  } else {
    content = children;
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm"
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #229ED9, #0F7FB3)',
                color: '#ffffff',
                borderBottomRightRadius: '4px',
                lineHeight: '1.5',
              }
            : {
                background: '#ffffff',
                color: '#0B4F6C',
                border: '1px solid #C9E6F7',
                borderBottomLeftRadius: '4px',
              }
        }
      >
        {content}
      </div>
    </div>
  );
}
