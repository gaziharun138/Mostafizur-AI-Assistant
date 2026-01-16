
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { SYSTEM_INSTRUCTION, TRANSLATIONS } from '../constants';
import { Language } from '../types';

// Helper functions for audio encoding/decoding
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

interface VoiceOverlayProps {
  onClose: () => void;
  lang: Language;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ onClose, lang }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const t = TRANSLATIONS[lang];
  
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  const cleanup = () => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    if (audioContextsRef.current) {
      audioContextsRef.current.input.close();
      audioContextsRef.current.output.close();
    }
  };

  useEffect(() => {
    const startSession = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextsRef.current = { input: inputCtx, output: outputCtx };

        // Fix: Use correct initialization as per guidelines
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
            systemInstruction: SYSTEM_INSTRUCTION(lang) + "\nYou are now in voice mode. Keep responses very short and spoken-style.",
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
                
                // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
              }
              if (message.serverContent?.turnComplete) {
                setTranscription('');
              }

              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio) {
                // Fix: Ensure smooth playback scheduling
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
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error('Voice Error:', e);
              setError(lang === 'bn' ? "সংযোগ বিচ্ছিন্ন হয়েছে। আবার চেষ্টা করুন।" : "Connection lost. Please try again.");
            },
            onclose: () => {
              setIsActive(false);
            }
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error(err);
        setError(lang === 'bn' ? "মাইক্রোফোন সংযোগে সমস্যা হয়েছে।" : "Microphone connection error.");
        setIsConnecting(false);
      }
    };

    startSession();
    return cleanup;
  }, [lang]);

  return (
    <div className="fixed inset-0 z-[120] bg-emerald-900/95 dark:bg-slate-950/95 flex flex-col items-center justify-center p-6 text-white backdrop-blur-md">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all shadow-lg"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col items-center space-y-12 w-full max-w-lg text-center">
        <div className="relative">
          <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-400/30 ${isActive ? 'animate-pulse' : ''}`}>
             <div className={`w-32 h-32 md:w-44 md:h-44 rounded-full bg-emerald-400 flex items-center justify-center shadow-2xl ${isActive ? 'scale-110' : ''} transition-transform duration-500`}>
                <svg className="w-16 h-16 md:w-24 md:h-24 text-emerald-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
             </div>
          </div>
          {isActive && (
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-56 h-56 md:w-72 md:h-72 border-2 border-emerald-400/20 rounded-full animate-ping"></div>
             </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {isConnecting ? t.connecting : t.listening}
          </h2>
          <p className="text-emerald-100/80 text-lg md:text-xl">
            {t.voiceHint}
          </p>
          
          {transcription && (
            <div className="bg-white/10 p-6 rounded-3xl text-xl italic border border-white/10 shadow-inner">
              "{transcription}"
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl text-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="w-full flex justify-center space-x-3">
           {[1,2,3,4,5].map(i => (
             <div key={i} className={`w-2 h-10 bg-emerald-400 rounded-full ${isActive ? 'animate-[bounce_1s_infinite]' : ''}`} style={{ animationDelay: `${i*0.2}s` }}></div>
           ))}
        </div>
      </div>
      
      <p className="mt-16 text-sm text-emerald-200/50">{lang === 'bn' ? 'সহজ কথা বলুন। আমি আপনার সাথে আছি।' : 'Speak naturally. I am here for you.'}</p>
    </div>
  );
};

export default VoiceOverlay;
