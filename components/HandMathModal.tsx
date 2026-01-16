
import React, { useRef, useState, useEffect } from 'react';
import { Language, Attachment } from '../types';
import { TRANSLATIONS } from '../constants';

interface HandMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSolve: (attachment: Attachment) => void;
}

const HandMathModal: React.FC<HandMathModalProps> = ({ isOpen, onClose, lang, onSolve }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // Set styles
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
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

  const handleSolve = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      onSolve({
        data: base64,
        mimeType: 'image/png',
        name: 'handwritten_math.png'
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl font-bold text-white">{t.handMath}</h2>
        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-2xl overflow-hidden relative touch-none border-4 border-emerald-500/30">
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
        <div className="absolute top-4 left-4 flex space-x-2">
            <button 
              onClick={clearCanvas}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
            >
              {lang === 'bn' ? 'মুছুন' : 'Clear'}
            </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={handleSolve}
          className="w-full max-w-md py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold rounded-3xl shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-3"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>{lang === 'bn' ? 'সমাধান করুন' : 'Solve Now'}</span>
        </button>
      </div>
      
      <p className="text-center text-emerald-100/60 text-xs mt-4 uppercase tracking-widest font-bold">
        {lang === 'bn' ? 'স্ক্রিনে অংকটি লিখুন' : 'Write the math on screen'}
      </p>
    </div>
  );
};

export default HandMathModal;
