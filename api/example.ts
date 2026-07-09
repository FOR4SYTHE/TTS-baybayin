export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { englishWord, tagalogWord } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'missing_key',
        message: "GEMINI_API_KEY not found in environment variables."
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if (!englishWord || !tagalogWord) {
      return new Response(JSON.stringify({
        error: 'missing_input',
        message: "Input words missing."
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const prompt = `You are a Tagalog tutor. Write ONE short, conversational Tagalog sentence using the phrase: "${tagalogWord}". Provide the English translation.
    CRITICAL: Output ONLY a raw JSON object. NO markdown, NO code blocks.
    Format: {"tagalogSentence": "...", "englishTranslation": "..."}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const responseData = await response.json();

    if (response.status === 429) {
      const rawMessage = responseData.error?.message || '';
      const retryMatch = rawMessage.match(/retry in (\d+(?:\.\d+)?)s/i);
      const retryAfter = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;

      return new Response(JSON.stringify({
        error: 'rate_limited',
        retryAfter,
      }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'api_error',
        message: responseData.error?.message || 'Unknown API error'
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const textResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("AI response was not valid JSON.");

    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      error: 'parse_error',
      message: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}