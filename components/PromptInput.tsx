
import React from 'react';
import { Spinner } from './Spinner';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200">Describe Your Video</h2>
        <p className="text-sm text-gray-400 mt-1">Enter a natural language description, and we'll convert it to a structured JSON prompt.</p>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <textarea
          value={value}
          onChange={onChange}
          placeholder="e.g., A cinematic shot of a lone astronaut on Mars watching two suns set."
          className="w-full flex-grow bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
          rows={10}
          disabled={isLoading}
        />
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-500 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          {isLoading ? (
            <>
              <Spinner />
              Generating...
            </>
          ) : (
            'Generate JSON'
          )}
        </button>
      </div>
    </div>
  );
};
