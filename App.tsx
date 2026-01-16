
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import Dashboard from './components/Dashboard';
import VoiceOverlay from './components/VoiceOverlay';
import Login from './components/Login';
import SettingsModal from './components/SettingsModal';
import { Message, User, Language, Theme } from './types';
import { geminiService } from './services/geminiService';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('bn');
  const [theme, setTheme] = useState<Theme>('light');
  const [view, setView] = useState<'chat' | 'dashboard'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSendMessage = useCallback(async (text: string) => {
    setView('chat'); // Always switch to chat when sending a message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await geminiService.sendMessage(text, lang);
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: t.errorMsg,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [lang, t]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const handleDashboardServiceClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  if (!user) {
    return <Login onLogin={setUser} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-slate-950 flex flex-col h-screen overflow-hidden transition-colors duration-300">
      <Header 
        lang={lang} 
        onSettingsClick={() => setIsSettingsOpen(true)} 
        onLogoClick={() => setView(view === 'dashboard' ? 'chat' : 'dashboard')}
      />
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        {view === 'chat' ? (
          <div className="flex-1 overflow-hidden relative">
            <ChatWindow 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              onVoiceClick={() => setIsVoiceActive(true)}
              lang={lang}
              userName={user?.name}
            />
          </div>
        ) : (
          <Dashboard 
            user={user} 
            lang={lang} 
            onServiceClick={handleDashboardServiceClick}
            onUpdateUser={updateUser}
            onBack={() => setView('chat')}
          />
        )}
      </main>

      {/* Floating Voice Button */}
      <div className="fixed bottom-24 right-6 md:bottom-12 md:right-10 z-40">
        <button 
          onClick={() => setIsVoiceActive(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative border-4 border-white dark:border-slate-800"
          title={t.voice}
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-emerald-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-xl whitespace-nowrap pointer-events-none border border-emerald-600">
            {t.voice}
          </span>
        </button>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        theme={theme}
        user={user}
        onLangChange={setLang}
        onThemeChange={setTheme}
        onUpdateUser={updateUser}
        onLogout={() => {
          setUser(null);
          setMessages([]);
          setIsSettingsOpen(false);
          setView('chat');
        }}
      />

      {isVoiceActive && (
        <VoiceOverlay onClose={() => setIsVoiceActive(false)} lang={lang} />
      )}

      {/* Mobile Footer Navigation */}
      <footer className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-4 px-8 flex justify-around shadow-lg z-50">
        <button onClick={() => { setMessages([]); setView('chat'); }} className="flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] font-bold">New</span>
        </button>
        <button 
          onClick={() => setView(view === 'dashboard' ? 'chat' : 'dashboard')} 
          className={`flex flex-col items-center space-y-1 ${view === 'dashboard' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-[10px] font-bold">{view === 'dashboard' ? 'Chat' : 'Menu'}</span>
        </button>
        <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] font-bold">{t.settings}</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
