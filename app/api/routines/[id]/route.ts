import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH /api/routines/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, description, blocks } = body;

  // Verify ownership
  const { data: existing } = await supabase
    .from('routines').select('user_id').eq('id', params.id).single();
  if (!existing || existing.user_id !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Update routine metadata
  const { error: routineError } = await supabase
    .from('routines')
    .update({ title, description, updated_at: new Date().toISOString() })
    .eq('id', params.id);
  if (routineError) return NextResponse.json({ error: routineError.message }, { status: 500 });

  // Replace blocks
  if (blocks) {
    await supabase.from('schedule_blocks').delete().eq('routine_id', params.id);
    await supabase.from('schedule_blocks').insert(
      blocks.map((b: any) => ({ ...b, routine_id: params.id }))
    );
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/routines/[id] — soft delete
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('routines')
    .update({ is_active: false })
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
