export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { word: text, direction = "en-tl" } = await req.json();
    
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

  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: "Failed to translate" }), { 
      status: 500, headers: { 'Content-Type': 'application/json' } 
    });
  }
}