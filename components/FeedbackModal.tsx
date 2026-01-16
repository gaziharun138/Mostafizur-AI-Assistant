
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, lang }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      console.log("Feedback submitted:", feedback);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFeedback('');
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/10">
          <h2 className="text-xl font-stylish font-medium text-slate-800 dark:text-white flex items-center space-x-3 uppercase tracking-tight">
            <span className="text-emerald-600">💬</span>
            <span>{t.feedbackTitle}</span>
          </h2>
          <button onClick={onClose} className="p-2 glass-card hover:bg-white/30 rounded-xl transition-all active:scale-90 text-slate-500 dark:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-5 animate-in fade-in duration-500">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center text-emerald-600 text-4xl mx-auto shadow-xl">
                ✓
              </div>
              <p className="text-xl font-stylish font-medium text-slate-800 dark:text-white uppercase tracking-tight">{t.feedbackSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                {t.feedbackLabel}
              </label>
              <textarea
                autoFocus
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t.feedbackPlaceholder}
                className="w-full h-40 px-5 py-4 rounded-2xl glass-card text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none font-normal leading-relaxed"
              ></textarea>
              <button
                type="submit"
                disabled={!feedback.trim()}
                className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 uppercase tracking-widest text-[11px]"
              >
                <span>{t.submitFeedback}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
