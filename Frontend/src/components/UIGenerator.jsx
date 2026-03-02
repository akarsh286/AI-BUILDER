import React, { useState } from 'react';
import Preview from './Preview.jsx';

function UIGenerator() {
    const [prompt, setPrompt] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
            const response = await fetch('/api/generate', {
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
        <div className="max-w-4xl mx-auto py-8">
            <header className="mb-12 text-center">
                <h2 className="text-5xl font-extrabold tracking-tight gradient-text mb-4">AI Website Builder</h2>
                <p className="mt-2 text-xl text-gray-400">Describe your dream website, and watch it come to life in seconds.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 mb-16 p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div>
                    <label htmlFor="website-prompt" className="sr-only">Website Description</label>
                    <textarea
                        id="website-prompt"
                        rows="8"
                        className="w-full p-6 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg placeholder-gray-400 text-white shadow-inner"
                        placeholder="e.g., A minimalist personal portfolio website with a dark theme, a contact form, and links to social media."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-extrabold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-xl flex items-center justify-center gap-3 mx-auto"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Building Website...
                            </>
                        ) : (
                            <>
                                ✨ Generate Website
                            </>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-xl mb-10 text-center font-medium shadow-md">
                    {error}
                </div>
            )}

            {/* Live Preview Section - Renders only when generatedHtml is not empty */}
            {!isLoading && generatedHtml && (
                <div className="mt-16 p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                    <Preview htmlContent={generatedHtml} />
                </div>
            )}

            {/* Placeholder for Live Preview - Renders only on initial load or if no HTML is generated */}
            {!isLoading && !generatedHtml && !error && (
                <div className="mt-16 p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-200">Live Preview</h3>
                    </div>
                    <div className="p-4 bg-white/5 flex items-center justify-center h-80 rounded-b-xl">
                        <p className="text-gray-400 text-2xl font-semibold">Your website will appear here after generation!</p>
                    </div>
                </div>
            )}

            {/* Coming Soon/Deploy Button placeholder */}
            {!isLoading && generatedHtml && (
                <div className="mt-12 text-center">
                    <button
                        className="px-10 py-4 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-900 text-white font-extrabold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-xl flex items-center justify-center gap-3 mx-auto"
                        onClick={() => alert("Deployment feature is coming soon!")}
                    >
                        🚀 Deploy Website (Coming Soon)
                    </button>
                    <p className="mt-4 text-gray-500 text-sm">Once generated, you'll be able to deploy your website instantly.</p>
                </div>
            )}
        </div>
    );
}

export default UIGenerator;