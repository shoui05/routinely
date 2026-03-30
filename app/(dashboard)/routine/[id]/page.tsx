'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RoutineEditor } from '@/components/routine/RoutineEditor';
import { ScheduleBlock } from '@/types';
import { useUpdateRoutine, useDeleteRoutine } from '@/hooks/useRoutines';

export default function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [routine, setRoutine] = useState<any>(null);
  const [blocks, setBlocks]   = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved]     = useState(false);

  const updateRoutine = useUpdateRoutine();
  const deleteRoutine = useDeleteRoutine();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('routines')
      .select('*, goals(*), schedule_blocks(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setRoutine(data);
          setBlocks(
            [...(data.schedule_blocks || [])].sort(
              (a: any, b: any) => a.sort_order - b.sort_order
            )
          );
        }
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    await updateRoutine.mutateAsync({
      id,
      title: routine.title,
      description: routine.description,
      blocks: blocks.map((b, i) => ({ ...b, sort_order: i })),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this routine? This cannot be undone.')) return;
    await deleteRoutine.mutateAsync(id);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Routine not found.</p>
        <button onClick={() => router.push('/dashboard')}
          className="text-blue-400 text-sm hover:underline">
          ← Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl mb-1.5">{routine.title}</h1>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {routine.goals?.occupation && (
              <span className="bg-white/5 rounded-md px-2 py-1">{routine.goals.occupation}</span>
            )}
            <span>
              {new Date(routine.created_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 border border-white/10 rounded-xl text-sm text-gray-500
                       hover:text-red-400 hover:border-red-400/30 transition-all"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={updateRoutine.isPending}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl
                       hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {saved ? '✓ Saved!' : updateRoutine.isPending ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-4 flex items-center gap-2">
        <span>⠿</span> Drag blocks to reorder · click ✎ to edit any block
      </p>

      <RoutineEditor blocks={blocks} onChange={setBlocks} />
    </div>
  );
}
