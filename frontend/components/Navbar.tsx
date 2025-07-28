import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Get Started', href: '#getstarted' },
];

export const Navbar: React.FC = () => (
  <nav className="w-full flex items-center justify-between px-8 py-3 bg-[#1a1f1b] text-white fixed top-0 left-0 z-50 shadow-sm border-b">
    <div className="flex items-center font-bold text-xl text-[#8854e0]">
      <Image src="/a2.png" alt="Alora Logo" width={32} height={32} className="mr-2 rounded-full" />
      Alora
    </div>
    <div className="hidden md:flex gap-6 text-sm font-medium">
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className="hover:text-[#8854e0] transition-colors cursor-pointer">
          {item.label}
        </a>
      ))}
    </div>
    <div className="flex gap-2">
      <Link href="/login" className="px-4 py-2 rounded-md bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">Log in</Link>
      <Link href="/signup" className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-[#8854e0] hover:text-white transition-colors">Sign up</Link>
    </div>
  </nav>
); 