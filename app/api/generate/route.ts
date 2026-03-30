import { NextRequest, NextResponse } from 'next/server';
import { generateRoutine } from '@/lib/gemini/generateRoutine';
import { generateRequestSchema } from '@/lib/validations/routine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = generateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const routine = await generateRoutine(parsed.data);
    return NextResponse.json(routine);

  } catch (error: any) {
    console.error('Gemini generate error:', error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit reached. Gemini free tier: 15 requests/min. Please wait 60 seconds.' },
        { status: 429 }
      );
    }
    if (error?.status === 403 || error?.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'Daily quota reached. Gemini free tier: 1,500 requests/day. Try again tomorrow.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate routine. Please try again.' },
      { status: 500 }
    );
  }
}
