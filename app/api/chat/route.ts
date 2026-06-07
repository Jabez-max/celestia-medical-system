import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `You are the AI Triage Assistant for Celestia Medical. 
    Your job is to read the patient's symptoms and recommend the specific hospital department or specialist they should book an appointment with (e.g., Cardiology, Dermatology, General Practice). 
    Be polite, empathetic, and concise. 
    IMPORTANT: Always include a short disclaimer at the end stating that you are an AI assistant and they should still consult a human doctor for an official diagnosis. Respond in Tagalog or Taglish if the user speaks in Tagalog.`,
    messages,
  });

  // Ginawa nating toTextStreamResponse() para tugma sa version mo
  return result.toTextStreamResponse();
}