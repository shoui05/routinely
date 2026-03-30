import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0f11]">
      {/* Topbar */}
      <header className="h-14 border-b border-white/8 flex items-center justify-between
                         px-6 bg-[#0e0f11] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-xl text-blue-400">Routinely</Link>
          <span className="bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5
                           text-[10px] font-bold text-blue-400 tracking-widest uppercase">
            Gemini
          </span>
        </div>

        <nav className="flex items-center gap-1">
          <Link href="/routine/new"
            className="text-sm font-medium text-gray-400 hover:text-gray-100 px-3 py-1.5
                       rounded-lg hover:bg-white/5 transition-all">
            Generate
          </Link>
          <Link href="/dashboard"
            className="text-sm font-medium text-gray-400 hover:text-gray-100 px-3 py-1.5
                       rounded-lg hover:bg-white/5 transition-all">
            Saved
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:block truncate max-w-[180px]">
            {user.email}
          </span>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg
                         border border-white/8 hover:border-white/15 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
