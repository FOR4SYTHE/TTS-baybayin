import { GoogleGenAI, ThinkingLevel } from '@google/genai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const { word, direction = "en-tl", image, mode } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "missing_key" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. SUPREME LENS VISION PIPELINE
    if (image && mode) {
      let promptText = "";
      if (mode === 'EN') promptText = "Extract the text in this image and translate it to English. Give a brief, cool description. CRITICAL: DO NOT use markdown, asterisks, or bullet points. Format as clean, readable plain text.";
      if (mode === 'TL') promptText = "Extract the text in this image and translate it to Tagalog. Give a brief description in Tagalog. CRITICAL: DO NOT use markdown, asterisks, or bullet points. Format as clean, readable plain text.";
      if (mode === 'BAY') promptText = "Extract the text in this image and translate it into simple, Romanized Tagalog words (standard alphabet, no special characters). Do not describe it, just give the literal Tagalog words.";

      const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { text: promptText },
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
        ],
        config: {
          // Keeps 3.5 Flash's quality for image extraction but trims
          // the reasoning effort to cut latency on this call.
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });

      let text = response.text ?? '';
      text = text.replace(/[*#]/g, '');

      return new Response(JSON.stringify({ translation: text.trim() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. TEXT TRANSLATOR PIPELINE
    else if (word) {
      const sourceLang = direction === "tl-en" ? "Tagalog" : "English";
      const targetLang = direction === "tl-en" ? "English" : "Tagalog";
      const prompt = `You are an expert translator. Translate the following ${sourceLang} text to ${targetLang}. Only return the direct translation. Do not include any explanations, quotes, or markdown.\nText to translate: ${word}`;

      // Plain word/sentence translation — Flash-Lite is fast enough
      // and accurate enough for this, no reasoning overhead needed.
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt
      });

      let text = response.text ?? '';
      text = text.replace(/[*#]/g, '');

      return new Response(JSON.stringify({ translation: text.trim() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

  } catch (error: any) {
    console.error("Endpoint error:", error);

    if (error.message?.includes('429') || error.status === 429) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: 60 }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}