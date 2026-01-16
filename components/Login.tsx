
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { TRANSLATIONS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  lang: 'bn' | 'en';
}

const Login: React.FC<LoginProps> = ({ onLogin, lang }) => {
  const t = TRANSLATIONS[lang];
  const [guestName, setGuestName] = useState('');
  const [guestPhoto, setGuestPhoto] = useState<string | undefined>(undefined);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    onLogin({ 
      id: 'guest-' + Date.now(), 
      name: guestName.trim(), 
      photo: guestPhoto, 
      isGuest: true 
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGuestPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6">
      <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center space-y-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden shadow-xl shadow-emerald-600/30 rotate-2 border-2 border-emerald-500/20">
          <img 
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop" 
            alt="App Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-stylish font-medium text-slate-800 dark:text-white uppercase tracking-tight leading-none">{t.loginTitle}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium uppercase tracking-[0.25em] opacity-70">{t.loginSubtitle}</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => onLogin({ id: 'demo', name: 'User', isGuest: false })}
            className="group w-full flex items-center justify-center space-x-3 glass-card py-3.5 rounded-xl border border-white/20 hover:bg-white/30 dark:hover:bg-white/10 transition-all font-stylish text-[10px] uppercase tracking-widest text-slate-700 dark:text-slate-300"
          >
            <span className="text-xl opacity-60">👤</span>
            <span>{t.googleLogin}</span>
          </button>

          {!isGuestMode ? (
            <button 
              onClick={() => setIsGuestMode(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl transition-all font-stylish text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 font-medium"
            >
              {t.guestLogin}
            </button>
          ) : (
            <form onSubmit={handleGuestLogin} className="space-y-6 text-left animate-in slide-in-from-top-4 duration-400">
              <div className="flex flex-col items-center space-y-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                  {guestPhoto ? <img src={guestPhoto} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-2xl opacity-10">📸</span>}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t.selectPhoto}</span>
              </div>

              <input 
                type="text" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl glass-card outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-normal transition-all"
                placeholder={t.guestNameLabel}
                required
              />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl transition-all font-stylish text-[11px] uppercase tracking-[0.25em] shadow-xl active:scale-95 font-medium">
                START NOW
              </button>
              <button type="button" onClick={() => setIsGuestMode(false)} className="w-full text-slate-400 dark:text-slate-500 text-[9px] font-medium hover:text-emerald-600 transition-colors uppercase tracking-[0.3em] text-center">
                BACK
              </button>
            </form>
          )}
        </div>
        
        <p className="text-[8px] text-slate-400 font-medium uppercase tracking-[0.6em] pt-4">© MOSTAFIZUR RAHMAN</p>
      </div>
    </div>
  );
};

export default Login;
