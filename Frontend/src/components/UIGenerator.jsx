import React, { useState, useEffect } from 'react';
import Preview from './Preview.jsx';
import DeployButton from './DeployButton.jsx';

const LOADING_STEPS = [
  'Analyzing your prompt...',
  'Generating HTML...',
  'Polishing design...',
];

const QUICK_SUGGESTIONS = [
  { label: 'Portfolio', prompt: 'A minimalist personal portfolio website with a dark theme, animated hero section, skills grid, project showcase, and a contact form.' },
  { label: 'Landing Page', prompt: 'A modern SaaS landing page with a gradient hero, feature highlights, pricing table, testimonials, and a call-to-action footer.' },
  { label: 'E-commerce', prompt: 'An e-commerce homepage with a featured products grid, promotional banner, category navigation, and shopping cart icon.' },
  { label: 'Blog', prompt: 'A clean blog homepage with a featured post hero, recent articles grid, category sidebar, and newsletter subscription section.' },
  { label: 'Dashboard', prompt: 'An admin dashboard with a stats overview, data charts, recent activity feed, and a dark sidebar navigation.' },
];

function UIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a description for your website.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedHtml('');

    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || `API failed with status: ${response.status}`);
      }
      const result = await response.json();
      setGeneratedHtml(result.html);

    } catch (err) {
      setError('Failed to generate website. Please check your backend server and console for details.');
      console.error("Frontend API call error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-2xl">✨</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text">AI Website Builder</h2>
        </div>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
            Powered by AI ⚡
          </span>
        </div>
        <p className="mt-3 text-lg text-gray-400">Describe your dream website, and watch it come to life in seconds.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 mb-10 p-6 md:p-8 glass rounded-2xl shadow-2xl">
        {/* Label with tooltip */}
        <div className="flex items-center gap-2 mb-1">
          <label htmlFor="website-prompt" className="text-sm font-semibold text-gray-200">
            Describe your website
          </label>
          <span title="Be specific about layout, colors, features, and purpose for best results." className="cursor-help text-gray-500 hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>

        <div className="relative">
          <textarea
            id="website-prompt"
            rows={5}
            className="w-full p-5 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition-all duration-200 text-base placeholder-gray-500 text-white shadow-inner resize-none outline-none"
            placeholder="e.g., A minimalist personal portfolio website with a dark theme, a contact form, and links to social media."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={1000}
          />
          <div className="absolute bottom-3 right-4 text-xs text-gray-500 pointer-events-none">
            {prompt.length} / 1000
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setPrompt(s.prompt)}
              className="px-3 py-1.5 text-sm font-medium bg-gray-800/70 hover:bg-indigo-600/30 border border-gray-700/50 hover:border-indigo-500/50 text-gray-300 hover:text-indigo-200 rounded-full transition-all duration-200 hover:scale-105"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="relative px-10 py-4 font-extrabold rounded-full shadow-xl text-white text-lg flex items-center justify-center gap-3 mx-auto overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(90deg, #4f46e5, #9333ea, #ec4899, #4f46e5)',
              backgroundSize: '200% 100%',
              animation: 'gradient-x 3s ease infinite',
            }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="transition-all duration-300">{LOADING_STEPS[loadingStep]}</span>
              </>
            ) : (
              <>✨ Generate Website</>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-3 bg-red-950/60 border border-red-700/50 text-red-200 px-5 py-4 rounded-xl mb-8 shadow-md">
          <span className="text-xl flex-shrink-0 mt-0.5">⚠️</span>
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="mt-1 text-sm text-red-400 hover:text-red-200 underline transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Live Preview — shown when HTML is ready */}
      {!isLoading && generatedHtml && (
        <div className="mt-10 glass rounded-2xl shadow-2xl overflow-hidden">
          <Preview htmlContent={generatedHtml} />
        </div>
      )}

      {/* Empty State Placeholder */}
      {!isLoading && !generatedHtml && !error && (
        <div className="mt-10 glass rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-700/40">
            <h3 className="text-base font-semibold text-gray-200">Live Preview</h3>
          </div>
          <div className="p-8 flex flex-col items-center justify-center min-h-[260px]">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-600/60 flex items-center justify-center mb-5 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-semibold text-center">Your website will appear here</p>
            <p className="text-gray-500 text-sm mt-1 text-center">Fill in the prompt above and click Generate</p>
          </div>
        </div>
      )}

      {/* Deploy Button */}
      {!isLoading && generatedHtml && (
        <div className="mt-8">
          <DeployButton />
        </div>
      )}
    </div>
  );
}

export default UIGenerator;