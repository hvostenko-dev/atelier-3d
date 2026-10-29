import React from 'react';

const renderVectorIcon = (type) => {
  switch (type) {
    case 'palette':
      return (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    case 'type':
      return (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'sliders':
      return (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      );
    case 'upload':
      return (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    case 'bookmark':
      return (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'front':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'back':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      );
    case 'pattern':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      );
    case 'wireframe':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'rotate':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    default:
      return null;
  }
};

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  if (isFilterTab) {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={tab.label || tab.name}
        className={`group relative flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-full text-[11px] lg:text-xs font-semibold transition-all duration-200 cursor-pointer select-none border shrink-0 whitespace-nowrap ${
          isActiveTab
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25'
            : 'bg-slate-900/85 text-slate-300 border-white/15 hover:border-white/30 hover:text-white hover:bg-slate-800/90 backdrop-blur-md'
        }`}
      >
        {renderVectorIcon(tab.svgType)}
        <span>{tab.label}</span>
        {isActiveTab && (
          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`${tab.label || tab.name} ${tab.shortcut ? `[${tab.shortcut}]` : ''}`}
      className={`group relative w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl flex justify-center items-center transition-all duration-200 cursor-pointer select-none shrink-0 ${
        isActiveTab
          ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 scale-105'
          : 'text-slate-300 hover:text-white hover:bg-white/10'
      }`}
    >
      {renderVectorIcon(tab.svgType) || (
        <img
          src={tab.icon}
          alt={tab.name}
          className="w-4 h-4 lg:w-5 lg:h-5 object-contain"
        />
      )}

      {/* Tooltip on hover (desktop only) */}
      <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900/95 text-slate-100 text-xs font-medium whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl z-50 hidden md:block">
        {tab.label}
        {tab.shortcut && (
          <span className="ml-1.5 px-1 py-0.5 text-[10px] rounded bg-white/10 text-amber-300 font-mono">
            {tab.shortcut}
          </span>
        )}
      </span>
    </button>
  );
};

export default Tab;
