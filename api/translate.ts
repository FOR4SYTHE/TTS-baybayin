import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const { word: text, direction = "en-tl", image, mode } = body;

    // Lens Image processing route
    if (image && mode) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "missing_key" }), {
          status: 500, headers: { 'Content-Type': 'application/json' }
        });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

      let promptObj = "";
      if (mode === 'EN') promptObj = "Extract the text in this image and translate it to English. Give a brief, cool description. CRITICAL: DO NOT use markdown, asterisks, or bullet points. Format as clean, readable plain text.";
      if (mode === 'TL') promptObj = "Extract the text in this image and translate it to Tagalog. Give a brief description in Tagalog. CRITICAL: DO NOT use markdown, asterisks, or bullet points. Format as clean, readable plain text.";
      if (mode === 'BAY') promptObj = "Extract the text in this image and translate it into simple, Romanized Tagalog words (standard alphabet, no special characters). Do not describe it, just give the literal Tagalog words.";

      // Extract raw base64 data by stripping the data URL prefix explicitly
      const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

      let translatedText = "";
      try {
        const result = await model.generateContent([
          promptObj,
          { inlineData: { data: cleanBase64, mimeType: "image/jpeg" } }
        ]);
        translatedText = result.response.text();
      } catch (geminiError) {
        console.error("Gemini Vision API Error:", geminiError);
        throw geminiError;
      }

      return new Response(JSON.stringify({ translation: translatedText.trim() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Original Text translation route
    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const sourceLang = direction === "tl-en" ? "tl" : "en";
    const targetLang = direction === "tl-en" ? "en" : "tl";

    // Direct Google Translate API Fetch
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google API status: ${response.status}`);
    }

    const data = await response.json();
    let translatedText = "";

    if (Array.isArray(data) && Array.isArray(data[0])) {
      translatedText = data[0].map((slice: any) => slice[0]).join("");
    }

    return new Response(JSON.stringify({ translation: translatedText.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Translation error:", error);
    
    // Catch Google's rate limits and pass them to the frontend
    if (error.message?.includes('429') || error.status === 429) {
      return new Response(JSON.stringify({
        error: 'rate_limited',
        retryAfter: 60,
      }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: "Failed to translate" }), { 
      status: 500, headers: { 'Content-Type': 'application/json' } 
    });
  }
}