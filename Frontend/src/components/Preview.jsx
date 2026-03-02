import React, { useRef, useEffect, useState } from 'react';

const PREVIEW_WIDTHS = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

function Preview({ htmlContent }) {
  const iframeRef = useRef(null);
  const [viewMode, setViewMode] = useState('desktop');

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }
  }, [htmlContent]);

  return (
    <>
      {/* Browser Chrome Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-700/50 rounded-t-xl">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full hover:opacity-80 transition-opacity cursor-pointer"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full hover:opacity-80 transition-opacity cursor-pointer"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full hover:opacity-80 transition-opacity cursor-pointer"></div>
        </div>

        {/* Fake URL bar */}
        <div className="flex-1 mx-4 flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-lg px-3 py-1.5 max-w-sm mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs text-gray-400 truncate">https://your-website.ai-builder.dev</span>
        </div>

        {/* Right side: responsive toggles + fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Responsive toggles */}
          {[
            { key: 'desktop', title: 'Desktop', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { key: 'tablet', title: 'Tablet', icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
            { key: 'mobile', title: 'Mobile', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
          ].map((mode) => (
            <button
              key={mode.key}
              title={mode.title}
              onClick={() => setViewMode(mode.key)}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                viewMode === mode.key
                  ? 'bg-indigo-600/40 text-indigo-300'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mode.icon} />
              </svg>
            </button>
          ))}

          {/* Fullscreen (decorative) */}
          <button
            title="Fullscreen (Coming Soon)"
            onClick={() => alert('Coming soon')}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Iframe container */}
      <div className="bg-white/5 p-3">
        <div
          className="mx-auto transition-all duration-500 overflow-hidden rounded-md ring-1 ring-gray-700/50 shadow-inner"
          style={{ maxWidth: PREVIEW_WIDTHS[viewMode] }}
        >
          <iframe
            ref={iframeRef}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full border-0 min-h-[500px]"
            srcDoc={htmlContent}
          />
        </div>
      </div>
    </>
  );
}

export default Preview;

