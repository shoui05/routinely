import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saveRoutineSchema } from '@/lib/validations/routine';

// GET /api/routines
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('routines')
    .select('*, schedule_blocks(*), goals(*)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/routines
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = saveRoutineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { title, description, goal, blocks } = parsed.data;

  // 1. Insert goal
  const { data: goalData, error: goalError } = await supabase
    .from('goals')
    .insert({ user_id: user.id, ...goal })
    .select().single();
  if (goalError) return NextResponse.json({ error: goalError.message }, { status: 500 });

  // 2. Insert routine
  const { data: routine, error: routineError } = await supabase
    .from('routines')
    .insert({ user_id: user.id, goal_id: goalData.id, title, description, is_active: true })
    .select().single();
  if (routineError) return NextResponse.json({ error: routineError.message }, { status: 500 });

  // 3. Insert blocks
  const { error: blocksError } = await supabase
    .from('schedule_blocks')
    .insert(blocks.map(b => ({ ...b, routine_id: routine.id })));
  if (blocksError) return NextResponse.json({ error: blocksError.message }, { status: 500 });

  return NextResponse.json({ ...routine, schedule_blocks: blocks }, { status: 201 });
}
