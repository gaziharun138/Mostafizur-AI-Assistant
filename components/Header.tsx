
import React, { useState, useRef, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, AppMode } from '../types';

interface HeaderProps {
  lang: Language;
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onSettingsClick: () => void;
  onVideoClick: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, currentMode, onModeChange, onSettingsClick, onVideoClick, onLogoClick }) => {
  const t = TRANSLATIONS[lang];
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: AppMode.GENERAL, label: t.general, icon: '📜' },
    { id: AppMode.MATH_7, label: t.math7, icon: '📙' },
    { id: AppMode.MATH_9_10, label: t.math910, icon: '📘' },
    { id: AppMode.HEALTH, label: t.health, icon: '🏥' },
    { id: AppMode.JOB, label: t.jobs, icon: '💼' },
    { id: AppMode.AGRICULTURE, label: t.agri, icon: '🌾' },
  ];

  const activeModeObj = modes.find(m => m.id === currentMode) || modes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="glass border-b border-emerald-500/20 py-3 px-4 md:px-8 flex justify-between items-center sticky top-0 z-[100]">
      <div 
        onClick={onLogoClick}
        className="flex items-center space-x-3.5 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:rotate-6 transition-transform border border-emerald-500/30">
          <img 
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop" 
            alt="Logo" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/100?text=M";
            }}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[15px] md:text-[17px] font-stylish font-medium text-slate-800 dark:text-white leading-tight tracking-tight">
            {t.appName}
          </h1>
          <p className="text-[8px] md:text-[9px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-[0.3em] mt-0.5">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/15 active:scale-95 shadow-sm"
          >
            <span className="text-lg">{activeModeObj.icon}</span>
            <span className="hidden sm:inline font-stylish text-[10px] uppercase tracking-[0.15em] font-medium opacity-90">
              {activeModeObj.label}
            </span>
            <svg className={`w-3 h-3 transition-transform duration-300 ${isModeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isModeDropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 glass rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-2 space-y-1">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onModeChange(mode.id);
                      setIsModeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all ${
                      currentMode === mode.id 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{mode.icon}</span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.15em]">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onVideoClick}
          className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-white/70 hover:text-emerald-600 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-white/10 rounded-2xl transition-all active:scale-90"
          title="Visual Assistant"
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        <button 
          onClick={onSettingsClick}
          className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-white/70 hover:text-emerald-600 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-white/10 rounded-2xl transition-all active:scale-90"
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
