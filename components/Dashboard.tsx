
import React, { useRef } from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface DashboardProps {
  user: User;
  lang: Language;
  onServiceClick: (service: string) => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, lang, onServiceClick, onUpdateUser, onBack }) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const services = [
    { id: 'health', title: t.health, desc: t.healthDesc, icon: '🏥', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', prompt: lang === 'bn' ? 'স্বাস্থ্যের জন্য কিছু সাধারণ টিপস দিন।' : 'Give me general health tips.' },
    { id: 'jobs', title: t.jobs, desc: t.jobsDesc, icon: '💼', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', prompt: lang === 'bn' ? 'চাকরির সিভিতে কী থাকা উচিত?' : 'What should be in a job CV?' },
    { id: 'agri', title: t.agri, desc: t.agriDesc, icon: '🌾', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', prompt: lang === 'bn' ? 'ধান চাষের বর্তমান পদ্ধতিগুলো কী?' : 'Current paddy farming methods?' },
    { id: 'general', title: t.general, desc: t.generalDesc, icon: '📜', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', prompt: lang === 'bn' ? 'অনলাইনে এনআইডি কার্ড ঠিক করার নিয়ম কী?' : 'How to fix NID online?' },
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="flex-1 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{t.dashboardTitle}</h2>
          <p className="text-slate-500 dark:text-slate-400">{lang === 'bn' ? 'আপনার সকল সেবার বিস্তারিত এখানে রয়েছে।' : 'All your service details are here.'}</p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="font-bold">{t.backToChat}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-emerald-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-4xl shadow-inner text-emerald-600 relative cursor-pointer group overflow-hidden"
        >
           {user.photo ? (
             <img src={user.photo} alt={user.name} className="w-full h-full object-cover rounded-3xl" />
           ) : (
             <span className="font-bold">{user.name[0]}</span>
           )}
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
           </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handlePhotoChange} 
        />
        
        <div className="text-center md:text-left space-y-1">
           <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h3>
           <p className="text-slate-500 dark:text-slate-400">
             {lang === 'bn' ? `বয়স: ${user.age || 'অজানা'}` : `Age: ${user.age || 'Unknown'}`} • {user.isGuest ? (lang === 'bn' ? 'গেস্ট ইউজার' : 'Guest User') : user.email}
           </p>
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline block pt-1"
           >
             {t.changePhoto}
           </button>
           <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-800">অ্যাক্টিভ</span>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800">বাংলাদেশ</span>
           </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s) => (
          <div 
            key={s.id}
            onClick={() => onServiceClick(s.prompt)}
            className="group bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {s.icon}
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{s.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{s.desc}</p>
            <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
               <span>{lang === 'bn' ? 'শুরু করুন' : 'Get Started'}</span>
               <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
               </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats / Info Section */}
      <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
               <h3 className="text-2xl font-bold">{lang === 'bn' ? 'সহজে কাজ সারুন' : 'Get things done easily'}</h3>
               <p className="opacity-90 max-w-md">{lang === 'bn' ? 'আমাদের এআই আপনাকে স্বাস্থ্যের খবর থেকে শুরু করে চাকরির সিভি তৈরি পর্যন্ত সব বিষয়ে সাহায্য করতে প্রস্তুত।' : 'Our AI is ready to help you with everything from health news to creating job CVs.'}</p>
            </div>
            <div className="flex gap-4">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-2xl font-bold">৯৯+</p>
                  <p className="text-[10px] uppercase font-bold opacity-70">টিপস</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-2xl font-bold">১০+</p>
                  <p className="text-[10px] uppercase font-bold opacity-70">সার্ভিস</p>
               </div>
            </div>
         </div>
         {/* Decorative blobs */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;
