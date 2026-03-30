import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: routines } = await supabase
    .from('routines')
    .select('*, goals(*), schedule_blocks(*)')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-1">Saved routines</h1>
          <p className="text-gray-500 text-sm">
            {routines?.length ?? 0} routine{routines?.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Link
          href="/routine/new"
          className="bg-blue-600 text-white font-semibold text-sm rounded-xl px-5 py-2.5
                     hover:bg-blue-500 transition-colors"
        >
          + New routine
        </Link>
      </div>

      {!routines || routines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-5 opacity-30">📋</div>
          <p className="text-gray-400 text-base mb-6">No saved routines yet.</p>
          <Link
            href="/routine/new"
            className="bg-blue-600 text-white font-semibold text-sm rounded-xl px-6 py-3
                       hover:bg-blue-500 transition-colors"
          >
            Generate your first routine →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {routines.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/routine/${r.id}`}
              className="group relative bg-[#161719] border border-white/8 rounded-2xl p-5
                         hover:border-white/15 transition-all hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-400" />

              <h3 className="font-semibold text-base mb-1.5 group-hover:text-blue-400 transition-colors">
                {r.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {r.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {r.goals?.occupation && (
                  <span className="bg-white/5 rounded-md px-2 py-1">{r.goals.occupation}</span>
                )}
                <span>{r.schedule_blocks?.length ?? 0} blocks</span>
                <span>
                  {new Date(r.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric',
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
