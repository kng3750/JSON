
import React, { useState, useCallback } from 'react';
import { PromptInput } from './components/PromptInput';
import { JsonResponse } from './components/JsonResponse';
import { generateVideoPrompt } from './services/geminiService';
import { Header } from './components/Header';
import { Toast } from './components/Toast';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) {
      setError('Please enter a description for your video.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedJson('');

    try {
      const jsonResponse = await generateVideoPrompt(userInput);
      const parsedJson = JSON.parse(jsonResponse);
      setGeneratedJson(JSON.stringify(parsedJson, null, 2));
    } catch (e) {
      console.error(e);
      setError('Failed to generate JSON. The model may have returned an invalid format or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex flex-col">
          <PromptInput
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <JsonResponse
            jsonString={generatedJson}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default App;
