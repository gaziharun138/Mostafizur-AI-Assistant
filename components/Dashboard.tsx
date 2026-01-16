
import React, { useRef, useState, useMemo } from 'react';
import { User, Language, ChatSession, AppMode } from '../types';
import { TRANSLATIONS } from '../constants';

interface DashboardProps {
  user: User;
  lang: Language;
  sessions: ChatSession[];
  onServiceClick: (service: string, attachmentRequest?: boolean, mode?: AppMode) => void;
  onHandMathClick: () => void;
  onVideoAIClick: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onClearHistory: () => void;
  onSessionSelect: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onBack: () => void;
}

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  badge?: string;
  prompt?: string;
  mode?: AppMode;
  customAction?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, lang, sessions, onServiceClick, onHandMathClick, onVideoAIClick, onUpdateUser, onClearHistory, onSessionSelect, onDeleteSession, onBack 
}) => {
  const t = TRANSLATIONS[lang] as any;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | AppMode>('ALL');

  const services: ServiceItem[] = [
    { 
      id: 'math7', 
      title: t.math7, 
      desc: t.math7Desc, 
      icon: '📙', 
      color: 'bg-gradient-to-br from-orange-500/80 to-orange-600/80 shadow-orange-500/20', 
      badge: lang === 'bn' ? 'গণিত টিউটর' : 'MATH TUTOR',
      mode: AppMode.MATH_7, 
      prompt: lang === 'bn' ? 'আসসালামু আলাইকুম। আমি সপ্তম শ্রেণির গণিতের কোনো অংক বুঝতে চাই।' : 'Assalamu Alaikum. I want to understand a math problem from Class 7 Math.' 
    },
    { 
      id: 'math910', 
      title: t.math910, 
      desc: t.math910Desc, 
      icon: '📘', 
      color: 'bg-gradient-to-br from-indigo-500/80 to-indigo-700/80 shadow-indigo-500/20', 
      badge: lang === 'bn' ? 'গণিত টিউটর' : 'MATH TUTOR',
      mode: AppMode.MATH_9_10, 
      prompt: lang === 'bn' ? 'আসসালামু আলাইকুম। আমি নবম-দশম শ্রেণির সাধারণ গণিতের কোনো অংক বুঝতে চাই।' : 'Assalamu Alaikum. I want to understand a math problem from Class 9-10 General Math.' 
    },
    { id: 'math', title: t.math, desc: t.mathDesc, icon: '📐', color: 'glass-card border-blue-500/20 text-blue-600 dark:text-blue-400', customAction: onHandMathClick },
    { id: 'video_ai', title: lang === 'bn' ? 'ভিডিও এআই' : 'Video AI', desc: lang === 'bn' ? 'সরাসরি দেখে অংক সমাধান ও গাইড।' : 'Visual guide and math solving.', icon: '📹', color: 'glass-card border-purple-500/20 text-purple-600 dark:text-purple-400', customAction: onVideoAIClick },
    { id: 'health', title: t.health, desc: t.healthDesc, icon: '🏥', color: 'glass-card border-red-500/20 text-red-600 dark:text-red-400', prompt: lang === 'bn' ? 'স্বাস্থ্যের জন্য কিছু সাধারণ টিপস দিন।' : 'Give me general health tips.' },
    { id: 'jobs', title: t.jobs, desc: t.jobsDesc, icon: '💼', color: 'glass-card border-sky-500/20 text-sky-600 dark:text-sky-400', prompt: lang === 'bn' ? 'চাকরির সিভিতে কী থাকা উচিত?' : 'What should be in a job CV?' },
    { id: 'agri', title: t.agri, desc: t.agriDesc, icon: '🌾', color: 'glass-card border-emerald-500/20 text-emerald-600 dark:text-emerald-400', prompt: lang === 'bn' ? 'ধান চাষের বর্তমান পদ্ধতিগুলো কী?' : 'Current paddy farming methods?' },
  ];

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'ALL' || session.mode === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [sessions, searchTerm, activeFilter]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateUser({ photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm(lang === 'bn' ? 'আপনি কি এই চ্যাটটি ডিলিট করতে চান?' : 'Do you want to delete this chat?')) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <div className="flex-1 space-y-6 overflow-y-auto pb-40 px-2 md:px-1 scrollbar-hide animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Bar */}
      <div className="flex items-center justify-between glass p-4 rounded-[1.5rem] shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl shadow-inner animate-pulse-slow">👋</div>
          <div>
            <h2 className="text-lg md:text-xl font-medium text-slate-800 dark:text-white leading-tight tracking-tight uppercase">{t.dashboardTitle}</h2>
            <p className="text-[9px] text-emerald-600 font-medium uppercase tracking-[0.2em] opacity-80 mt-0.5">Intelligence Overview</p>
          </div>
        </div>
        <button 
          onClick={onBack} 
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-medium rounded-xl shadow-lg transition-all active:scale-90 uppercase tracking-widest"
        >
          {t.backToChat}
        </button>
      </div>

      {/* Profile Section */}
      <div className="glass rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden group">
        <div className="relative shrink-0">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-[1.5rem] glass-card flex items-center justify-center text-5xl shadow-inner cursor-pointer overflow-hidden group/photo hover:scale-105 transition-all"
          >
             {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : <span className="font-medium text-slate-300">{user.name[0]}</span>}
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
             </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
           <div>
             <h3 className="text-2xl font-medium text-slate-800 dark:text-white leading-tight tracking-tight uppercase">{user.name}</h3>
             <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
               <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[9px] font-medium rounded-full border border-emerald-500/20 uppercase tracking-widest">
                 {user.isGuest ? (lang === 'bn' ? 'গেস্ট অ্যাকাউন্ট' : 'GUEST USER') : 'VERIFIED'}
               </span>
             </div>
           </div>
           
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="text-[9px] font-medium text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-[0.2em] border-b border-emerald-600/20 pb-0.5 inline-block"
           >
             {t.changePhoto}
           </button>
        </div>
      </div>

      {/* Main Tutors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.slice(0, 2).map((s) => (
          <div 
            key={s.id}
            onClick={() => onServiceClick(s.prompt || '', false, s.mode)}
            className={`${s.color} backdrop-blur-md border border-white/20 rounded-[1.5rem] p-6 text-white shadow-xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group`}
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-3xl backdrop-blur-xl shadow-lg border border-white/10 group-hover:rotate-12 transition-transform">
                  {s.icon}
                </div>
                <span className="px-3 py-1 bg-yellow-400 text-yellow-950 text-[9px] font-medium rounded-lg shadow-md animate-pulse uppercase tracking-wider">
                  {s.badge}
                </span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-medium uppercase tracking-tight leading-none">{s.title}</h3>
                <p className="text-xs md:text-sm text-white/80 font-normal leading-relaxed mt-2 opacity-90">{s.desc}</p>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      {/* Secondary Services */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {services.slice(2).map((s) => (
          <div 
            key={s.id}
            onClick={() => s.customAction ? s.customAction() : onServiceClick(s.prompt || '', false, s.mode)}
            className={`${s.color} p-4 md:p-6 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all cursor-pointer text-center flex flex-col items-center gap-3 group hover:-translate-y-1`}
          >
            <div className={`w-12 h-12 glass-card rounded-xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}>
              {s.icon}
            </div>
            <h4 className="text-[9px] font-medium uppercase tracking-[0.2em] leading-tight opacity-70 group-hover:opacity-100 transition-opacity">{s.title}</h4>
          </div>
        ))}
      </div>

      {/* Chat History Section - Compact */}
      <div className="glass rounded-[2rem] p-5 md:p-6 shadow-sm space-y-6">
        <div className="flex flex-row items-center justify-between gap-4">
           <div>
             <h3 className="text-xl font-medium text-slate-800 dark:text-white uppercase tracking-tight leading-none">{t.chatHistory}</h3>
             <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.3em] mt-1">Records ({sessions.length})</p>
           </div>
           {sessions.length > 0 && (
             <button onClick={onClearHistory} className="text-[9px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30 transition-all uppercase tracking-widest">
               {t.clearHistory}
             </button>
           )}
        </div>
        
        <div className="relative group/search">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass-card text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner placeholder:text-slate-400 font-normal"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-emerald-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center opacity-10">
            <span className="text-5xl">📂</span>
            <p className="text-[10px] font-medium uppercase tracking-widest mt-4">Empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSessions.map(session => (
              <div 
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className="glass-card p-4 rounded-xl hover:border-emerald-500/30 hover:shadow-md transition-all cursor-pointer relative group/item active:scale-95"
              >
                 <button 
                   onClick={(e) => handleDelete(e, session.id)}
                   className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                 </button>

                 <div className="space-y-2">
                    <div className="flex items-center justify-between opacity-40">
                      <p className="text-[8px] font-medium uppercase tracking-widest">
                        {session.timestamp.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                      </p>
                    </div>
                    <p className="font-medium text-sm text-slate-800 dark:text-white line-clamp-1 pr-8 leading-tight uppercase tracking-tight">
                      {session.title}
                    </p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Developer Information Section - Compact & Social added */}
      <div className="ai-mesh rounded-[2rem] p-5 md:p-6 shadow-xl space-y-4 relative overflow-hidden border border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
           <div className="flex items-center space-x-2">
             <div className="w-7 h-7 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center text-sm border border-indigo-500/20 shadow-lg animate-pulse-slow">👨‍💻</div>
             <h3 className="text-[9px] font-medium uppercase tracking-[0.3em] text-white opacity-50">Architect Core</h3>
           </div>
           <p className="text-[8px] text-white/10 font-medium uppercase tracking-[0.6em] hidden sm:block">MOST-AI CORE v2.5</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-16 h-16 glass rounded-[1.5rem] flex items-center justify-center text-4xl flex-shrink-0 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.03)] group-hover:scale-105 transition-transform">
            👤
          </div>
          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="space-y-1">
              <h4 className="text-lg md:text-xl font-medium text-white uppercase tracking-tight leading-none">{t.devName}</h4>
              <p className="text-indigo-400 text-[9px] uppercase tracking-[0.2em] font-medium opacity-80">{t.devRole}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="glass p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all group/card">
                 <p className="text-[7px] font-medium text-white/20 uppercase tracking-[0.2em] mb-1 group-hover/card:text-indigo-400 transition-colors">ACADEMIC</p>
                 <p className="text-[11px] font-normal text-slate-200 leading-tight opacity-90 line-clamp-1">{t.devEdu}</p>
              </div>
              <div className="glass p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all group/card">
                 <p className="text-[7px] font-medium text-white/20 uppercase tracking-[0.2em] mb-1 group-hover/card:text-indigo-400 transition-colors">CONTACT</p>
                 <p className="text-[11px] font-normal text-slate-200 leading-tight opacity-90 line-clamp-1">{t.devPhone}</p>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              <a 
                href="https://wa.me/8801613572749" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 transition-all active:scale-95 group/wa"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.237 3.483 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.652zm5.841-3.351c1.554.923 3.09 1.408 4.704 1.408 5.178 0 9.395-4.217 9.397-9.396.001-2.511-.98-4.872-2.759-6.653-1.779-1.78-4.14-2.759-6.649-2.759-5.178 0-9.395 4.217-9.397 9.396 0 1.688.455 3.335 1.317 4.773l-1.094 3.993 4.081-1.072zm9.724-12.16c.301.15.501.25.601.4s.1.45.05.6-.25.5-.5.65c-.25.15-.4.25-.65.4-.25.15-.4.25-.65.4s-.4.25-.65.4c-.25.15-.4.25-.65.4s-.4.25-.65.4c-.25.15-.4.25-.65.4s-.4.25-.65.4c-.25.15-.4.25-.65.4z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
              </a>
              <a 
                href="https://facebook.com/mdmostafizur001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all active:scale-95 group/fb"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Facebook</span>
              </a>
            </div>
          </div>
        </div>
        <p className="text-center text-[7px] text-white/10 uppercase tracking-[1em] pt-2 select-none">© MOSTAFIZUR RAHMAN AI SYSTEM 2024</p>
      </div>
    </div>
  );
};

export default Dashboard;
