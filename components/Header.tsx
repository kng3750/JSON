
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55a2.5 2.5 0 010 4M5 10v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l-2 2-2-2"></path></svg>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Video Prompt <span className="text-indigo-400">JSON Generator</span>
          </h1>
        </div>
      </div>
    </header>
  );
};
