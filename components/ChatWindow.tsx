
import React, { useState, useRef, useEffect } from 'react';
import { Message, Language, Attachment } from '../types';
import { TRANSLATIONS } from '../constants';

interface ChatWindowProps {
  messages: Message[];
  streamingContent?: string;
  onSendMessage: (text: string, attachment?: Attachment) => void;
  isLoading: boolean;
  onVoiceClick: () => void;
  onVideoClick: () => void;
  lang: Language;
  userName?: string;
  onNewChat: () => void;
  initialAttachmentRequest?: string | null;
  onAttachmentRequestHandled?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, streamingContent, onSendMessage, isLoading, onVoiceClick, onVideoClick, lang, userName, onNewChat,
  initialAttachmentRequest, onAttachmentRequestHandled
}) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang] as any;

  useEffect(() => {
    if (initialAttachmentRequest) {
      setInput(initialAttachmentRequest);
      fileInputRef.current?.click();
      onAttachmentRequestHandled?.();
    }
  }, [initialAttachmentRequest]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, streamingContent, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachment) && !isLoading && !streamingContent) {
      onSendMessage(input.trim() || (lang === 'bn' ? "এই ফাইলটি সম্পর্কে বলুন" : "Tell me about this file"), attachment || undefined);
      setInput('');
      setAttachment(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setAttachment({
          data: base64,
          mimeType: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const isMathContent = (content: string) => {
    return content.includes('$') || 
           content.includes('\\frac') || 
           content.includes('\\sqrt') || 
           content.includes('=') ||
           /[\u00B2\u00B3\u2070-\u2079]/.test(content);
  };

  const MathCard = ({ content, timestamp }: { content: string, timestamp: Date }) => {
    return (
      <div className="flex justify-start max-w-full my-6 animate-in slide-in-from-left-6 duration-700">
        <div className="math-paper border border-orange-100 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden w-full md:max-w-2xl flex flex-col hover:shadow-emerald-500/5 transition-all">
          <div className="bg-emerald-900/90 text-white px-6 py-4 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📐</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em]">{t.solutionBoard}</span>
            </div>
            <button className="text-[9px] font-medium bg-white/10 px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all uppercase tracking-widest">
              {t.saveAsImage}
            </button>
          </div>
          <div className="p-8 md:p-12 space-y-5">
             <div className="prose prose-sm prose-slate max-w-none text-slate-800 dark:text-slate-900 leading-relaxed font-normal text-[15px]">
               {content.split('\n').map((line, i) => (
                 <div key={i} className={`mb-4 ${line.startsWith('#') ? 'text-2xl font-medium border-b border-orange-200/50 pb-2 mb-8 text-emerald-900' : ''}`}>
                   {line}
                 </div>
               ))}
             </div>
          </div>
          <div className="px-6 py-4 border-t border-orange-100/30 flex justify-end items-center space-x-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            <span>{timestamp.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scroll-smooth custom-scrollbar pb-32">
        {messages.length === 0 && !streamingContent && (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-8">
            <div className="w-24 h-24 glass rounded-[2.5rem] overflow-hidden shadow-2xl animate-pulse-slow border-2 border-emerald-500/20">
              <img 
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300&auto=format&fit=crop" 
                alt="Brand Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-stylish font-medium text-slate-800 dark:text-white tracking-tight">
                {t.welcomePrefix} {userName}{t.welcomeSuffix}
              </h2>
              <p className="text-[10px] md:text-xs text-emerald-600 font-medium uppercase tracking-[0.4em] opacity-60">
                Neural Intelligence v2.5
              </p>
            </div>
          </div>
        )}
        
        {messages.map((m) => (
          m.role === 'model' && isMathContent(m.content) ? (
            <MathCard key={m.id} content={m.content} timestamp={m.timestamp} />
          ) : (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[90%] md:max-w-[75%] p-5 md:p-6 rounded-[2rem] relative shadow-sm ${
                m.role === 'user' 
                  ? 'glass-emerald text-white rounded-tr-none' 
                  : 'glass text-slate-700 dark:text-slate-200 rounded-tl-none'
              }`}>
                {m.attachment && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-white/20 bg-black/5">
                    {m.attachment.mimeType.startsWith('image/') ? (
                      <img src={`data:${m.attachment.mimeType};base64,${m.attachment.data}`} alt="attachment" className="max-w-full h-auto max-h-80 object-contain mx-auto" />
                    ) : (
                      <div className="bg-white/10 p-5 flex items-center space-x-4">
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl shadow-sm">📄</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium uppercase tracking-widest truncate">{m.attachment.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[14px] md:text-[16px] whitespace-pre-wrap leading-relaxed font-normal">
                  {m.content}
                </p>
                <div className={`text-[9px] mt-4 font-medium uppercase tracking-[0.2em] opacity-40 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.timestamp.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        ))}

        {streamingContent && (
          <div className="flex justify-start">
             <div className="glass max-w-[90%] p-5 md:p-6 rounded-[2rem] rounded-tl-none shadow-xl">
                <p className="text-[14px] md:text-[16px] whitespace-pre-wrap leading-relaxed dark:text-white font-normal">{streamingContent}</p>
                <div className="flex space-x-2 mt-5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-duration:1s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-0 right-0 p-4 md:px-10 z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="glass flex items-center space-x-3 p-2 md:p-3 rounded-[2.5rem] shadow-2xl">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-white/10 rounded-full transition-all shrink-0 active:scale-90"
              title="Attach"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <div className="flex-1 flex items-center bg-slate-100/30 dark:bg-slate-900/30 rounded-full px-4 md:px-6 focus-within:ring-2 focus-within:ring-emerald-500/30 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 py-3.5 md:py-4.5 bg-transparent text-slate-800 dark:text-white focus:outline-none text-[14px] md:text-[15px] font-normal placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
              
              <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-white/10 ml-2 pl-2">
                <button
                  type="button"
                  onClick={onVoiceClick}
                  className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-90"
                  title="Voice"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={onVideoClick}
                  className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-90"
                  title="Video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !attachment)}
              className="w-11 h-11 md:w-13 md:h-13 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-full transition-all flex items-center justify-center shrink-0 shadow-xl active:scale-95"
            >
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
