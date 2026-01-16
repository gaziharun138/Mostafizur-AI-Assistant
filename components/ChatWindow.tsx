
import React, { useState, useRef, useEffect } from 'react';
import { Message, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onVoiceClick: () => void;
  lang: Language;
  userName?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, onVoiceClick, lang, userName }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const quickPrompts = lang === 'bn' ? [
    'আমার জ্বরের জন্য কী করা উচিত?',
    'একটি ভালো সিভি তৈরির টিপস দিন।',
    'ধানের পোকা দমনে কী করা যায়?',
    'পাসপোর্ট করার নিয়ম কী?'
  ] : [
    'What should I do for fever?',
    'Tips for making a good CV.',
    'How to control paddy pests?',
    'Rules for getting a passport?'
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-4xl shadow-inner">👋</div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              {t.welcomePrefix} {userName}{t.welcomeSuffix}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
              {quickPrompts.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => setInput(prompt)} 
                  className="text-left p-4 bg-gray-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 md:p-5 rounded-3xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-200 dark:border-slate-700'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              <span className={`text-[10px] mt-2 block ${m.role === 'user' ? 'text-emerald-100' : 'text-slate-500'}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-3xl rounded-tl-none border border-gray-200 dark:border-slate-700 flex space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all"
        />
        <button
          type="button"
          onClick={onVoiceClick}
          className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 rounded-2xl transition-all shadow-sm"
          title={t.voice}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white p-3 rounded-2xl transition-all shadow-md active:scale-95"
        >
          <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
