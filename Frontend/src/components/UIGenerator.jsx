import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import JSZip from 'jszip';
import { FaRocket } from 'react-icons/fa6';
import {
    FiCheckCircle,
    FiClock,
    FiCode,
    FiCopy,
    FiDownload,
    FiEdit3,
    FiExternalLink,
    FiFolder,
    FiGlobe,
    FiGrid,
    FiImage,
    FiLayers,
    FiLock,
    FiMonitor,
    FiShare2,
    FiSmartphone,
    FiTablet,
    FiX,
} from 'react-icons/fi';
import Preview from './Preview.jsx';

function normalizeCode(source) {
    return String(source || '');
}

function getTailwindClassList(source) {
    const classMatches = String(source || '').match(/class\s*=\s*"([^"]+)"/g) || [];
    const tokens = new Set();

    classMatches.forEach((entry) => {
        const classes = entry
            .replace(/class\s*=\s*"/, '')
            .replace(/"$/, '')
            .split(/\s+/)
            .filter(Boolean);
        classes.forEach((item) => tokens.add(item));
    });

    return Array.from(tokens).sort().join('\n');
}

function buildReactSource(source) {
    return [
        "export default function GeneratedPage() {",
        "  return (",
        "    <div",
        "      dangerouslySetInnerHTML={{",
        `        __html: ${JSON.stringify(String(source || ''))}`,
        "      }}",
        "    />",
        "  );",
        "}",
    ].join('\n');
}

function buildNextSource(source) {
    return [
        "export default function Page() {",
        "  return (",
        "    <main",
        "      dangerouslySetInnerHTML={{",
        `        __html: ${JSON.stringify(String(source || ''))}`,
        "      }}",
        "    />",
        "  );",
        "}",
    ].join('\n');
}

async function requestGeneratedHtml(prompt) {
    const payload = JSON.stringify({ prompt });
    const endpoints = ['/api/generate'];

    // Fallback for local development when Vite proxy is not active.
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        endpoints.push('http://localhost:3001/api/generate');
    }

    let lastError = null;

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            });

            if (!response.ok) {
                let message = `API failed with status: ${response.status}`;
                try {
                    const errorBody = await response.json();
                    message = errorBody.error || message;
                } catch {
                    // Ignore malformed error payload and keep generic message.
                }
                throw new Error(message);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Failed to fetch');
}

