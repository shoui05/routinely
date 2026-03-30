import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerateRoutineInput, GenerateRoutineOutput } from '@/types';
import { routineOutputSchema } from '@/lib/validations/routine';

// gemini-2.5-flash: FREE tier — 15 RPM, 1500 RPD, no credit card needed
const FREE_MODEL = 'gemini-2.5-flash';
const FREE_MODEL = 'gemini-2.5-flash-lite';



export async function generateRoutine(
  input: GenerateRoutineInput
): Promise<GenerateRoutineOutput> {
  const { occupation, goal_text, goal_tags, wake_time, sleep_time } = input;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: FREE_MODEL });

  const tags = goal_tags.length > 0 ? goal_tags.join(', ') : 'general productivity';

  const prompt = `You are an expert productivity coach. Generate a detailed daily routine for a ${occupation}.

Goals: ${tags}
${goal_text ? `Additional context: ${goal_text}` : ''}
Wake time: ${wake_time}
Sleep time: ${sleep_time}

CRITICAL: Return ONLY a valid JSON object. No markdown, no explanation, no code fences. Just raw JSON.

{
  "title": "A short catchy routine name specific to their situation",
  "description": "One sentence describing this routine",
  "blocks": [
    {
      "title": "Activity name",
      "description": "1-2 sentences: what to do and why it matters",
      "start_time": "HH:MM",
      "end_time": "HH:MM",
      "category": "focus"
    }
  ]
}

Rules:
- Create 10-14 blocks covering the full day from ${wake_time} to ${sleep_time}
- category must be one of: focus, health, break, learning, personal, general
- Times in 24hr HH:MM format, sequential, no overlaps
- Be specific and realistic for a ${occupation} focused on: ${tags}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip accidental markdown fences
  const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  // Extract JSON
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini did not return valid JSON');

  const parsed = JSON.parse(jsonMatch[0]);
  return routineOutputSchema.parse(parsed);
}
