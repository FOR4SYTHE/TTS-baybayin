import { GoogleGenerativeAI } from '@google/generative-ai';

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("AI response was not valid JSON.");

    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    if (error.message?.includes('429') || error.status === 429) {
      return new Response(JSON.stringify({
        error: 'rate_limited',
        retryAfter: 60,
      }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      error: 'api_error',
      message: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}