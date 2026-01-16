
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
  const [guestAge, setGuestAge] = useState('');
  const [guestPhoto, setGuestPhoto] = useState<string | undefined>(undefined);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    onLogin({
      id: 'guest-' + Date.now(),
      name: guestName.trim(),
      age: guestAge ? parseInt(guestAge) : undefined,
      photo: guestPhoto,
      isGuest: true
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuestPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleLogin = () => {
    onLogin({
      id: 'google-' + Date.now(),
      name: 'Mostafizur Rahman',
      email: 'mostafizur@example.com',
      photo: 'https://ui-avatars.com/api/?name=Mostafizur+Rahman&background=059669&color=fff',
      isGuest: false
    });
  };

  return (
    <div className="fixed inset-0 bg-emerald-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 border border-emerald-100 dark:border-slate-700">
        <div className="w-20 h-20 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-lg transform rotate-3">
          ম
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.loginTitle}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t.loginSubtitle}</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 py-3 rounded-xl transition-all font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{t.googleLogin}</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500">{lang === 'bn' ? 'অথবা' : 'or'}</span>
            </div>
          </div>

          {!isGuestMode ? (
            <button 
              onClick={() => setIsGuestMode(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition-all font-medium shadow-md"
            >
              {t.guestLogin}
            </button>
          ) : (
            <form onSubmit={handleGuestLogin} className="space-y-4 text-left animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col items-center space-y-2">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-slate-900 border-2 border-emerald-500/30 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                  {guestPhoto ? (
                    <img src={guestPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] text-white font-bold">{guestPhoto ? 'Edit' : 'Add'}</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.selectPhoto}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 ml-1">{t.guestNameLabel}</label>
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder={lang === 'bn' ? 'উদা: মোস্তাফিজুর' : 'e.g. Mostafizur'}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 ml-1">{t.guestAgeLabel}</label>
                <input 
                  type="number" 
                  value={guestAge}
                  onChange={(e) => setGuestAge(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder={lang === 'bn' ? 'বয়স' : 'Age'}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition-all font-bold shadow-lg"
              >
                {t.guestLogin}
              </button>
              <button 
                type="button"
                onClick={() => setIsGuestMode(false)}
                className="w-full text-slate-500 text-xs font-bold hover:underline"
              >
                {lang === 'bn' ? 'পিছনে যান' : 'Go back'}
              </button>
            </form>
          )}
        </div>
        
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
          {lang === 'bn' ? 'মোস্তাফিজুর রহমান দ্বারা চালিত' : 'Powered by Mostafizur Rahman'}
        </p>
      </div>
    </div>
  );
};

export default Login;
