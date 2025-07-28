"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import type { DropzoneOptions } from 'react-dropzone';
import Link from "next/link";

export default function UploadPage() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    if (!acceptedFiles.length) return;
    setUploadState('uploading');
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const accessToken = localStorage.getItem('access_token');
      const res = await axios.post('http://localhost:5000/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUploadState('processing');
      // Simulate processing delay (remove in production)
      setTimeout(() => {
        setUploadState('success');
        // Redirect to resume detail page
        router.push(`/dashboard/resumes/${res.data.resume.id}`);
      }, 1200);
    } catch (err) {
      let message = 'Upload failed';
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      setError(message);
      setUploadState('error');
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
    maxFiles: 1,
    // Do not pass HTML event props like onDragEnter, onDragOver, onDragLeave
  } as DropzoneOptions);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a1f1b] px-4">
      <Link href="/dashboard" className="absolute top-10 left-10 text-black dark:text-white underline-offset-4 hover:underline decoration-[#8854e0]">&#x2190; Back to Home</Link>
      <Card className="w-full max-w-lg mx-auto p-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Upload Your Resume</h1>
        <div
          {...getRootProps()}
          className={`w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18181b]'}`}
        >
          <input {...getInputProps({})} />
          <span className="text-4xl mb-2">📄</span>
          <p className="text-gray-700 dark:text-gray-300 mb-1">Drag & drop a PDF or DOCX file here, or click to select</p>
          <p className="text-xs text-gray-400">Supported formats: .pdf, .docx</p>
        </div>
        {uploadState === 'uploading' && (
          <div className="flex items-center gap-2 text-primary-500"><LoadingSpinner size={20} /> Uploading...</div>
        )}
        {uploadState === 'processing' && (
          <div className="flex items-center gap-2 text-primary-500"><LoadingSpinner size={20} /> Processing with AI...</div>
        )}
        {uploadState === 'success' && (
          <div className="text-green-600 font-medium">Upload successful! Redirecting...</div>
        )}
        {uploadState === 'error' && error && (
          <div className="text-red-500 font-medium">{error}</div>
        )}
      </Card>
    </div>
  );
} 