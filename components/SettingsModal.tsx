
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
  onFeedbackClick: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, lang, theme, user, onLangChange, onThemeChange, onUpdateUser, onLogout, onFeedbackClick 
}) => {
  const t = TRANSLATIONS[lang] as any;
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateUser({ photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/10">
          <h2 className="text-xl font-stylish font-medium text-slate-800 dark:text-white uppercase tracking-tight">{t.settings}</h2>
          <button onClick={onClose} className="p-2 glass-card hover:bg-white/30 rounded-xl transition-all active:scale-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {user && (
            <div className="flex items-center space-x-4 p-5 glass-card rounded-2xl border border-white/20">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full glass flex items-center justify-center text-white overflow-hidden shadow-inner relative cursor-pointer"
              >
                {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-2xl font-medium text-emerald-600">{user.name[0]}</span>}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpdate} accept="image/*" />
              <div className="flex-1">
                <p className="font-medium text-lg text-slate-800 dark:text-white leading-tight uppercase tracking-tight">{user.name}</p>
                <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-widest mt-1">CHANGE PHOTO</button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">{t.language}</label>
              <div className="flex p-1.5 glass-card rounded-xl">
                <button onClick={() => onLangChange('bn')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-medium transition-all ${lang === 'bn' ? 'glass text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>বাংলা</button>
                <button onClick={() => onLangChange('en')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-medium transition-all ${lang === 'en' ? 'glass text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>ENGLISH</button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">{t.theme}</label>
              <div className="flex p-1.5 glass-card rounded-xl">
                <button onClick={() => onThemeChange('light')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-medium transition-all ${theme === 'light' ? 'glass text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>LIGHT</button>
                <button onClick={() => onThemeChange('dark')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-medium transition-all ${theme === 'dark' ? 'glass text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>DARK</button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <button onClick={onFeedbackClick} className="w-full py-3.5 glass-card hover:bg-white/20 rounded-xl text-slate-700 dark:text-slate-300 font-medium text-[11px] transition-all uppercase tracking-widest flex items-center justify-center space-x-2">
              <span className="text-lg">💬</span>
              <span>{t.sendFeedback}</span>
            </button>
            <button onClick={onLogout} className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium text-[11px] transition-all border border-red-500/20 rounded-xl uppercase tracking-widest flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
