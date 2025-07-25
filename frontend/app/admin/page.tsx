"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from "next/link";
import Image from "next/image";


const TABS = ["Overview", "Users", "Resumes"];

export default function AdminDashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [userSearch, setUserSearch] = useState("");
  const [modalSkills, setModalSkills] = useState<string[] | null>(null);
  const [modalResume, setModalResume] = useState<any>(null);

  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token'));
  }, []);

  // Fetch users
  const { data: users, isLoading: usersLoading, isError: usersError } = useQuery({
    queryKey: ["admin-users", accessToken],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    },
    enabled: !!accessToken,
  });

  // Fetch resumes (with analysis)
  const { data: resumes, isLoading: resumesLoading, isError: resumesError } = useQuery({
    queryKey: ["admin-resumes", accessToken],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/admin/resumes", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    },
    enabled: !!accessToken,
  });

  // Analytics calculations
  const totalUsers = users?.length || 0;
  const totalResumes = resumes?.length || 0;
  const avgScore = useMemo(() => {
    if (!resumes || resumes.length === 0) return 0;
    const scores = resumes.map((item: any) => item.analysis?.score).filter((s: number) => typeof s === 'number');
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
  }, [resumes]);
  

  // Top scores for overview
  const topScores = useMemo(() => {
    if (!resumes) return [];
    const sorted = [...resumes].filter((item: any) => item.analysis?.score)
      .sort((a: any, b: any) => b.analysis.score - a.analysis.score)
      .slice(0, 5);
    return sorted;
  }, [resumes]);

  // User lookup for overview
  const userMap = useMemo(() => {
    if (!users) return {};
    const map: Record<number, any> = {};
    users.forEach((u: any) => { map[u.id] = u; });
    return map;
  }, [users]);

  // Filter users by search
  const filteredUsers = users?.filter((user: any) =>
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.username?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const closeModal = () => {
    setModalSkills(null);
    setModalResume(null);
  };

  return (
    <div className="min-h-screen bg-[#1a1f1b] flex flex-col items-center transition-colors duration-300">
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1f1b]">
        <div className='flex items-center'>
            <Image src="/a2.png" alt="Alora Logo" width={32} height={32} className="mr-2 rounded-full" />
            <h1 className="text-2xl font-bold text-[#8854e0]">Alora</h1>
        </div>
        <div className='flex items-center gap-4'>
          <Link href="/" className="px-4 py-2 rounded-md bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">Logout</Link>
        </div>
      </header>
      
      <div className="w-full max-w-6xl">
        <div className="mb-10 mt-10">
          <h1 className="text-4xl font-bold text-gray-500 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage users and monitor resume analytics</p>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex gap-10 mb-8 p-1 rounded-xl w-fit border">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
                activeTab === tab 
                  ? 'bg-[#8854e0] text-white shadow-lg transform scale-105' 
                  : 'text-white hover:text-white hover:bg-[#8854e0]/50'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="relative z-10">{tab}</span>
              {activeTab === tab && (
                <div className="absolute inset-0 bg-gradient-admin opacity-90 rounded-lg" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Overview" && (
          <>
            {/* Enhanced Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <Card className="group p-10 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl transition-colors duration-300">
                    <img src='./admin.png' alt="Users" className="w-12 h-12" />
                  </div>
                  <div className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    +12%
                  </div>
                </div>
                <div className="text-white text-sm font-medium tracking-wide uppercase mb-2">
                  Total Users
                </div>
                <div className="text-3xl font-bold text-white flex items-center gap-3">
                  {usersLoading ? <LoadingSpinner size={24}/> : totalUsers.toLocaleString()}
                </div>
              </Card>

              <Card className="group p-10 hover:scale-105 transition-all duration-300 cursor-pointer border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl transition-colors duration-300">
                    <img src='./cv.png' alt="Resumes" className="w-12 h-12" />
                  </div>
                  <div className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    +8%
                  </div>
                </div>
                <div className="text-white text-sm font-medium tracking-wide uppercase mb-2">
                  Total Resumes
                </div>
                <div className="text-3xl font-bold text-white flex items-center gap-3">
                  {resumesLoading ? <LoadingSpinner size={24}/> : totalResumes.toLocaleString()}
                </div>
              </Card>

              <Card className="group p-10 hover:scale-105 transition-all duration-300 cursor-pointer border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl transition-colors duration-300">
                    <img src='./score.png' alt="Score" className="w-12 h-12" />
                  </div>
                  <div className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    +5%
                  </div>
                </div>
                <div className="text-white text-sm font-medium tracking-wide uppercase mb-2">
                  Avg Score
                </div>
                <div className="text-3xl font-bold text-white flex items-center gap-3">
                  {resumesLoading ? <LoadingSpinner size={24}/> : avgScore}
                </div>
              </Card>
            </div>

            {/* Enhanced Top Scores Table */}
            <Card className="p-6 border-0 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-admin-purple/10 rounded-lg">
                  <img src='./score.png' alt="Top Scores" className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-white">Top Resume Scores</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">User</th>
                      <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Resume</th>
                      <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Score</th>
                      <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topScores.map((item: any, index: number) => (
                      <tr key={item.resume.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors duration-200">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#8854e0]/20 rounded-full flex items-center justify-center text-[#8854e0] font-semibold text-sm">
                              {index + 1}
                            </div>
                            <span className="font-medium text-white">
                              {userMap[item.resume.userId]?.username || userMap[item.resume.userId]?.email || 'User'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white max-w-xs truncate">
                          {item.resume.originalname}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#8854e0]/20 text-[#8854e0]">
                            {item.analysis?.score ?? 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {(() => {
                            const skillsArr = item.analysis?.skills?.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean) || [];
                            const showCount = 2;
                            return (
                              <div className="flex flex-wrap gap-1">
                                {skillsArr.slice(0, showCount).map((skill: string, i: number) => (
                                  <span key={i} className="inline-block px-2 py-1 rounded-md bg-primary-100 text-primary-700 text-xs font-medium">
                                    {skill}
                                  </span>
                                ))}
                                {skillsArr.length > showCount && (
                                  <button
                                    className="inline-flex items-center px-2 py-1 rounded-md bg-admin-purple text-white text-xs font-medium hover:bg-admin-purple-hover transition-colors duration-200 underline"
                                    onClick={() => { setModalSkills(skillsArr); setModalResume(item); }}
                                    type="button"
                                  >
                                    +{skillsArr.length - showCount} more
                                  </button>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {topScores.length === 0 && (
                  <div className="text-center py-12 text-white">
                    <img src='./score.png' alt="No data" className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No top scores available</p>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}

        {activeTab === "Users" && (
          <Card className="border-0">
            <div className="p-6 border-b border-border/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-admin-purple/10 rounded-lg">
                    <img src='./admin.png' alt="Users" className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">User Management</h2>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="w-full md:w-80 px-4 py-2 pl-10 rounded-lg border border-border bg-[#1a1f1b] text-white text-sm focus:outline-none focus:ring-2 focus:ring-admin-purple/20 focus:border-admin-purple transition-all duration-200"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size={32} />
                  <span className="ml-3 text-white">Loading users...</span>
                </div>
              ) : usersError ? (
                <div className="text-center py-12 text-destructive">
                  <p>Failed to load users. Please try again.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Email</th>
                        <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Username</th>
                        <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers?.map((user: any) => (
                        <tr key={user.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors duration-200">
                          <td className="py-3 px-4 text-white">{user.email}</td>
                          <td className="py-3 px-4 text-white">{user.username}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 capitalize">
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers?.length === 0 && (
                    <div className="text-center py-12 text-white">
                      <img src='./admin.png' alt="No users" className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No users found matching your search</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === "Resumes" && (
          <Card className="border-0">
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-admin-purple/10 rounded-lg">
                  <img src='./cv.png' alt="Resumes" className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-white">Resume Analytics</h2>
              </div>
            </div>
            <div className="p-5">
              {resumesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size={32} />
                  <span className="ml-3 text-white">Loading resumes...</span>
                </div>
              ) : resumesError ? (
                <div className="text-center py-12 text-destructive">
                  <p>Failed to load resumes. Please try again.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">User</th>
                        <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">File Name</th>
                        <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Score</th>
                        <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Skills</th>
                        <th className="text-left py-3 px-4 text-[#8854e0] font-semibold">Uploaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumes?.map((item: any) => (
                        <tr key={item.resume.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors duration-200">
                          <td className="py-3 px-4 text-white font-medium">
                            {userMap[item.resume.userId]?.username || userMap[item.resume.userId]?.email || 'User'}
                          </td>
                          <td className="py-3 px-4 text-white/80 max-w-xs truncate">
                            {item.resume.originalname}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#8854e0]/20 text-[#8854e0]">
                              {item.analysis?.score ?? 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {(() => {
                              const skillsArr = item.analysis?.skills?.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean) || [];
                              const showCount = 2;
                              return (
                                <div className="flex flex-wrap gap-1">
                                  {skillsArr.slice(0, showCount).map((skill: string, i: number) => (
                                    <span key={i} className="inline-block px-2 py-1 rounded-md bg-primary-100 text-primary-700 text-xs font-medium">
                                      {skill}
                                    </span>
                                  ))}
                                  {skillsArr.length > showCount && (
                                    <button
                                      className="inline-flex items-center px-2 py-1 rounded-md bg-[#8854e0] text-white text-xs font-medium hover:bg-[#8854e0]/80 transition-colors duration-200"
                                      onClick={() => { setModalSkills(skillsArr); setModalResume(item); }}
                                      type="button"
                                    >
                                      +{skillsArr.length - showCount} more
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="py-3 px-4 text-white/60 text-sm">
                            {new Date(item.resume.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {resumes?.length === 0 && (
                    <div className="text-center py-12 text-white">
                      <img src='./cv.png' alt="No resumes" className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No resumes found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Enhanced Modal */}
      {modalSkills && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-admin-card rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-in zoom-in-95 duration-300">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white hover:text-white hover:bg-[#8854e0]/50 transition-all duration-200"
              onClick={closeModal}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#8854e0]/10 rounded-lg">
                <img src='./cv.png' alt="Skills" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">All Skills</h3>
                <p className="text-sm text-white truncate">
                  {modalResume?.resume?.originalname || modalResume?.resume?.filename}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2">
              {modalSkills.map((skill, i) => (
                <span 
                  key={i} 
                  className="inline-block px-3 py-2 rounded-lg bg-primary-100 text-primary-700 text-sm font-medium hover:bg-primary-200 transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}