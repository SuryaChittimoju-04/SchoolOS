
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BrandingConfig, AspectRatio } from '../types';

// Ensure the API Key is available
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateCaption(
  schoolName: string,
  title: string,
  description: string,
  branding: BrandingConfig
) {
  const ai = getAI();
  const prompt = `Generate Instagram caption for:
School Name: ${schoolName}
Title: ${title}
Description: ${description}
Tone: ${branding.tone}

Include:
- Engaging opening line
- Short structured caption
- Call to action
- 8 relevant hashtags`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING },
          hashtags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cta: { type: Type.STRING }
        },
        required: ["caption", "hashtags", "cta"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function generateMarketingImage(
  title: string,
  description: string,
  branding: BrandingConfig,
  aspectRatio: AspectRatio,
  isEvent: boolean,
  base64Image?: string
) {
  const ai = getAI();
  
  const prompt = isEvent 
    ? base64Image 
      ? `This is a photo for a school event titled "${title}". 
         Enhance this photo for marketing. Apply a subtle gradient overlay in ${branding.primaryColor}. 
         Ensure the aesthetic is professional and academic. 
         Description for context: ${description}.`
      : `An event photo for a school titled "${title}". Description: ${description}. 
         Style: Professional academic photography, high quality. 
         Apply a subtle brand overlay using primary color ${branding.primaryColor}. 
         Leave a clean bottom strip for text: ${branding.footerText}.`
    : `A high-quality educational marketing poster for a school. 
       Title: "${title}". 
       Theme: ${description}. 
       Colors: Use ${branding.primaryColor} and ${branding.secondaryColor} as dominant themes. 
       Style: Minimalist, professional, clean layout with space for a school logo. 
       Format: Academic excellence.`;

  const contents: any = { parts: [{ text: prompt }] };
  
  if (base64Image) {
    // Strip the data:image/xxx;base64, prefix if it exists
    const cleanBase64 = base64Image.split(',')[1] || base64Image;
    contents.parts.unshift({
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/jpeg'
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: contents,
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Failed to generate image');
}
