
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  onSettingsClick: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, onSettingsClick, onLogoClick }) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="bg-emerald-700 dark:bg-emerald-900 text-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <div 
        onClick={onLogoClick}
        className="flex items-center space-x-3 cursor-pointer group transition-all"
      >
        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xl shadow-inner group-hover:scale-110 group-active:scale-95 transition-transform">
          ম
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl md:text-2xl font-bold group-hover:text-emerald-200 transition-colors">{t.appName}</h1>
          <p className="text-[10px] md:text-xs text-emerald-100 opacity-90 uppercase tracking-wider">{t.appSubtitle}</p>
        </div>
        <div className="sm:hidden flex flex-col">
           <h1 className="text-lg font-bold">সহকারী</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={onLogoClick}
          className="p-2 bg-emerald-600/50 hover:bg-emerald-500 rounded-xl transition-all md:flex items-center space-x-2 hidden border border-emerald-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-sm font-medium">ড্যাশবোর্ড</span>
        </button>
        <button 
          onClick={onSettingsClick}
          className="p-2 hover:bg-emerald-600 dark:hover:bg-emerald-800 rounded-xl transition-all flex items-center space-x-2 border border-emerald-600 dark:border-emerald-800 shadow-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden md:inline font-medium">{t.settings}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
