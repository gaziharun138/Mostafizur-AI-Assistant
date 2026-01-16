
import React, { useRef } from 'react';
import { Language, Theme, User } from '../types';
import { TRANSLATIONS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
  user: User | null;
  onLangChange: (lang: Language) => void;
  onThemeChange: (theme: Theme) => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, lang, theme, user, onLangChange, onThemeChange, onUpdateUser, onLogout 
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 dark:border-slate-700">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-emerald-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.settings}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 dark:hover:bg-slate-700 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {user && (
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white overflow-hidden shadow-sm relative cursor-pointer"
              >
                {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-2xl font-bold">{user.name[0]}</span>}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   </svg>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handlePhotoUpdate} 
                accept="image/*" 
              />
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.isGuest ? (lang === 'bn' ? 'গেস্ট অ্যাকাউন্ট' : 'Guest Account') : user.email}</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider hover:underline"
                >
                  {t.changePhoto}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">{t.language}</label>
              <div className="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-xl">
                <button 
                  onClick={() => onLangChange('bn')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${lang === 'bn' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                >
                  বাংলা
                </button>
                <button 
                  onClick={() => onLangChange('en')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                >
                  English
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">{t.theme}</label>
              <div className="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-xl">
                <button 
                  onClick={() => onThemeChange('light')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${theme === 'light' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
                  <span>{t.light}</span>
                </button>
                <button 
                  onClick={() => onThemeChange('dark')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${theme === 'dark' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  <span>{t.dark}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t dark:border-slate-700">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">{t.devInfo}</label>
            <div className="bg-emerald-50 dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 space-y-2">
              <div className="flex items-center space-x-3 text-slate-800 dark:text-white">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-bold">{t.devName}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-slate-600 dark:text-slate-400">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                </svg>
                <span>{t.devRole}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${t.devPhone.replace(/\s+/g, '')}`} className="hover:underline">{t.devPhone}</a>
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 p-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all font-bold border border-red-100 dark:border-red-900/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{t.logout}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
