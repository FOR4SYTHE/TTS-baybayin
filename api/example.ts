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
      return new Response(JSON.stringify({ error: "API key is missing" }), { status: 500 });
    }

    const prompt = `You are a friendly, conversational Tagalog language tutor for beginners.
Generate a COMPLETELY NEW, distinct, short, and practical conversational sentence in Tagalog that INCLUDES the provided Tagalog Translation ("${tagalogWord}").
If the input is a full phrase or sentence, ensure the new sentence provides good context for the translated meaning.
Do NOT repeat or parrot the user's original input sentence exactly, but YOU MUST INCLUDE the translated Tagalog word/phrase.
CRITICAL: Do NOT prepend or include meta-text like 'Ito ay isang halimbawa para sa:', 'Halimbawa:', or 'This is an example for:'. Go directly into the raw sentence content.

English Input: "${englishWord}"
Tagalog Translation: "${tagalogWord}"`;

    // Direct fetch to Gemini REST API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) throw new Error("Gemini API failed");
    
    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    return new Response(textResponse, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Example generation error:", error);
    // Fallback context to keep UI stable
    return new Response(JSON.stringify({
      tagalogSentence: `Halika at mag-aral tayo ng Tagalog.`,
      englishTranslation: `Come and let's study Tagalog.`
    }), { 
      status: 200, headers: { 'Content-Type': 'application/json' } 
    });
  }
}