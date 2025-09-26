import React, { useState } from 'react';

function DeployButton() {
  const [deployState, setDeployState] = useState('idle'); // 'idle', 'deploying', 'success'
  const [liveUrl, setLiveUrl] = useState('');

  const handleDeploy = () => {
    setDeployState('deploying');
    
    // Asli deployment process ko simulate karein
    setTimeout(() => {
      // Ek fake live URL banayein
      const uniqueId = Math.random().toString(36).substring(2, 8);
      setLiveUrl(`https://ai-builder-${uniqueId}.vercel.app`);
      setDeployState('success');
    }, 4000); // 4 second ka delay
  };

  if (deployState === 'success') {
    return (
      <div className="mt-6 text-center bg-green-900/50 border border-green-700 p-4 rounded-lg">
        <h4 className="font-bold text-lg text-green-400">Deployment Successful!</h4>
        <p className="text-gray-300">Your website is live at:</p>
        <a 
          href={liveUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-purple-400 hover:underline break-all"
        >
          {liveUrl}
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleDeploy}
        disabled={deployState === 'deploying'}
        className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-wait text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-lg"
      >
        {deployState === 'deploying' ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Deploying...
          </>
        ) : (
          '🚀 Deploy Website'
        )}
      </button>
    </div>
  );
}

export default DeployButton;
