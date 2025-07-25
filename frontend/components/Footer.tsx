import React from 'react';
import Image from 'next/image';

const columns = [
  {
    title: 'Features',
    items: ['Plan', 'Build', 'Insights', 'Customer Requests', 'Alora Asks', 'Security', 'Mobile'],
  },
  {
    title: 'Product',
    items: ['Pricing', 'Method', 'Integrations', 'Documentation', 'Download'],
  },
  {
    title: 'Company',
    items: ['About', 'Customers', 'Careers', 'Blog', 'README',],
  },
  {
    title: 'Resources',
    items: ['Developers', 'Status', 'Startups', 'Privacy', 'Terms'],
  }
];

export const Footer: React.FC = () => (
  <footer className="w-full bg-[#1a1f1b] text-white py-12 px-4 mt-16">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
      <div className="col-span-2 flex items-center justify-center mb-6 md:mb-0">
        <Image src="/a2.png" alt="Alora Logo" width={32} height={32} className="mr-2 rounded-full" />
        <span className="font-bold text-3xl text-[#8854e0]">Alora</span>
      </div>
      {columns.map((col) => (
        <div key={col.title} className="flex flex-col gap-2">
          <span className="font-semibold mb-2">{col.title}</span>
          {col.items.map((item) => (
            <span key={item} className="text-gray-400 hover:text-[#8854e0] cursor-pointer text-sm transition-colors">{item}</span>
          ))}
        </div>
      ))}
    </div>
    <div className="text-center text-xs text-gray-500 mt-8">&copy; {new Date().getFullYear()} Alora. All rights reserved.</div>
  </footer>
); 