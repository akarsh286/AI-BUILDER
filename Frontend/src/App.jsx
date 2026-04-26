import React from 'react';

import UIGenerator from './components/UIGenerator.jsx';
import './App.css';

function App() {
  return (
    <div className="aiw-root">
      <div className="aiw-bg" aria-hidden="true"></div>

      <header className="aiw-header" aria-label="Workspace Header">
        <div className="aiw-logo">AI Builder</div>
        <div className="aiw-header-actions">
          <button type="button" className="aiw-header-btn">Studio Mode</button>
          <button type="button" className="aiw-header-btn">Share</button>
        </div>
      </header>

      <main className="aiw-workspace">
        <UIGenerator />
      </main>
    </div>
  );
}

export default App;