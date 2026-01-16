
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Attachment, Message } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private prepareContents(message: string, history: Message[] = [], attachment?: Attachment): any[] {
    const contents: any[] = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: m.attachment 
        ? [{ inlineData: { data: m.attachment.data, mimeType: m.attachment.mimeType } }, { text: m.content }]
        : [{ text: m.content }]
    }));

    const currentParts: Part[] = [];
    if (attachment) {
      currentParts.push({
        inlineData: {
          data: attachment.data,
          mimeType: attachment.mimeType
        }
      });
    }
    currentParts.push({ text: message });

    contents.push({
      role: 'user',
      parts: currentParts
    });

    return contents;
  }

  async *sendMessageStream(
    message: string, 
    lang: string, 
    history: Message[] = [], 
    attachment?: Attachment,
    mode?: string
  ) {
    const modelName = 'gemini-3-flash-preview';
    const contents = this.prepareContents(message, history, attachment);

    try {
      const result = await this.ai.models.generateContentStream({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION(lang, mode),
          temperature: 0.7,
        }
      });

      for await (const chunk of result) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      throw error;
    }
  }

  async sendMessage(
    message: string, 
    lang: string, 
    history: Message[] = [], 
    attachment?: Attachment,
    mode?: string
  ): Promise<string> {
    const modelName = 'gemini-3-flash-preview';
    const contents = this.prepareContents(message, history, attachment);

    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION(lang, mode),
        }
      });

      return response.text || (lang === 'bn' ? "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।" : "Sorry, I cannot answer right now.");
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
