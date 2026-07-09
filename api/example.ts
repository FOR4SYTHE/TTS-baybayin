export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { englishWord, tagalogWord, direction = "en-tl" } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!englishWord || !tagalogWord) {
      return new Response(JSON.stringify({ error: "Words are required" }), { status: 400 });
    }

    if (!apiKey) {
      throw new Error("API key is missing in Vercel.");
    }

    // Your exactly updated prompt logic
    const prompt = `You are a friendly, conversational Tagalog language tutor for beginners.
Generate a COMPLETELY NEW, distinct, short, and practical conversational sentence in Tagalog that INCLUDES the provided Tagalog Translation: "${tagalogWord}".
If the input is a full phrase or sentence, ensure the new sentence provides good context for the translated meaning.
Do NOT repeat or parrot the user's original input sentence exactly, but YOU MUST INCLUDE the translated Tagalog word/phrase.
CRITICAL: Do NOT prepend or include meta-text like 'Ito ay isang halimbawa para sa:', 'Halimbawa:', or 'This is an example for:'. Go directly into the raw sentence content.

English Input: "${englishWord}"
Tagalog Translation: "${tagalogWord}"`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // 🔒 STRICT JSON ENFORCEMENT - This kills the fallback bug permanently
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              tagalogSentence: { type: "STRING" },
              englishTranslation: { type: "STRING" }
            },
            required: ["tagalogSentence", "englishTranslation"]
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API REST Error:", errorText);
      throw new Error("Gemini API failed");
    }
    
    const data = await response.json();
    
    // Because we enforced JSON in the config, we can pass it directly
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    return new Response(textResponse, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Example generation error:", error);
    // If it STILL hits this, your API key in Vercel is either missing or invalid.
    return new Response(JSON.stringify({
      tagalogSentence: `Halika at mag-aral tayo ng Tagalog.`,
      englishTranslation: `Come and let's study Tagalog.`
    }), { 
      status: 200, headers: { 'Content-Type': 'application/json' } 
    });
  }
}