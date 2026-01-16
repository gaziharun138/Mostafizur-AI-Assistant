
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import Dashboard from './components/Dashboard';
import LiveOverlay from './components/LiveOverlay';
import MathModal from './components/MathModal';
import Login from './components/Login';
import SettingsModal from './components/SettingsModal';
import FeedbackModal from './components/FeedbackModal';
import { Message, User, Language, Theme, ChatSession, Attachment, AppMode } from './types';
import { geminiService } from './services/geminiService';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('bn');
  const [theme, setTheme] = useState<Theme>('light');
  const [view, setView] = useState<'chat' | 'dashboard'>('chat');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [liveMode, setLiveMode] = useState<'audio' | 'video' | null>(null);
  const [isMathModalOpen, setIsMathModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [pendingAttachmentRequest, setPendingAttachmentRequest] = useState<string | null>(null);
  const [currentAppMode, setCurrentAppMode] = useState<AppMode>(AppMode.GENERAL);

  const t = TRANSLATIONS[lang] as any;

  useEffect(() => {
    const saved = localStorage.getItem('chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp),
          messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setSessions(parsed);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const startNewChat = useCallback((mode: AppMode = AppMode.GENERAL) => {
    setCurrentSessionId(null);
    setMessages([]);
    setStreamingContent('');
    setView('chat');
    setCurrentAppMode(mode);
  }, []);

  const loadSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(session.id);
      setMessages(session.messages);
      setStreamingContent('');
      setView('chat');
      setCurrentAppMode(session.mode || AppMode.GENERAL);
    }
  }, [sessions]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      startNewChat();
    }
  }, [currentSessionId, startNewChat]);

  const saveLiveSession = useCallback((title: string, liveMessages: Message[]) => {
    if (liveMessages.length === 0) return;
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: title,
      messages: liveMessages,
      timestamp: new Date(),
      mode: currentAppMode
    };
    setSessions(prev => [newSession, ...prev]);
  }, [currentAppMode]);

  const handleModeChange = useCallback((mode: AppMode) => {
    setCurrentAppMode(mode);
    if (currentSessionId) {
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, mode: mode } : s));
    }
  }, [currentSessionId]);

  const handleSendMessage = useCallback(async (text: string, attachment?: Attachment) => {
    setView('chat');
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      attachment
    };
    
    const contextMessages = [...messages];
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setStreamingContent('');

    try {
      let fullResponse = '';
      const stream = geminiService.sendMessageStream(text, lang, contextMessages, attachment, currentAppMode);
      
      for await (const chunk of stream) {
        setIsLoading(false); 
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: fullResponse,
        timestamp: new Date(),
      };
      
      const finalMessages = [...messages, userMsg, modelMsg];
      setMessages(finalMessages);
      setStreamingContent('');

      setSessions(prev => {
        if (currentSessionId) {
          return prev.map(s => s.id === currentSessionId ? { ...s, messages: finalMessages, mode: currentAppMode } : s);
        } else {
          const newId = Date.now().toString();
          setCurrentSessionId(newId);
          return [{
            id: newId,
            title: text.length > 40 ? text.substring(0, 40) + "..." : text,
            messages: finalMessages,
            timestamp: new Date(),
            mode: currentAppMode
          }, ...prev];
        }
      });

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: t.errorMsg,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  }, [lang, t, messages, currentSessionId, currentAppMode]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    setMessages([]);
    setCurrentSessionId(null);
    localStorage.removeItem('chat_sessions');
  }, []);

  const handleDashboardServiceClick = (prompt: string, attachmentRequest?: boolean, mode: AppMode = AppMode.GENERAL) => {
    startNewChat(mode);
    if (attachmentRequest) {
      setPendingAttachmentRequest(prompt);
    } else {
      handleSendMessage(prompt);
    }
  };

  const handleMathSolve = (attachment: Attachment, textOverride?: string) => {
    const prompt = textOverride || (lang === 'bn' ? 'দয়া করে এই অংকটি সমাধান করে দিন। ' : 'Please solve this math problem.');
    handleSendMessage(prompt, attachment);
  };

  // Helper to get active mode translation
  const getActiveModeLabel = () => {
    switch (currentAppMode) {
      case AppMode.GENERAL: return t.general;
      case AppMode.HEALTH: return t.health;
      case AppMode.JOB: return t.jobs;
      case AppMode.AGRICULTURE: return t.agri;
      case AppMode.MATH_9_10: return t.math910;
      case AppMode.MATH_7: return t.math7;
      default: return t.general;
    }
  };

  if (!user) {
    return <Login onLogin={setUser} lang={lang} />;
  }

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden transition-all duration-500">
      <Header 
        lang={lang} 
        currentMode={currentAppMode}
        onModeChange={handleModeChange}
        onSettingsClick={() => setIsSettingsOpen(true)} 
        onVideoClick={() => setLiveMode('video')}
        onLogoClick={() => setView(view === 'dashboard' ? 'chat' : 'dashboard')}
      />
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 md:p-6 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        {view === 'chat' ? (
          <div className="flex-1 overflow-hidden relative">
            {/* Dynamic Active Mode Badge */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 animate-in slide-in-from-top duration-300">
              <div className="flex items-center space-x-2 bg-emerald-600/90 dark:bg-emerald-500/80 backdrop-blur-md text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] py-1.5 px-4 md:px-6 rounded-full shadow-lg border border-white/20">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                <span>{getActiveModeLabel()} {lang === 'bn' ? 'Active' : 'Active'}</span>
              </div>
            </div>
            
            <ChatWindow 
              messages={messages} 
              streamingContent={streamingContent}
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              onVoiceClick={() => setLiveMode('audio')}
              onVideoClick={() => setLiveMode('video')}
              lang={lang}
              userName={user?.name}
              onNewChat={() => startNewChat(AppMode.GENERAL)}
              initialAttachmentRequest={pendingAttachmentRequest}
              onAttachmentRequestHandled={() => setPendingAttachmentRequest(null)}
            />
          </div>
        ) : (
          <Dashboard 
            user={user} 
            lang={lang} 
            sessions={sessions}
            onServiceClick={handleDashboardServiceClick}
            onHandMathClick={() => {
              setCurrentAppMode(AppMode.GENERAL);
              setIsMathModalOpen(true);
            }}
            onVideoAIClick={() => setLiveMode('video')}
            onUpdateUser={updateUser}
            onClearHistory={clearHistory}
            onSessionSelect={loadSession}
            onDeleteSession={deleteSession}
            onBack={() => setView('chat')}
          />
        )}
      </main>

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
          setSessions([]);
          localStorage.removeItem('chat_sessions');
          setIsSettingsOpen(false);
          setView('chat');
        }}
        onFeedbackClick={() => setIsFeedbackOpen(true)}
      />

      <MathModal 
        isOpen={isMathModalOpen}
        onClose={() => setIsMathModalOpen(false)}
        lang={lang}
        onSolve={handleMathSolve}
        onVideoClick={() => setLiveMode('video')}
      />

      {liveMode && (
        <LiveOverlay 
          onClose={() => setLiveMode(null)} 
          lang={lang} 
          mode={liveMode}
          onSaveSession={saveLiveSession}
        />
      )}

      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        lang={lang}
      />

      {/* Glass Mobile Footer */}
      <footer className="md:hidden glass border-t border-white/20 py-3 px-8 flex justify-around shadow-2xl z-50">
        <button onClick={() => startNewChat(AppMode.GENERAL)} className={`flex flex-col items-center space-y-1 transition-colors ${view === 'chat' && messages.length === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
          <div className={`p-1.5 rounded-xl ${view === 'chat' && messages.length === 0 ? 'bg-emerald-100/50 dark:bg-emerald-900/40' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">New</span>
        </button>
        <button 
          onClick={() => setView(view === 'dashboard' ? 'chat' : 'dashboard')} 
          className={`flex flex-col items-center space-y-1 transition-colors ${view === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
        >
          <div className={`p-1.5 rounded-xl ${view === 'dashboard' ? 'bg-emerald-100/50 dark:bg-emerald-900/40' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
        </button>
        <button onClick={() => setLiveMode('video')} className={`flex flex-col items-center space-y-1 text-slate-500`}>
          <div className="p-1.5 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Video</span>
        </button>
        <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center space-y-1 text-slate-500">
          <div className="p-1.5 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
