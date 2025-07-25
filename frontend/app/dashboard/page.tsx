"use client";
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Resume {
  id: number;
  filename: string;
  originalname: string;
  createdAt: string;
}
interface ResumeAnalysis {
  score: number;
  skills: string;
  suggestions: string;
}
interface ResumeWithAnalysis {
  resume: Resume;
  analysis: ResumeAnalysis | null;
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery<ResumeWithAnalysis[]>({
    queryKey: ['resumes'],
    queryFn: async () => {
      const accessToken = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:5000/resumes', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return res.data as ResumeWithAnalysis[];
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1f1b] flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1f1b]">
        <div className='flex items-center'>
            <Image src="/a2.png" alt="Alora Logo" width={32} height={32} className="mr-2 rounded-full" />
            <h1 className="text-2xl font-bold text-[#8854e0]">Alora</h1>
        </div>
        <div className='flex items-center gap-4'>
          <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">Logout</button>
        </div>
      </header>
      {/* Main Content */}
      <main className="w-full flex-1 mx-auto">
        <div className='h-screen flex flex-col items-center justify-center gap-4 relative h-96 overflow-hidden rounded-xl'>
          <div className='absolute inset-0 z-0'>
            <video 
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-65"
            >
              <source src="/myvideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <h1 className='text-5xl font-bold text-white z-10'>Welcome to <span className='text-[#8854e0]'>Alora</span></h1>
          <p className='text-gray-300 z-10'>Upload your resume and get a score and analysis of your resume</p>
          <Link href="/upload" className="px-5 py-2 rounded-md bg-[#8854e0] text-white font-semibold shadow hover:bg-[#8854e0]/80 transition z-10">Upload Resume</Link>
        </div>
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white mt-12 text-center">Your <span className='text-[#8854e0]'>Resumes</span></h2>
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading resumes...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Failed to load resumes. Please try again.</div>
        ) : !data || data.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No resumes found. <Link href="/upload" className="text-primary-500 hover:underline">Upload your first resume</Link>.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 px-20 py-10">
            {data.map(({ resume, analysis }) => (
              <Card key={resume.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{resume.originalname}</span>
                  {analysis ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Score: {analysis.score}</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold">No Score</span>
                  )}
                </div>
                {analysis && analysis.skills && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.skills.split(/,|\n/).map((skill, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-primary-100 text-primary-700 text-xs">{skill.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">Uploaded: {new Date(resume.createdAt).toLocaleDateString()}</div>
                <Link href={`/dashboard/resumes/${resume.id}`} className="mt-2 text-[#8854e0] hover:underline text-sm font-medium">View Details</Link>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 