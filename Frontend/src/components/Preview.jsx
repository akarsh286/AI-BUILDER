import React, { useCallback, useEffect, useRef } from 'react';

const editableSelector = 'h1,h2,h3,h4,h5,h6,p,a,button,span,li,label';

function serializeDocument(doc) {
  const doctype = doc.doctype ? `<!doctype ${doc.doctype.name}>` : '<!doctype html>';
  return `${doctype}\n${doc.documentElement.outerHTML}`;
}

function Preview({ htmlContent, previewUrl, editMode = false, onHtmlChange }) {
  const iframeRef = useRef(null);

  const syncEditMode = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc?.body) return;

    const editableNodes = Array.from(doc.body.querySelectorAll(editableSelector))
      .filter((node) => node.textContent.trim().length > 0 && node.children.length === 0);

    editableNodes.forEach((node) => {
      if (editMode) {
        node.setAttribute('contenteditable', 'true');
        node.setAttribute('data-aiw-editable', 'true');
        node.style.outline = '1px dashed rgba(56, 189, 248, 0.65)';
        node.style.outlineOffset = '3px';
        node.style.cursor = 'text';
      } else if (node.getAttribute('data-aiw-editable') === 'true') {
        node.removeAttribute('contenteditable');
        node.removeAttribute('data-aiw-editable');
        node.style.outline = '';
        node.style.outlineOffset = '';
        node.style.cursor = '';
      }
    });
  }, [editMode]);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc?.body) return;

    syncEditMode();

    const handleBlur = (event) => {
      if (!editMode || event.target?.getAttribute('data-aiw-editable') !== 'true') return;
      onHtmlChange?.(serializeDocument(doc));
    };

    doc.addEventListener('blur', handleBlur, true);
    iframe._aiwCleanup = () => doc.removeEventListener('blur', handleBlur, true);
  }, [editMode, onHtmlChange, syncEditMode]);

  useEffect(() => {
    syncEditMode();
  }, [syncEditMode, previewUrl]);

  useEffect(() => () => iframeRef.current?._aiwCleanup?.(), []);

  return (
    <iframe
      ref={iframeRef}
      title="Live Preview"
      sandbox="allow-scripts allow-same-origin"
      className="preview-iframe"
      src={previewUrl || undefined}
      srcDoc={previewUrl ? undefined : htmlContent}
      onLoad={handleLoad}
    ></iframe>
  );
}

export default Preview;

