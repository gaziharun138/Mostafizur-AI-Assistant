
export enum AppMode {
  GENERAL = 'GENERAL',
  HEALTH = 'HEALTH',
  JOB = 'JOB',
  AGRICULTURE = 'AGRICULTURE'
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

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Transcription {
  text: string;
  isUser: boolean;
}
