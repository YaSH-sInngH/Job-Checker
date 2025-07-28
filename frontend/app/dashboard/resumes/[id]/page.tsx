"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from "next/link";
import { AIScore } from "@/components/ai/AIScore";
import { SkillTags } from "@/components/ai/SkillTags";

type Job = {
  title?: string;
  jobTitle?: string;
  company?: string;
  skills?: string;
  description?: string;
};

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Use state to store accessToken
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("access_token"));
    }
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["resume", id, accessToken],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/resumes/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    },
    enabled: !!id && !!accessToken, // Only run when accessToken is set
  });

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["resume-matches", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/resumes/${id}/matches`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    },
    enabled: !!id && !!accessToken,
  });

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-primary-500"><LoadingSpinner size={32} /> Loading resume...</div>;
  }
  if (isError || !data) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">Failed to load resume. <button onClick={() => router.back()} className="ml-2 underline">Go back</button></div>;
  }

  const { resume, analysis } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1f1b] flex flex-col items-center px-2 sm:px-4 py-6 sm:py-10">
      <div className="w-full max-w-3xl">
        <Link href="/dashboard" className="text-white hover:underline underline-offset-4 decoration-[#8854e0] mb-3 sm:mb-4 inline-block py-3 sm:py-6 text-sm sm:text-base">&larr; Back to Dashboard</Link>
        <div className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-white underline underline-offset-4 decoration-[#8854e0]">
          Your <span className="text-[#8854e0]">Resume</span>
        </div>
        
        <div className="mb-6 sm:mb-8">
          <h1 className="text-lg sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white break-words">{resume.originalname}</h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 items-start sm:items-center mb-4">
            {analysis && <AIScore score={analysis.score} />}
            <span className="text-xs text-gray-500">Uploaded: {new Date(resume.createdAt).toLocaleDateString()}</span>
          </div>
          {analysis && analysis.skills && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
              <SkillTags skills={analysis.skills.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean)} />
            </div>
          )}
          {analysis && (
            <div className="mb-4">
              <h2 className="font-semibold mb-1 text-gray-900 dark:text-white text-sm sm:text-base">Improvement Suggestions:</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm sm:text-base space-y-1">
                {analysis.suggestions
                  .split(/\n|\r/)
                  .map((tip: string) => tip.replace(/^[-•]\s*/, '').trim())
                  .filter((tip: string) => tip && !/^(for Improvement:|\d+\.?)$/i.test(tip))
                  .map((tip: string, i: number) => (
                    <li key={i} className="break-words">{tip}</li>
                  ))}
              </ul>
              {analysis.scoreExplanation && (
                <div className="mt-4 p-3 sm:p-4 rounded bg-primary-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                  {analysis.scoreExplanation}
                </div>
              )}
            </div>
          )}
          <div className="mb-4">
            <h2 className="font-semibold mb-1 text-gray-900 dark:text-white text-sm sm:text-base">Parsed Resume Text:</h2>
            <div className="bg-gray-100 dark:bg-[#8854e0]/40 rounded p-2 sm:p-3 text-xs sm:text-sm text-gray-800 dark:text-gray-200 max-h-48 sm:max-h-60 overflow-y-auto whitespace-pre-line">
              {resume.text}
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-white underline underline-offset-4 decoration-[#8854e0]">Matched <span className="text-[#8854e0]">Jobs</span></h2>
          {matchesLoading ? (
            <div className="flex items-center gap-2 text-primary-500 text-sm sm:text-base"><LoadingSpinner size={20} /> Loading matches...</div>
          ) : matches && matches.length > 0 ? (
            <ul className="space-y-3">
              {matches.map((job: Job, i: number) => (
                <li key={i} className="p-3 sm:p-4 rounded-lg bg-[#8854e0]/20 dark:bg-[#8854e0]/30">
                  <div className="font-semibold text-white text-sm sm:text-base break-words">{job.title || job.jobTitle || 'Job Match'}</div>
                  {job.company && <div className="text-sm sm:text-base text-[#8854e0] break-words">{job.company}</div>}
                  {job.skills && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                      {job.skills.split(/,|\n/).map((skill: string, j: number) => (
                        <span key={j} className="px-2 py-1 rounded bg-black/50 text-[#8854e0] text-xs break-words">{skill.trim()}</span>
                      ))}
                    </div>
                  )}
                  {job.description && (
                    <div className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-3 break-words">{job.description}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 text-sm sm:text-base">No matched jobs found.</div>
          )}
        </div>
      </div>
    </div>
  );
} 