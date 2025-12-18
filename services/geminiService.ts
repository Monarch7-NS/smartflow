import { GoogleGenAI, Content, Part } from "@google/genai";
import { ChatMessage } from "../types";

const getSystemInstruction = (lang: 'en' | 'fr') => `
You are IWI (Intelligent Waiting Interface), the AI assistant for Clinique Générale d'Annecy. 
Your goal is to help patients like Sophie reduce anxiety by providing clear, empathetic, and precise answers.
You have access to general clinic knowledge.
Tone: Professional, calm, reassuring, and concise (mobile-first).
Current User Language: ${lang === 'fr' ? 'French (Français)' : 'English'}. YOU MUST REPLY IN THIS LANGUAGE.

Context:
- The patient is currently at the clinic.
- They might ask about administrative papers, insurance (mutuelle), wait times, or directions.
- If asked about "Dr. Martin", he is an Orthopedic Surgeon.
- If asked about insurance, confirmed that "Mutuelle" is accepted and direct billing is enabled.
- If asked about anesthesia documents, list: "Pre-anesthesia questionnaire and recent blood work results."

Keep responses short (under 50 words usually) as they are reading on a phone.
`;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string,
  language: 'en' | 'fr' = 'en'
): Promise<string> => {
  try {
    const recentHistory = history.slice(-10);
    
    const formattedHistory: Content[] = recentHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text } as Part]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(language),
      },
      history: formattedHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || (language === 'fr' ? "Je n'ai pas compris, pouvez-vous reformuler ?" : "I apologize, I didn't catch that. Could you rephrase?");
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'fr' 
      ? "J'ai des difficultés à me connecter au réseau de la clinique. Veuillez réessayer." 
      : "I'm having trouble connecting to the clinic network right now. Please try again in a moment.";
  }
};