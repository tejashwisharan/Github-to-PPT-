import { GoogleGenAI, Type } from "@google/genai";
import { PresentationData, SlideType } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generatePitchDeck = async (repoName: string, readmeContent: string): Promise<PresentationData> => {
  const model = 'gemini-3-flash-preview';

  const prompt = `
    You are a world-class Venture Capital Analyst and Product Manager.
    Your task is to analyze the following GitHub repository README and create a compelling, professional Investor Pitch Deck.
    
    Repository Name: ${repoName}
    
    README Content:
    ${readmeContent.substring(0, 20000)} // Limit context if too large
    
    ---
    
    Create a JSON response representing the slide deck.
    The deck should strictly follow this structure:
    1. Title Slide (Project Name, Catchy Tagline)
    2. The Problem (What pain point does this solve?)
    3. The Solution (How does this repo solve it?)
    4. Market Opportunity (Who is this for? Why now?)
    5. Product / Tech (Key features, tech stack advantages)
    6. Business Model (How could this make money? or Open Source strategy)
    7. Competition (Why is this better?)
    8. Future Vision / Roadmap
    
    For each slide, provide:
    - type: One of [TITLE, PROBLEM, SOLUTION, MARKET, PRODUCT, BUSINESS_MODEL, COMPETITION, TEAM, TRACTION, VISION]
    - title: A punchy headline for the slide.
    - bullets: 3-5 concise, impactful bullet points.
    - speakerNotes: A short paragraph of what a presenter would say.
    - visualPrompt: A creative prompt to describe a background image or diagram that represents this slide concept abstractly (e.g., "A futuristic glowing network diagram", "A minimalist isometric server room").
    - highlight: A single key statistic or phrase to display prominently (optional).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: { type: Type.STRING },
            tagline: { type: Type.STRING },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: Object.values(SlideType) },
                  title: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  speakerNotes: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                  highlight: { type: Type.STRING },
                },
                required: ["type", "title", "bullets", "speakerNotes", "visualPrompt"],
              },
            },
          },
          required: ["projectName", "tagline", "slides"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as PresentationData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate pitch deck. Please try again.");
  }
};

export const generateSlideImage = async (prompt: string): Promise<string | null> => {
  // Use Gemini to generate an image for the slide background
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            { text: `Generate a high quality, professional, abstract business background image. Style: Modern, Minimalist, Tech, Corporate Memorable. Context: ${prompt}` }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    return null;
  } catch (e) {
    console.warn("Failed to generate image", e);
    return null;
  }
}