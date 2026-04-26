import React, { useEffect, useState } from 'react';

function DeployButton({ htmlContent = '' }) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!htmlContent) {
      setPreviewUrl('');
      return undefined;
    }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const nextPreviewUrl = URL.createObjectURL(blob);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [htmlContent]);

  const handleOpenPreview = () => {
    if (!previewUrl) return;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleOpenPreview}
        disabled={!previewUrl}
        className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-lg"
      >
        Open Local Preview
      </button>
    </div>
  );
}

export default DeployButton;
