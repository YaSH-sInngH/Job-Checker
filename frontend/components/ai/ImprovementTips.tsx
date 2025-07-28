import React, { useState } from 'react';

interface ImprovementTipsProps {
  tips: string[];
}

export const ImprovementTips: React.FC<ImprovementTipsProps> = ({ tips }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!tips || tips.length === 0) return null;
  return (
    <div className="space-y-3">
      {tips.map((tip, i) => (
        <div key={i} className="rounded-lg bg-primary-50 dark:bg-gray-800 p-4 shadow cursor-pointer transition hover:shadow-md" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-white">Tip {i + 1}</span>
            <span className={`transform transition-transform ${openIndex === i ? 'rotate-90' : ''}`}>▶</span>
          </div>
          {openIndex === i && (
            <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">{tip}</div>
          )}
        </div>
      ))}
    </div>
  );
}; 