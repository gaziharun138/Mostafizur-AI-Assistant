
import React, { useRef, useState, useEffect } from 'react';
import { Language, Attachment } from '../types';
import { TRANSLATIONS } from '../constants';

interface MathModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSolve: (attachment: Attachment, textOverride?: string) => void;
  onVideoClick: () => void;
}

const MathModal: React.FC<MathModalProps> = ({ isOpen, onClose, lang, onSolve, onVideoClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#059669';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
          }
        }
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSolveHandwritten = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      onSolve({
        data: base64,
        mimeType: 'image/png',
        name: 'handwritten_math.png'
      }, lang === 'bn' ? 'দয়া করে আমার হাতে লেখা এই অংকটি সমাধান করে দিন।' : 'Please solve this handwritten math problem.');
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        onSolve({
          data: base64,
          mimeType: file.type,
          name: file.name
        }, lang === 'bn' ? 'দয়া করে এই অংকটি সমাধান করে দিন।' : 'Please solve this math problem.');
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-6 bg-slate-900/50 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">📐</div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{t.math}</h2>
            <p className="text-indigo-200/60 text-[10px] md:text-xs font-medium uppercase tracking-widest">{t.handMath}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2.5 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-white transition-all active:scale-90">
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Handwriting Box */}
      <div className="flex-1 p-4 md:p-8 flex flex-col min-h-0">
        <div className="flex-1 bg-white rounded-[2rem] shadow-2xl overflow-hidden relative touch-none border-4 border-emerald-500/30 ring-8 ring-slate-900/50 group">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
            className="w-full h-full cursor-crosshair"
          />
          
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={clearCanvas}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center"
              title={lang === 'bn' ? 'মুছুন' : 'Clear'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-emerald-900/10 text-4xl md:text-6xl font-black uppercase tracking-tighter select-none whitespace-nowrap">
            {lang === 'bn' ? 'এখানে অংক লিখুন' : 'WRITE MATH HERE'}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-6 grid grid-cols-4 gap-3 md:gap-6 max-w-4xl w-full mx-auto">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
          
          <button 
            onClick={() => onVideoClick()}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-slate-800 hover:bg-slate-700 text-white rounded-3xl transition-all active:scale-95 border border-white/5 shadow-xl group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70">{lang === 'bn' ? 'ক্যামেরা' : 'Camera'}</span>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-slate-800 hover:bg-slate-700 text-white rounded-3xl transition-all active:scale-95 border border-white/5 shadow-xl group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70">{lang === 'bn' ? 'ফাইল' : 'Attach'}</span>
          </button>

          <button 
            onClick={clearCanvas}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-slate-800 hover:bg-slate-700 text-white rounded-3xl transition-all active:scale-95 border border-white/5 shadow-xl group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70">{lang === 'bn' ? 'মুছুন' : 'Clear'}</span>
          </button>

          <button 
            onClick={handleSolveHandwritten}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl transition-all active:scale-95 shadow-2xl shadow-emerald-600/20 group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{lang === 'bn' ? 'সমাধান' : 'Solve'}</span>
          </button>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="pb-8 text-center">
        <p className="text-emerald-100/30 text-[10px] font-black uppercase tracking-[0.2em]">
          {lang === 'bn' ? 'Md Mostafizur Rahman AI Math Engine' : 'AI Powered Mathematical Solver'}
        </p>
      </div>
    </div>
  );
};

export default MathModal;
