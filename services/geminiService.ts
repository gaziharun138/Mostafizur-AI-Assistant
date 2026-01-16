
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;
  private currentLang: string = 'bn';

  constructor() {
    // Fix: Always use the process.env.API_KEY directly as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  initChat(lang: string = 'bn') {
    this.currentLang = lang;
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(lang),
      },
    });
  }

  async sendMessage(message: string, lang: string): Promise<string> {
    if (!this.chat || this.currentLang !== lang) this.initChat(lang);
    const result: GenerateContentResponse = await this.chat!.sendMessage({ message });
    return result.text || (lang === 'bn' ? "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।" : "Sorry, I cannot answer right now.");
  }

  async *sendMessageStream(message: string, lang: string) {
    if (!this.chat || this.currentLang !== lang) this.initChat(lang);
    const stream = await this.chat!.sendMessageStream({ message });
    for await (const chunk of stream) {
      const c = chunk as GenerateContentResponse;
      yield c.text;
    }
  }
}

export const geminiService = new GeminiService();
