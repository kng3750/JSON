import React, { useState, useEffect, useMemo } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface JsonResponseProps {
  jsonString: string;
  isLoading: boolean;
  error: string | null;
}

const Placeholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 20l4-16m4 4l-4 4-4-4M6 16l-4-4 4-4"></path></svg>
    <p className="font-semibold">Your generated JSON will appear here.</p>
    <p className="text-sm">Enter a description and click "Generate JSON" to start.</p>
  </div>
);

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse p-4">
        <div className="h-4 bg-gray-600 rounded w-1/4"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-600 rounded w-2/3"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
    </div>
);


export const JsonResponse: React.FC<JsonResponseProps> = ({ jsonString, isLoading, error }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'korean' | 'full'>('english');

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Reset tab to English when new content is generated
  useEffect(() => {
    if (jsonString) {
      setActiveTab('english');
    }
  }, [jsonString]);

  const { displayContent, hasDualLanguage } = useMemo(() => {
    if (!jsonString || error) return { displayContent: jsonString, hasDualLanguage: false };
    
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.english && parsed.korean) {
        let content = '';
        if (activeTab === 'english') content = JSON.stringify(parsed.english, null, 2);
        else if (activeTab === 'korean') content = JSON.stringify(parsed.korean, null, 2);
        else content = JSON.stringify(parsed, null, 2);
        
        return { displayContent: content, hasDualLanguage: true };
      }
    } catch (e) {
      console.warn("Failed to parse JSON for tab detection", e);
    }
    return { displayContent: jsonString, hasDualLanguage: false };
  }, [jsonString, activeTab, error]);

  const handleCopy = () => {
    if (displayContent) {
      navigator.clipboard.writeText(displayContent);
      setCopied(true);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">An Error Occurred</p>
            <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (displayContent) {
      return (
        <pre className="text-sm text-left whitespace-pre-wrap break-all p-4">
          <code className="language-json">{displayContent}</code>
        </pre>
      );
    }
    return <Placeholder />;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col h-full">
      <div className="flex flex-col border-b border-gray-700">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-200">Generated JSON</h2>
          {displayContent && !error && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors duration-200 text-sm"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>
        {hasDualLanguage && !isLoading && !error && (
          <div className="flex px-4 space-x-2 pb-0">
             <button 
                onClick={() => setActiveTab('english')} 
                className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'english' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
             >
                English
             </button>
             <button 
                onClick={() => setActiveTab('korean')} 
                className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'korean' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
             >
                Korean
             </button>
             <button 
                onClick={() => setActiveTab('full')} 
                className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'full' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
             >
                Full JSON
             </button>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-auto bg-gray-900 rounded-b-lg">
        {renderContent()}
      </div>
    </div>
  );
};
