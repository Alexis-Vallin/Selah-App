
import { GoogleGenAI } from "@google/genai";
import { StruggleType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

interface ScriptureResponse {
  verseText: string;
  reference: string;
}

export const generateScriptureOfTheDay = async (struggles: StruggleType[] | string[]): Promise<ScriptureResponse> => {
  if (!process.env.API_KEY) {
    return {
      verseText: "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together...",
      reference: "Hebrews 10:24-25"
    };
  }

  try {
    const model = 'gemini-2.5-flash';
    const struggleText = Array.isArray(struggles) ? struggles.join(', ') : struggles;
    const prompt = `
      Select a comforting Bible verse for a Christian struggling with: "${struggleText}".
      Return ONLY the verse text and the reference in a JSON format like this:
      {"verseText": "The actual text...", "reference": "Book Chapter:Verse"}
      Use the NIV translation wording.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
        return JSON.parse(text) as ScriptureResponse;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      verseText: "Cast all your anxiety on Him because He cares for you.",
      reference: "1 Peter 5:7"
    };
  }
};
