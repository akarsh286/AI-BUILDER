import React, { useRef, useEffect } from 'react';

function Preview({ htmlContent }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;

      // Clear previous content and write new HTML
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      title="Live Preview"
      sandbox="allow-scripts allow-same-origin"
      className="preview-iframe"
      srcDoc={htmlContent}
    ></iframe>
  );
}

export default Preview;

