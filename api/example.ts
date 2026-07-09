export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { englishWord, tagalogWord, direction = "en-tl" } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!englishWord || !tagalogWord) {
      return new Response(JSON.stringify({ error: "Words required" }), { status: 400 });
    }

    if (!apiKey) {
      // If this triggers, your Vercel Environment Variables are definitely not set up correctly.
      return new Response(JSON.stringify({
        tagalogSentence: "SYSTEM ERROR: API KEY MISSING",
        englishTranslation: "Vercel cannot see your GEMINI_API_KEY."
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Aggressive, foolproof prompt.
    const prompt = `You are a Tagalog tutor.
Write ONE short, conversational Tagalog sentence using the phrase: "${tagalogWord}".
Provide the English translation.

CRITICAL: Output ONLY a raw JSON object. NO markdown, NO code blocks, NO text outside the braces.
Format:
{"tagalogSentence": "...", "englishTranslation": "..."}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        tagalogSentence: `API REJECTED: ${response.status}`,
        englishTranslation: errorText.substring(0, 100)
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    const data = await response.json();
    let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // BEYOND PLUS ULTRA SANITIZATION: Force-extract JSON even if Gemini hallucinates markdown
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return a valid JSON object.");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.tagalogSentence || !parsed.englishTranslation) {
       throw new Error("Missing JSON keys");
    }

    // Flawless Execution Return
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    // If we hit this, the JSON parse completely failed.
    return new Response(JSON.stringify({
      tagalogSentence: `FATAL PARSE ERROR`,
      englishTranslation: error.message
    }), { 
      status: 200, headers: { 'Content-Type': 'application/json' } 
    });
  }
}