import React from 'react';

interface AIScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const AIScore: React.FC<AIScoreProps> = ({ score, size = 80, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100));
  const offset = circumference - (progress / 100) * circumference;
  let color = '#ef4444'; // red
  if (score >= 70) color = '#8854e0'; // green
  else if (score >= 40) color = '#eab308'; // yellow

  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white">
        {score}
      </span>
    </div>
  );
}; 