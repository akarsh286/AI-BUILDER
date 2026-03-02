import React, { useState, useEffect } from 'react';
import UIGenerator from './components/UIGenerator.jsx';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-300/40 border-t-transparent rounded-full animate-spin animation-delay-500"></div>
          </div>
          <div className="text-center animate-fade-in-up animation-delay-500">
            <p className="text-2xl font-bold gradient-text">AI Builder</p>
            <p className="text-sm text-gray-400 mt-1">Crafting your experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden">
      {/* Animated Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-3000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-500"></div>
      </div>

      <div className="flex relative z-10">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110 border border-gray-700/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Enhanced Sidebar */}
        <aside className={`
          fixed md:relative z-40 w-72 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-950/90 backdrop-blur-xl p-6 border-r border-gray-700/40
          transform transition-all duration-500 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          h-screen flex flex-col
        `}>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Logo Section */}
          <div className="flex items-center mb-10 group">
            <div className="w-11 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mr-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1V2M4 7l2 1M4 7l2-1M4 7v2.5M12 21.5V19M12 19l2-1m-2 1l-2-1m2-1.5V14" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI Builder
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' },
              { id: 'projects', label: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
              { id: 'templates', label: 'Templates', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', badge: 'NEW' },
              { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`
                  w-full flex items-center p-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                  ${activeItem === item.id 
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-300 border border-indigo-500/30 shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                  }
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3 transition-transform duration-300 flex-shrink-0 ${activeItem === item.id ? 'scale-110' : 'group-hover:scale-110'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
                </svg>
                <span className="font-medium relative z-10 flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-md relative z-10">{item.badge}</span>
                )}
                {activeItem === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse relative z-10"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-4 border-t border-gray-700/50"></div>

          {/* User Profile Section */}
          <div className="p-4 glass rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="font-bold text-xs">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">AI Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Pro Plan
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-gray-950/70 backdrop-blur-xl border-b border-gray-700/40">
            <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-700/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
                readOnly
              />
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button className="relative p-2 rounded-xl hover:bg-gray-800/60 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
                AI
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-8 lg:p-10">
            <div className="max-w-5xl mx-auto">
              {/* Main Heading */}
              <div className="mb-8 md:mb-10 animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 gradient-text leading-tight">
                  What would you like to build today?
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  Describe your vision and let AI bring it to life instantly.
                </p>
              </div>

              {/* UIGenerator with glow effect */}
              <div className="glass rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:border-indigo-500/30 animate-glow-pulse animate-fade-in-up animation-delay-200">
                <div className="p-6 md:p-8">
                  <UIGenerator />
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                {[
                  { 
                    label: 'Projects Created', 
                    value: '1,234', 
                    color: 'from-blue-500 to-cyan-500',
                    change: '+12% ↑',
                    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
                    delay: '0ms'
                  },
                  { 
                    label: 'Active Users', 
                    value: '5,678', 
                    color: 'from-purple-500 to-pink-500',
                    change: '+8% ↑',
                    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                    delay: '150ms'
                  },
                  { 
                    label: 'Templates', 
                    value: '89', 
                    color: 'from-green-500 to-emerald-500',
                    change: '+5% ↑',
                    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
                    delay: '300ms'
                  },
                ].map((stat) => (
                  <div 
                    key={stat.label}
                    className="glass rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className={`w-11 h-11 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">{stat.value}</h3>
                    <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                    <p className="text-green-400 text-xs font-semibold mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="py-5 px-8 border-t border-gray-800/50 text-center text-sm text-gray-500">
            Built with ❤️ by AI Builder Team &copy; {new Date().getFullYear()}
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;