'use client'

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-[#1a1f1b] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section id="home" className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"> <span className='text-[#8854e0]'>Alora</span> is your <span className='text-[#8854e0]'>AI</span>-powered job search and resume assistant<span className='text-[#8854e0]'>.</span></h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-white mb-10">Get started in <span className='text-[#8854e0]'>3</span> simple steps:</p>
          <motion.div
            className="flex flex-col md:flex-row gap-6 justify-center items-center w-full"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            {[1, 2, 3].map((num, index) => (
              <React.Fragment key={num}>
                <motion.div
                  className="flex flex-col items-center"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <div className="w-12 h-12 rounded-full dark:bg-[#8854e0] text-white flex items-center justify-center text-2xl font-bold mb-2">
                    {num}
                  </div>
                  <span className="font-medium text-black dark:text-white underline-offset-4 underline decoration-[#8854e0]">
                    {num === 1
                      ? "Upload resume"
                      : num === 2
                        ? "Get your score"
                        : "Matched jobs"}
                  </span>
                </motion.div>

                {/* Arrow between steps, not after the last one */}
                {index < 2 && (
                  <motion.span
                    className="hidden md:block text-3xl text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.3 }}
                  >
                    →
                  </motion.span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">Why <span className='text-[#8854e0]'>Alora</span>?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <Image src="/c1.jpg" alt="Upload Resume" width={340} height={80} className="mb-4 rounded-lg shadow-sm object-cover" />
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Easy <span className='text-[#8854e0]'>Resume</span> Uploads</h3>
              <p className="text-gray-600">Upload your PDF or DOCX resume in seconds. We handle parsing and storage securely.</p>
            </Card>
            <Card>
              <Image src="/c2.jpg" alt="Upload Resume" width={340} height={100} className="mb-4 rounded-lg shadow-sm object-cover" />
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white"><span className='text-[#8854e0]'>AI-Powered</span> Insights</h3>
              <p className="text-gray-600">Get instant feedback, skill extraction, and improvement tips powered by advanced AI models.</p>
            </Card>
            <Card>
              <Image src="/c3.jpg" alt="Upload Resume" width={340} height={80} className="mb-4 rounded-lg shadow-sm object-cover" />
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Smart <span className='text-[#8854e0]'>Job</span> Matching</h3>
              <p className="text-gray-600">See jobs that best match your resume using vector search and real-time AI matching.</p>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">What our <span className='text-[#8854e0]'>users</span> say<span className='text-[#8854e0] p-1'>.</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <p className="text-lg italic mb-4 text-black dark:text-white">“Alora made my job search so much easier. The AI feedback was spot on!”</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <div className="font-semibold text-[#8854e0]">Alex P.</div>
                  <div className="text-xs text-gray-500">Software Engineer</div>
                </div>
              </div>
            </Card>
            <Card>
              <p className="text-lg italic mb-4 text-black dark:text-white">“I loved how quickly I got matched to relevant jobs. Highly recommend!”</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <div className="font-semibold text-[#8854e0]">Maria G.</div>
                  <div className="text-xs text-gray-500">Product Manager</div>
                </div>
              </div>
            </Card>
            <Card>
              <p className="text-lg italic mb-4 text-black dark:text-white">“The resume score and improvement tips helped me land more interviews.”</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <div className="font-semibold text-[#8854e0]">Samir K.</div>
                  <div className="text-xs text-gray-500">Data Analyst</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Creative CTA Section */}
        <section id="getstarted" className="max-w-full h-screen mx-auto px-4 py-16 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-xl min-h-[400px]">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-75"
            >
              <source src="/video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Content with higher z-index */}
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">Ready to get <span className='text-[#8854e0]'>started</span>?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Let Alora help you land your dream job. Upload your resume, get instant feedback, and discover jobs tailored for you.</p>
            <Link href="/login" className="px-8 py-3 rounded-md text-white font-semibold text-lg shadow bg-[#8854e0] hover:bg-[#6f3dc7] transition">Start Now</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
