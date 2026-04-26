import React, { useState } from 'react';

import Preview from './Preview.jsx';

function UIGenerator() {
    const [prompt, setPrompt] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const quickPrompts = [
        'Minimal fintech landing page with pricing and testimonials',
        'AI startup homepage with feature grid and CTA section',
        'Personal portfolio with case studies and contact form',
    ];

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
                let message = `API failed with status: ${response.status}`;
                try {
                    const errorBody = await response.json();
                    message = errorBody.error || message;
                } catch {
                    // Keep default error message if response isn't valid JSON.
                }
                throw new Error(message);
            }
            const result = await response.json();
            setGeneratedHtml(result.html);
        } catch (err) {
            setError(err.message || 'Failed to generate website. Please check your backend server and console for details.');
            console.error('Frontend API call error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="aiw-layout">
            <aside className="aiw-sidebar" aria-label="Prompt Controls Sidebar">
                <div className="aiw-prompt-card">
                    <form onSubmit={handleSubmit} className="aiw-form">
                        <label htmlFor="website-prompt" className="aiw-label">Prompt Input</label>
                        <textarea
                            id="website-prompt"
                            className="aiw-input"
                            placeholder="Describe the website you want to generate..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button type="submit" disabled={isLoading} className="aiw-generate-btn">
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </form>

                    <div className="aiw-examples" aria-label="Example prompts">
                        {quickPrompts.map((item) => (
                            <button
                                key={item}
                                type="button"
                                className="aiw-example-btn"
                                onClick={() => setPrompt(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {error && <p className="aiw-error">{error}</p>}
                </div>
            </aside>

            <section className="aiw-main-canvas" aria-label="Preview Canvas">
                <div className="aiw-preview-window">
                    <div className="aiw-preview-topbar">
                        <div className="aiw-dots" aria-hidden="true">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <span className="aiw-preview-title">Live Preview</span>
                    </div>

                    <div className="aiw-preview-body">
                        {generatedHtml ? (
                            <Preview htmlContent={generatedHtml} />
                        ) : (
                            <div className="aiw-placeholder">
                                <h3>Preview Container</h3>
                                <p>Your generated website appears here.</p>
                            </div>
                        )}
                    </div>

                    {isLoading && (
                        <div className="aiw-loading-overlay">
                            <div className="aiw-loader"></div>
                            <span>AI Processing...</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default UIGenerator;