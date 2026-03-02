import React, { useState, useEffect } from 'react';

const DEPLOY_STEPS = [
  'Preparing deployment...',
  'Building assets...',
  'Going live...',
];

function DeployButton() {
  const [deployState, setDeployState] = useState('idle'); // 'idle', 'deploying', 'success'
  const [liveUrl, setLiveUrl] = useState('');
  const [deployStep, setDeployStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (deployState !== 'deploying') return;
    setDeployStep(0);
    const interval = setInterval(() => {
      setDeployStep((s) => (s + 1) % DEPLOY_STEPS.length);
    }, 1300);
    return () => clearInterval(interval);
  }, [deployState]);

  const handleDeploy = () => {
    setDeployState('deploying');
    setTimeout(() => {
      const uniqueId = Math.random().toString(36).substring(2, 8);
      setLiveUrl(`https://ai-builder-${uniqueId}.vercel.app`);
      setDeployState('success');
    }, 4000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(false);
    });
  };

  if (deployState === 'success') {
    return (
      <div className="mt-6 glass rounded-2xl p-6 border border-green-500/20 shadow-xl">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Checkmark icon */}
          <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold text-green-400">Deployment Successful! 🎉</h4>
            <p className="text-gray-400 text-sm mt-1">Your website is live at:</p>
          </div>

          {/* Copyable URL */}
          <div className="w-full flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-xl px-4 py-3">
            <span className="flex-1 text-sm text-purple-300 truncate text-left">{liveUrl}</span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs font-semibold text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full">
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Visit Site →
            </a>
            <button
              onClick={() => { setDeployState('idle'); setLiveUrl(''); }}
              className="flex-1 px-4 py-3 bg-gray-800/70 hover:bg-gray-700/70 border border-gray-700/50 text-gray-300 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            >
              Deploy Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      <button
        onClick={handleDeploy}
        disabled={deployState === 'deploying'}
        className="relative inline-flex items-center justify-center gap-3 px-10 py-4 font-bold text-white text-lg rounded-full shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-wait group"
        style={{
          background: 'linear-gradient(90deg, #10b981, #22c55e, #14b8a6)',
        }}
      >
        {deployState === 'deploying' ? (
          <>
            {/* Pulsing green dot */}
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="transition-all duration-300">{DEPLOY_STEPS[deployStep]}</span>
          </>
        ) : (
          <>
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5 text-xl">🚀</span>
            Deploy to Web
          </>
        )}
      </button>

      {/* Progress bar when deploying */}
      {deployState === 'deploying' && (
        <div className="mt-3 max-w-xs mx-auto">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-shimmer" style={{ width: '100%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeployButton;

