import React from 'react';

interface SkillTagsProps {
  skills: string[];
  max?: number;
}

export const SkillTags: React.FC<SkillTagsProps> = ({ skills, max = 5 }) => {
  const displaySkills = skills.slice(0, max);
  const extra = skills.length - max;
  return (
    <div className="flex flex-wrap gap-2">
      {displaySkills.map((skill, i) => (
        <span key={i} className="px-2 py-1 rounded bg-primary-100 text-primary-700 text-xs font-medium">
          {skill}
        </span>
      ))}
      {extra > 0 && (
        <span className="px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs font-medium cursor-pointer">
          +{extra} more
        </span>
      )}
    </div>
  );
}; 