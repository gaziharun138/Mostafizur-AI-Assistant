
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { SYSTEM_INSTRUCTION, TRANSLATIONS } from '../constants';
import { Language, Message } from '../types';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface LiveOverlayProps {
  onClose: () => void;
  lang: Language;
  mode: 'audio' | 'video';
  onSaveSession: (title: string, messages: Message[]) => void;
}

const LiveOverlay: React.FC<LiveOverlayProps> = ({ onClose, lang, mode, onSaveSession }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const t = TRANSLATIONS[lang];
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const frameIntervalRef = useRef<number | null>(null);

  const conversationRef = useRef<Message[]>([]);
  const currentInputTransRef = useRef('');
  const currentOutputTransRef = useRef('');

  const cleanup = () => {
    if (conversationRef.current.length > 0) {
      const title = mode === 'video' ? t.videoSession : t.voiceSession;
      onSaveSession(title, [...conversationRef.current]);
    }

    if (sessionRef.current) {
      sessionRef.current.close?.();
    }
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
    }
    sourcesRef.current.forEach(s => {
        try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    if (audioContextsRef.current) {
      audioContextsRef.current.input.close();
      audioContextsRef.current.output.close();
    }
  };

  useEffect(() => {
    const startSession = async () => {
      try {
        if (!(window as any).aistudio?.hasSelectedApiKey()) {
          setError(lang === 'bn' ? "দয়া করে একটি পেইড এপিআই কি সিলেক্ট করুন।" : "Please select a paid API key for Live Assistant.");
          await (window as any).aistudio?.openSelectKey();
        }

        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: mode === 'video' 
        });

        if (mode === 'video' && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        await inputCtx.resume();
        await outputCtx.resume();
        
        audioContextsRef.current = { input: inputCtx, output: outputCtx };

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
            systemInstruction: SYSTEM_INSTRUCTION(lang) + `\nYou are now in ${mode} mode. I am hearing and seeing you. Be friendly.`,
            outputAudioTranscription: {},
            inputAudioTranscription: {},
          },
          callbacks: {
            onopen: () => {
              setIsConnecting(false);
              setIsActive(true);
              
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob: Blob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);

              if (mode === 'video' && videoRef.current && canvasRef.current) {
                const videoEl = videoRef.current;
                const canvasEl = canvasRef.current;
                const ctx = canvasEl.getContext('2d');
                
                frameIntervalRef.current = window.setInterval(() => {
                  if (videoEl.videoWidth && videoEl.videoHeight && ctx) {
                    canvasEl.width = 480;
                    canvasEl.height = (videoEl.videoHeight / videoEl.videoWidth) * 480;
                    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
                    
                    canvasEl.toBlob((blob) => {
                      if (blob) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64Data = (reader.result as string).split(',')[1];
                          sessionPromise.then((session) => {
                            session.sendRealtimeInput({
                              media: { data: base64Data, mimeType: 'image/jpeg' }
                            });
                          });
                        };
                        reader.readAsDataURL(blob);
                      }
                    }, 'image/jpeg', 0.5);
                  }
                }, 1000);
              }
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                const text = message.serverContent.outputTranscription.text;
                setTranscription(prev => prev + text);
                currentOutputTransRef.current += text;
              } else if (message.serverContent?.inputTranscription) {
                const text = message.serverContent.inputTranscription.text;
                currentInputTransRef.current += text;
              }

              if (message.serverContent?.turnComplete) {
                if (currentInputTransRef.current.trim()) {
                  conversationRef.current.push({
                    id: 'user-' + Date.now(),
                    role: 'user',
                    content: currentInputTransRef.current.trim(),
                    timestamp: new Date()
                  });
                }
                if (currentOutputTransRef.current.trim()) {
                  conversationRef.current.push({
                    id: 'model-' + Date.now(),
                    role: 'model',
                    content: currentOutputTransRef.current.trim(),
                    timestamp: new Date()
                  });
                }
                currentInputTransRef.current = '';
                currentOutputTransRef.current = '';
                setTranscription('');
              }

              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputCtx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => {
                    try { s.stop(); } catch(e) {}
                });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error('Live Error:', e);
              setError(lang === 'bn' ? "সংযোগ বিচ্ছিন্ন হয়েছে। এপিআই কি চেক করুন।" : "Connection failed. Please check your API key/billing.");
              setIsConnecting(false);
            },
            onclose: () => {
              setIsActive(false);
              setIsConnecting(false);
            }
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error(err);
        setError(lang === 'bn' ? "সংযোগ এবং হার্ডওয়্যার চেক করুন।" : "Hardware/Connection error. Check permissions.");
        setIsConnecting(false);
      }
    };

    startSession();
    return cleanup;
  }, [lang, mode]);

  return (
    <div className="fixed inset-0 z-[120] ai-mesh flex flex-col items-center justify-center p-4 md:p-8 text-white">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
        backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-4 glass rounded-2xl hover:bg-white/10 transition-all z-50 active:scale-90"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col items-center space-y-8 w-full max-w-2xl text-center relative z-10">
        <div className="relative group">
          {mode === 'video' ? (
            <div className={`w-64 h-64 md:w-[450px] md:h-[450px] rounded-[3rem] overflow-hidden border-2 border-indigo-400/40 shadow-[0_0_50px_rgba(99,102,241,0.3)] relative group ${isActive ? 'ring-2 ring-indigo-400' : ''}`}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Animated Scan Line */}
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan opacity-60"></div>
              )}

              {!isActive && isConnecting && (
                <div className="absolute inset-0 glass flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs uppercase tracking-[0.3em] opacity-60">Initializing Vision</p>
                </div>
              )}
            </div>
          ) : (
            <div className={`w-40 h-40 md:w-64 md:h-64 rounded-full bg-indigo-500/10 flex items-center justify-center border-2 border-indigo-400/20 ${isActive ? 'animate-pulse-slow' : ''}`}>
               <div className={`w-32 h-32 md:w-52 md:h-52 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)] ${isActive ? 'scale-105' : ''} transition-transform duration-700`}>
                  <svg className="w-16 h-16 md:w-24 md:h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-stylish font-medium tracking-tight">
            {isConnecting ? t.connecting : (isActive ? t.listening : 'Session Idle')}
          </h2>
          <p className="text-indigo-200/60 text-base md:text-xl font-normal max-w-sm mx-auto leading-relaxed">
            {mode === 'video' 
              ? (lang === 'bn' ? 'ক্যামেরাটি ব্যবহার করে আমাকে আপনার সমস্যা দেখান।' : 'Use your camera to show me the problem.')
              : t.voiceHint}
          </p>
          
          {transcription && (
            <div className="glass p-6 rounded-[2rem] text-lg md:text-xl italic shadow-2xl max-w-lg mx-auto leading-relaxed border-white/5">
              "{transcription}"
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl text-red-200 text-sm md:text-base animate-in fade-in duration-300">
              {error}
              <button 
                onClick={() => (window as any).aistudio?.openSelectKey()} 
                className="block mx-auto mt-3 underline font-medium opacity-80"
              >
                Switch API Key
              </button>
            </div>
          )}
        </div>

        {/* AI Audio Visualizer */}
        <div className="w-full flex justify-center items-end space-x-1.5 md:space-x-3 h-12">
           {[1,2,3,4,5,6,7,8].map(i => (
             <div 
              key={i} 
              className={`w-1.5 md:w-2.5 bg-indigo-400 rounded-full ${isActive ? 'animate-[bounce_1.5s_infinite]' : 'h-1 opacity-20'}`} 
              style={{ 
                animationDelay: `${i*0.15}s`,
                height: isActive ? `${Math.random() * 40 + 10}px` : '4px'
              }}
             ></div>
           ))}
        </div>
      </div>
      
      <div className="mt-12 text-[10px] md:text-xs text-indigo-300/40 uppercase tracking-[0.4em] font-medium text-center">
        Powered by Mostafizur AI Neural Engine v2.5
      </div>
    </div>
  );
};

export default LiveOverlay;
