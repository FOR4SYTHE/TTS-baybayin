export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { englishWord, tagalogWord } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Diagnostic Transmission Check
    if (!apiKey) {
      return new Response(JSON.stringify({
        tagalogSentence: "SYSTEM ERROR: API KEY MISSING",
        englishTranslation: "Vercel environment variable 'GEMINI_API_KEY' is not detected. Please verify your Vercel Project Settings > Environment Variables."
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (!englishWord || !tagalogWord) {
      return new Response(JSON.stringify({ 
        tagalogSentence: "Error", 
        englishTranslation: "Input words missing." 
      }), { status: 400 });
    }

    const prompt = `You are a Tagalog tutor. Write ONE short, conversational Tagalog sentence using the phrase: "${tagalogWord}". Provide the English translation.
    CRITICAL: Output ONLY a raw JSON object. NO markdown, NO code blocks.
    Format: {"tagalogSentence": "...", "englishTranslation": "..."}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        tagalogSentence: `API REJECTED: ${response.status}`,
        englishTranslation: JSON.stringify(responseData.error?.message || "Unknown API error")
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    let textResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("AI response was not valid JSON.");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      tagalogSentence: `FATAL PARSE ERROR`,
      englishTranslation: error.message
    }), { 
      status: 200, headers: { 'Content-Type': 'application/json' } 
    });
  }
}