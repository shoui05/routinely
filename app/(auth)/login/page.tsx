'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/dashboard');
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#0e0f11]">
      <div className="w-full max-w-sm">
        <Link href="/" className="block font-serif text-2xl text-blue-400 text-center mb-8">
          Routinely
        </Link>

        <div className="bg-[#161719] border border-white/8 rounded-2xl p-7">
          <h2 className="font-serif text-2xl mb-6">Sign in</h2>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-white/10
                       rounded-xl py-3 text-sm font-medium text-gray-200
                       hover:bg-white/5 transition-colors mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-2">
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full bg-[#1e1f23] border border-white/8 rounded-xl px-4 py-3 text-sm
                           text-gray-100 placeholder-gray-600 outline-none focus:border-white/20
                           transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-2">
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full bg-[#1e1f23] border border-white/8 rounded-xl px-4 py-3 text-sm
                           text-gray-100 placeholder-gray-600 outline-none focus:border-white/20
                           transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-xs bg-red-400/8 rounded-lg px-3 py-2">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold text-sm rounded-xl py-3
                         hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