function UIGenerator() {
    const [prompt, setPrompt] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [buildHistory, setBuildHistory] = useState([]);
    const [isDeployPopupOpen, setIsDeployPopupOpen] = useState(false);
    const [deployUrl, setDeployUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [activeCodeTab, setActiveCodeTab] = useState('html');
    const [deployAnchorRect, setDeployAnchorRect] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [localPreviewUrl, setLocalPreviewUrl] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('Minimalist');
    const [activeSidebarTab, setActiveSidebarTab] = useState('build');
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [editMode, setEditMode] = useState(false);
    const [projectName, setProjectName] = useState('Untitled Project');
    const [assetPrompt, setAssetPrompt] = useState('');
    const [assetLibrary, setAssetLibrary] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [themeMode, setThemeMode] = useState('dark');
    const deployButtonRef = useRef(null);
    const deployPopupRef = useRef(null);

    const styleOptions = ['Minimalist', 'Brutalist', 'Corporate', 'Neon Tech', 'Hand-drawn'];
    const styleDirectives = {
        Minimalist: 'Use generous whitespace, crisp typography, restrained color, and premium editorial spacing.',
        Brutalist: 'Use bold contrast, strong borders, raw layout rhythm, oversized type, and direct visual hierarchy.',
        Corporate: 'Use polished SaaS structure, enterprise trust cues, practical sections, and muted professional color.',
        'Neon Tech': 'Use luminous accents, dark surfaces, high-tech gradients, and futuristic interaction details.',
        'Hand-drawn': 'Use soft organic shapes, friendly copy, sketch-like accents, and warm handcrafted composition.',
    };
    const deviceOptions = [
        { id: 'desktop', label: 'Desktop', icon: FiMonitor },
        { id: 'tablet', label: 'Tablet', icon: FiTablet },
        { id: 'mobile', label: 'Mobile', icon: FiSmartphone },
    ];
    const sampleAssets = [
        { id: 1, label: 'Hero Glow', tone: 'cyan' },
        { id: 2, label: 'Product Icon', tone: 'violet' },
        { id: 3, label: 'Client Badge', tone: 'emerald' },
    ];

    const quickPrompts = [
        'Minimal fintech landing page with pricing and testimonials',
        'AI startup homepage with feature grid and CTA section',
        'Personal portfolio with case studies and contact form',
    ];

    const codeSources = useMemo(() => {
        const htmlSource = generatedHtml || '<!-- Generate your first build to view source -->';
        const reactSource = buildReactSource(generatedHtml);
        const nextSource = buildNextSource(generatedHtml);
        const tailwindSource = getTailwindClassList(generatedHtml) || '// No class attributes detected yet';
        return {
            html: htmlSource,
            react: reactSource,
            next: nextSource,
            tailwind: tailwindSource,
        };
    }, [generatedHtml]);

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
            const styledPrompt = `${prompt}\n\nVisual style: ${selectedStyle}. ${styleDirectives[selectedStyle]}`;
            const result = await requestGeneratedHtml(styledPrompt);
            const generatedAt = new Date();
            const buildEntry = {
                id: generatedAt.getTime(),
                prompt,
                name: projectName || prompt.slice(0, 34) || 'Untitled Project',
                style: selectedStyle,
                html: result.html,
                timeLabel: generatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setGeneratedHtml(result.html);
            setBuildHistory((prev) => [buildEntry, ...prev].slice(0, 8));
        } catch (err) {
            const message = String(err?.message || 'Failed to fetch');
            if (/Failed to fetch|NetworkError|ECONNREFUSED/i.test(message)) {
                setError('Cannot reach backend. Start the backend on port 3001 (run root npm run dev) and try again.');
            } else {
                setError(message || 'Failed to generate website. Please check your backend server and console for details.');
            }
            console.error('Frontend API call error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuildSwitch = (item) => {
        setGeneratedHtml(item.html);
        setPrompt(item.prompt);
        setProjectName(item.name || item.prompt || 'Untitled Project');
        setSelectedStyle(item.style || 'Minimalist');
        setError(null);
    };

    const handleMouseMove = (event) => {
        const x = Math.round((event.clientX / window.innerWidth) * 100);
        const y = Math.round((event.clientY / window.innerHeight) * 100);
        setMousePosition({ x, y });
    };

    const handleSaveProject = () => {
        if (!generatedHtml) {
            setError('Generate a site before saving it to a collection.');
            return;
        }

        const savedAt = new Date();
        const savedProject = {
            id: savedAt.getTime(),
            prompt,
            name: projectName || 'Untitled Project',
            style: selectedStyle,
            html: generatedHtml,
            timeLabel: savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setBuildHistory((prev) => [savedProject, ...prev.filter((item) => item.id !== savedProject.id)].slice(0, 12));
    };

    const handleGenerateAsset = () => {
        const label = assetPrompt.trim() || `Asset ${assetLibrary.length + 1}`;
        const nextAsset = {
            id: Date.now(),
            label,
            tone: ['cyan', 'violet', 'emerald'][assetLibrary.length % 3],
        };
        setAssetLibrary((prev) => [nextAsset, ...prev].slice(0, 8));
        setAssetPrompt('');
    };

    useEffect(() => {
        if (!generatedHtml) {
            setLocalPreviewUrl('');
            setDeployUrl('');
            return undefined;
        }

        const blob = new Blob([generatedHtml], { type: 'text/html' });
        const nextPreviewUrl = URL.createObjectURL(blob);
        setLocalPreviewUrl(nextPreviewUrl);
        setDeployUrl(nextPreviewUrl);

        return () => URL.revokeObjectURL(nextPreviewUrl);
    }, [generatedHtml]);

    const handleDeploy = () => {
        const deployHtml = generatedHtml || buildHistory[0]?.html || '';

        if (!deployHtml) {
            setError('Generate a website first, then deploy.');
            return;
        }

        if (isDeployPopupOpen) {
            setIsDeployPopupOpen(false);
            return;
        }

        if (deployButtonRef.current) {
            setDeployAnchorRect(deployButtonRef.current.getBoundingClientRect());
        }

        setIsDeployPopupOpen(true);
        setCopied(false);
        setShowConfetti(true);
        window.setTimeout(() => setShowConfetti(false), 1200);
    };

    useEffect(() => {
        if (!isDeployPopupOpen) return;

        const updatePosition = () => {
            if (!deployButtonRef.current) return;
            setDeployAnchorRect(deployButtonRef.current.getBoundingClientRect());
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
            document.body.style.overflow = previousOverflow;
        };
    }, [isDeployPopupOpen]);

    useEffect(() => {
        if (!isDeployPopupOpen) return;

        const onMouseDown = (event) => {
            const buttonNode = deployButtonRef.current;
            const popupNode = deployPopupRef.current;
            const targetNode = event.target;

            if (!targetNode) return;
            if (buttonNode && buttonNode.contains(targetNode)) return;
            if (popupNode && popupNode.contains(targetNode)) return;

            setIsDeployPopupOpen(false);
        };

        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [isDeployPopupOpen]);

    const deploymentBadge = { icon: 'Ready', text: 'Local Preview Ready' };

    const handleCopyLink = async () => {
        if (!deployUrl) return;
        try {
            await navigator.clipboard.writeText(deployUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch (copyErr) {
            console.error('Failed to copy deployment link:', copyErr);
        }
    };

    const handleVisitSite = () => {
        if (!deployUrl) return;
        window.open(deployUrl, '_blank', 'noopener,noreferrer');
    };

    const handleDownloadCode = async (format = 'html') => {
        if (!generatedHtml) return;

        try {
            const zip = new JSZip();
            if (format === 'react') {
                zip.file('src/GeneratedPage.jsx', buildReactSource(generatedHtml));
                zip.file('README.md', '# React Export\n\nDrop `GeneratedPage.jsx` into your React app.');
            } else if (format === 'next') {
                zip.file('app/page.jsx', buildNextSource(generatedHtml));
                zip.file('README.md', '# Next.js Export\n\nUse `app/page.jsx` inside a Next.js app router project.');
            } else {
                zip.file('index.html', generatedHtml);
                zip.file(
                    'README.md',
                    [
                        '# Generated Build',
                        '',
                        `Project: ${projectName || 'Untitled Project'}`,
                        `Style: ${selectedStyle}`,
                        `Prompt: ${prompt || 'No prompt recorded'}`,
                        `Exported: ${new Date().toISOString()}`,
                        '',
                        'Run index.html in any browser to preview the generated site.',
                    ].join('\n')
                );
            }

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${format}-export.zip`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);
        } catch (downloadErr) {
            console.error('Failed to export code zip:', downloadErr);
            setError('Could not export code zip. Please try again.');
        }
    };

    return (
        <div
            className={`aiw-layout aiw-premium-shell ${themeMode === 'light' ? 'light-mode' : 'dark-mode'}`}
            onMouseMove={handleMouseMove}
            style={{ '--mesh-x': `${mousePosition.x}%`, '--mesh-y': `${mousePosition.y}%` }}
        >
            <aside className="aiw-sidebar" aria-label="Prompt Controls Sidebar">
                <div className="aiw-prompt-card">
                    <div className="aiw-sidebar-tabs" role="tablist" aria-label="Builder tools">
                        {[
                            { id: 'build', label: 'Build', icon: FiLayers },
                            { id: 'assets', label: 'Assets', icon: FiImage },
                            { id: 'dashboard', label: 'Projects', icon: FiFolder },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={activeSidebarTab === tab.id ? 'aiw-sidebar-tab active' : 'aiw-sidebar-tab'}
                                    onClick={() => setActiveSidebarTab(tab.id)}
                                >
                                    <Icon />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {activeSidebarTab === 'build' && (
                        <form onSubmit={handleSubmit} className="aiw-form">
                            <label htmlFor="project-name" className="aiw-label">Project Name</label>
                            <input
                                id="project-name"
                                className="aiw-text-input"
                                value={projectName}
                                onChange={(event) => setProjectName(event.target.value)}
                            />
                            <label className="aiw-label">Mode</label>
                            <div className="aiw-mode-toggle" aria-label="Theme mode">
                                <button
                                    type="button"
                                    className={themeMode === 'dark' ? 'active' : ''}
                                    onClick={() => setThemeMode('dark')}
                                >
                                    Dark
                                </button>
                                <button
                                    type="button"
                                    className={themeMode === 'light' ? 'active' : ''}
                                    onClick={() => setThemeMode('light')}
                                >
                                    Light
                                </button>
                            </div>
                            <label htmlFor="website-style" className="aiw-label">Style</label>
                            <select
                                id="website-style"
                                className="aiw-select aiw-tooltip"
                                data-tip="Style variations shape the AI prompt before generation."
                                value={selectedStyle}
                                onChange={(event) => setSelectedStyle(event.target.value)}
                            >
                                {styleOptions.map((style) => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>
                            <label htmlFor="website-prompt" className="aiw-label">Prompt Input</label>
                            <textarea
                                id="website-prompt"
                                className="aiw-input"
                                placeholder="Describe the website you want to generate..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="aiw-actions-row">
                                <button type="submit" disabled={isLoading} className="aiw-generate-btn aiw-tooltip" data-tip="Generate a styled website from your prompt.">
                                    {isLoading ? (
                                        <span className="aiw-btn-content">
                                            <span className="aiw-btn-spinner"></span>
                                            <span>Generating</span>
                                        </span>
                                    ) : (
                                        'Generate'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="aiw-toolbar-btn aiw-tooltip"
                                    data-tip="Inspect generated HTML, React, Next.js, and Tailwind output."
                                    disabled={!generatedHtml}
                                    onClick={() => setIsCodeModalOpen(true)}
                                >
                                    <FiCode />
                                    <span>View Code</span>
                                </button>
                                <button
                                    type="button"
                                    className="aiw-toolbar-btn aiw-tooltip"
                                    data-tip="Export the current build as production-ready files."
                                    disabled={!generatedHtml}
                                    onClick={() => handleDownloadCode('html')}
                                >
                                    <FiDownload />
                                    <span>Export HTML</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {activeSidebarTab === 'build' && <div className="aiw-examples" aria-label="Example prompts">
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
                    </div>}

                    {activeSidebarTab === 'assets' && (
                        <section className="aiw-asset-panel" aria-label="AI Image Assets">
                            <div className="aiw-section-head">
                                <span>AI Image Assets</span>
                                <small>Pro creative kit</small>
                            </div>
                            <input
                                className="aiw-text-input"
                                value={assetPrompt}
                                onChange={(event) => setAssetPrompt(event.target.value)}
                                placeholder="Hero image, icon set, product mockup..."
                            />
                            <button type="button" className="aiw-generate-btn aiw-tooltip" data-tip="Creates a local asset placeholder for your design system." onClick={handleGenerateAsset}>
                                Generate Asset
                            </button>
                            <div className="aiw-asset-grid">
                                {[...assetLibrary, ...sampleAssets].slice(0, 6).map((asset) => (
                                    <button key={asset.id} type="button" className={`aiw-asset-card ${asset.tone}`}>
                                        <span></span>
                                        <strong>{asset.label}</strong>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className={activeSidebarTab === 'dashboard' ? 'aiw-recent-builds dashboard' : 'aiw-recent-builds'} aria-label="Recent builds">
                        <div className="aiw-section-head">
                            <span>{activeSidebarTab === 'dashboard' ? 'Project Dashboard' : 'Recent Builds'}</span>
                            <button type="button" className="aiw-mini-action" onClick={handleSaveProject}>
                                Save
                            </button>
                        </div>
                        {buildHistory.length === 0 ? (
                            <p className="aiw-recent-empty">No builds yet.</p>
                        ) : (
                            <div className="aiw-recent-list">
                                {buildHistory.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="aiw-recent-item"
                                        onClick={() => handleBuildSwitch(item)}
                                    >
                                        <span className="aiw-project-chip">{item.name || 'Untitled Project'}</span>
                                        <span className="aiw-recent-time">
                                            <FiClock />
                                            <span>{item.timeLabel}</span>
                                        </span>
                                        <span className="aiw-style-chip">{item.style || selectedStyle}</span>
                                        <span className="aiw-recent-prompt">{item.prompt}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <div className="aiw-pro-links">
                        <button type="button" className="aiw-pro-link">
                            <FiGrid />
                            <span>Community Showcase</span>
                        </button>
                        <button type="button" className="aiw-pro-link">
                            <FiShare2 />
                            <span>Share Preview</span>
                            <b>Pro</b>
                        </button>
                    </div>

                    {error && <p className="aiw-error">{error}</p>}
                </div>
            </aside>

            <section className="aiw-main-canvas" aria-label="Preview Canvas">
                <div className="aiw-project-status">
                    <div className="aiw-project-meta">
                        <span className="aiw-project-label">Project Status</span>
                        <span className="aiw-project-text">
                            {generatedHtml ? `${projectName} is ready for local preview` : 'Generate a build to deploy'}
                        </span>
                    </div>

                    <div className="aiw-device-switcher" aria-label="Preview device switcher">
                        {deviceOptions.map((device) => {
                            const Icon = device.icon;
                            return (
                                <button
                                    key={device.id}
                                    type="button"
                                    className={previewDevice === device.id ? 'active aiw-tooltip' : 'aiw-tooltip'}
                                    data-tip={`Preview ${device.label} breakpoint`}
                                    onClick={() => setPreviewDevice(device.id)}
                                    aria-label={`Preview ${device.label}`}
                                >
                                    <Icon />
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        className={editMode ? 'aiw-edit-toggle active aiw-tooltip' : 'aiw-edit-toggle aiw-tooltip'}
                        data-tip="Click text inside the preview, edit it, then click away to save locally."
                        disabled={!generatedHtml}
                        onClick={() => setEditMode((value) => !value)}
                    >
                        <FiEdit3 />
                        <span>Edit Mode</span>
                    </button>

                    <div className="aiw-deploy-wrap">
                        <button
                            ref={deployButtonRef}
                            type="button"
                            className="aiw-deploy-btn aiw-tooltip"
                            data-tip="Opens a zero-config local Blob preview in this browser."
                            onClick={handleDeploy}
                            disabled={isLoading || (!generatedHtml && buildHistory.length === 0)}
                        >
                            <FaRocket />
                            <span>Deploy to Web</span>
                        </button>
                    </div>
                </div>

                <div className="aiw-preview-window">
                    <div className="aiw-preview-topbar">
                        <div className="aiw-dots" aria-hidden="true">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <span className="aiw-preview-title">Live Preview</span>
                        {generatedHtml && (
                            <span className="aiw-live-indicator">
                                <span className="aiw-live-dot"></span>
                                <span>Live</span>
                            </span>
                        )}
                    </div>

                    <div className={`aiw-preview-body device-${previewDevice} ${editMode ? 'edit-mode' : ''}`}>
                        {generatedHtml ? (
                            <Preview
                                htmlContent={generatedHtml}
                                previewUrl={localPreviewUrl}
                                editMode={editMode}
                                onHtmlChange={setGeneratedHtml}
                            />
                        ) : (
                            <div className="aiw-placeholder aiw-placeholder-matrix">
                                <div className="aiw-matrix-rain" aria-hidden="true">
                                    {Array.from({ length: 28 }).map((_, index) => (
                                        <span
                                            key={`rain-${index}`}
                                            style={{
                                                left: `${(index / 28) * 100}%`,
                                                animationDelay: `${(index % 7) * -0.4}s`,
                                                animationDuration: `${6 + (index % 5)}s`,
                                            }}
                                        >
                                            {index % 2 === 0 ? '101101' : '010011'}
                                        </span>
                                    ))}
                                </div>
                                <div className="aiw-placeholder-copy">
                                    <h3>Preview Container</h3>
                                    <p>Generate a build to activate live rendering.</p>
                                </div>
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

            {isCodeModalOpen && (
                <div className="aiw-code-modal-backdrop" role="dialog" aria-modal="true" aria-label="Generated code">
                    <div className="aiw-code-modal">
                        <div className="aiw-code-modal-head">
                            <div className="aiw-code-tabs">
                                <button
                                    type="button"
                                    className={activeCodeTab === 'html' ? 'aiw-code-tab active' : 'aiw-code-tab'}
                                    onClick={() => setActiveCodeTab('html')}
                                >
                                    HTML
                                </button>
                                <button
                                    type="button"
                                    className={activeCodeTab === 'react' ? 'aiw-code-tab active' : 'aiw-code-tab'}
                                    onClick={() => setActiveCodeTab('react')}
                                >
                                    React
                                </button>
                                <button
                                    type="button"
                                    className={activeCodeTab === 'next' ? 'aiw-code-tab active' : 'aiw-code-tab'}
                                    onClick={() => setActiveCodeTab('next')}
                                >
                                    Next.js
                                </button>
                                <button
                                    type="button"
                                    className={activeCodeTab === 'tailwind' ? 'aiw-code-tab active' : 'aiw-code-tab'}
                                    onClick={() => setActiveCodeTab('tailwind')}
                                >
                                    Tailwind
                                </button>
                            </div>
                            <div className="aiw-export-menu">
                                <button type="button" onClick={() => handleDownloadCode('react')}>React Export</button>
                                <button type="button" onClick={() => handleDownloadCode('next')}>Next.js Export</button>
                            </div>
                            <button type="button" className="aiw-modal-close" onClick={() => setIsCodeModalOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <pre className="aiw-code-editor" aria-label="Generated source code">
                            <code>{normalizeCode(codeSources[activeCodeTab])}</code>
                        </pre>
                    </div>
                </div>
            )}

            {isDeployPopupOpen && deployAnchorRect && createPortal(
                <div className="aiw-deploy-portal-root" aria-hidden="false">
                    <button
                        type="button"
                        className="aiw-deploy-backdrop"
                        aria-label="Close deployment popup"
                        onClick={() => setIsDeployPopupOpen(false)}
                    ></button>

                    <div
                        className="aiw-deploy-anchor"
                        style={{
                            left: `${deployAnchorRect.left}px`,
                            top: `${deployAnchorRect.top}px`,
                            width: `${deployAnchorRect.width}px`,
                        }}
                    >
                        <div ref={deployPopupRef} className="aiw-deploy-popup" role="dialog" aria-label="Deployment URL">
                            <div className="aiw-deploy-head">
                                <span className="aiw-deploy-success-icon"><FiCheckCircle /></span>
                                <span className="aiw-deploy-success-text">Local Preview Ready</span>
                            </div>

                            <div className="aiw-deploy-badge">{deploymentBadge.icon} {deploymentBadge.text}</div>

                            <div className="aiw-deploy-progress" aria-label="Preview progress">
                                <span className="aiw-deploy-progress-label">Local Session URL (Internal Only)</span>
                                <div className="aiw-deploy-progress-track">
                                    <div className="aiw-deploy-progress-fill" style={{ width: '100%' }}></div>
                                </div>
                            </div>

                            <div className="aiw-deploy-link-row">
                                <a
                                    className="aiw-deploy-link-field"
                                    href={deployUrl || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Local Session URL (Internal Only)
                                </a>
                                <button
                                    type="button"
                                    className="aiw-copy-icon-btn"
                                    onClick={handleCopyLink}
                                    aria-label="Copy deployment link"
                                    disabled={!deployUrl}
                                >
                                    <FiCopy />
                                </button>
                            </div>

                            <div className="aiw-deploy-actions">
                                <button type="button" className="aiw-copy-btn" onClick={handleCopyLink} disabled={!deployUrl}>
                                    <FiCopy />
                                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                                </button>

                                <button
                                    type="button"
                                    className="aiw-visit-btn aiw-visit-btn-primary"
                                    onClick={handleVisitSite}
                                    aria-label="Open local preview in a new tab"
                                    disabled={!deployUrl}
                                >
                                    <FiExternalLink />
                                    <span>Open in New Tab</span>
                                </button>
                            </div>

                            <div className="aiw-paywall-card">
                                <div>
                                    <strong>Add Custom Domain</strong>
                                    <span>Brand this preview for clients.</span>
                                </div>
                                <button type="button" disabled>
                                    <FiGlobe />
                                    <span>Unlock with Pro</span>
                                    <FiLock />
                                </button>
                            </div>

                            <div className="aiw-paywall-card">
                                <div>
                                    <strong>Password Share Link</strong>
                                    <span>Temporary client review rooms.</span>
                                </div>
                                <button type="button" disabled>
                                    <FiShare2 />
                                    <span>Pro</span>
                                    <FiLock />
                                </button>
                            </div>

                            <p className="aiw-deploy-note">Running on local browser memory. No cloud keys required.</p>

                            {showConfetti && (
                                <div className="aiw-confetti" aria-hidden="true">
                                    {Array.from({ length: 24 }).map((_, index) => (
                                        <span
                                            key={`confetti-${index}`}
                                            style={{
                                                left: `${(index / 24) * 100}%`,
                                                animationDelay: `${(index % 6) * 0.03}s`,
                                            }}
                                        ></span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default UIGenerator;

