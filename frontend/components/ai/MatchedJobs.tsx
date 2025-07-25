import React from 'react';

interface Job {
  title: string;
  company?: string;
  score?: number;
  skills?: string;
  description?: string;
}

interface MatchedJobsProps {
  jobs: Job[];
}

export const MatchedJobs: React.FC<MatchedJobsProps> = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return <div className="text-gray-500">No matched jobs found.</div>;
  }
  return (
    <div className="space-y-4">
      {jobs.map((job, i) => (
        <div key={i} className="p-4 rounded-lg bg-primary-50 dark:bg-gray-800 shadow">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold text-primary-700 dark:text-primary-300">{job.title || 'Job Match'}</div>
            {job.score !== undefined && (
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Relevance: {job.score}</span>
            )}
          </div>
          {job.company && <div className="text-xs text-gray-500 mb-1">{job.company}</div>}
          {job.skills && (
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              {job.skills.split(/,|\n/).map((skill, j) => (
                <span key={j} className="px-2 py-1 rounded bg-primary-100 text-primary-700 text-xs">{skill.trim()}</span>
              ))}
            </div>
          )}
          {job.description && (
            <div className="mt-1 text-xs text-gray-700 dark:text-gray-300 line-clamp-3">{job.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}; 