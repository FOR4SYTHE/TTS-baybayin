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
      console.error("API key is missing in Vercel environment.");
      throw new Error("API key is missing");
    }

    // Highly optimized prompt to strictly enforce raw JSON output
    const prompt = `You are a friendly, conversational Tagalog language tutor for beginners.
Generate a COMPLETELY NEW, distinct, short, and practical conversational sentence in Tagalog that INCLUDES the provided Tagalog Translation: "${tagalogWord}".
If the input is a full phrase or sentence, ensure the new sentence provides good context for the translated meaning.
Do NOT repeat or parrot the user's original input sentence exactly, but YOU MUST INCLUDE the translated Tagalog word/phrase.

English Input: "${englishWord}"
Tagalog Translation: "${tagalogWord}"

CRITICAL INSTRUCTION: YOU MUST RESPOND WITH ONLY VALID RAW JSON. Do NOT wrap your response in markdown code blocks (\`\`\`json). Do NOT add conversational text.
Use exactly this format:
{
  "tagalogSentence": "Your natural conversational Tagalog sentence here",
  "englishTranslation": "The English translation of your Tagalog sentence"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API REST Error:", errorText);
      throw new Error("Gemini API failed");
    }
    
    const data = await response.json();
    let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // STRIPPER PROTOCOL: Remove any rogue markdown formatting Gemini might inject
    textResponse = textResponse.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // STRICT VALIDATION: Ensure it parses perfectly before sending to the UI
    const parsed = JSON.parse(textResponse);
    if (!parsed.tagalogSentence || !parsed.englishTranslation) {
       throw new Error("Gemini response missing required JSON fields");
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Example generation error:", error);
    // Safety fallback to keep UI stable
    return new Response(JSON.stringify({
      tagalogSentence: `Halika at mag-aral tayo ng Tagalog.`,
      englishTranslation: `Come and let's study Tagalog.`
    }), { 
      status: 200, headers: { 'Content-Type': 'application/json' } 
    });
  }
}