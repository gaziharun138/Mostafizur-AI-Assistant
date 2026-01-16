
export enum AppMode {
  GENERAL = 'GENERAL',
  HEALTH = 'HEALTH',
  JOB = 'JOB',
  AGRICULTURE = 'AGRICULTURE',
  MATH_9_10 = 'MATH_9_10',
  MATH_7 = 'MATH_7'
}

export type Language = 'bn' | 'en';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  age?: number;
  email?: string;
  photo?: string;
  isGuest: boolean;
}

export interface Attachment {
  data: string; // base64
  mimeType: string;
  name?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  attachment?: Attachment;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  mode?: AppMode;
}

export interface Transcription {
  text: string;
  isUser: boolean;
}
