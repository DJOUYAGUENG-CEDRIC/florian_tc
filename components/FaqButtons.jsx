'use client';

const FAQ_QUESTIONS = [
  'Comment avoir les failles Apple of Fortune ?',
  "Comment s'inscrire ?",
  'Quelles sont les conditions ?',
];

export default function FaqButtons({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {FAQ_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(question)}
          className="text-xs font-semibold rounded-full px-3 py-1.5 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: '#ffffff', color: '#229ED9', border: '1px solid #C9E6F7' }}
        >
          {question}
        </button>
      ))}
    </div>
  );
}
