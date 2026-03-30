'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 bg-[#0e0f11]">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="font-serif text-2xl mb-3">Check your email</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            We sent a confirmation link to{' '}
            <strong className="text-gray-200">{email}</strong>.
            Click it to activate your account.
          </p>
          <Link href="/login" className="mt-6 inline-block text-blue-400 text-sm hover:text-blue-300">
            Back to sign in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#0e0f11]">
      <div className="w-full max-w-sm">
        <Link href="/" className="block font-serif text-2xl text-blue-400 text-center mb-8">
          Routinely
        </Link>

        <div className="bg-[#161719] border border-white/8 rounded-2xl p-7">
          <h2 className="font-serif text-2xl mb-6">Create account</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { label: 'Name', type: 'text', val: name, set: setName, ph: 'Your name' },
              { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, ph: 'Min 8 characters' },
            ].map(({ label, type, val, set, ph }) => (
              <div key={label}>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-2">
                  {label}
                </label>
                <input
                  type={type} value={val}
                  onChange={e => set(e.target.value)} required
                  placeholder={ph}
                  className="w-full bg-[#1e1f23] border border-white/8 rounded-xl px-4 py-3 text-sm
                             text-gray-100 placeholder-gray-600 outline-none focus:border-white/20
                             transition-colors"
                />
              </div>
            ))}
            {error && <p className="text-red-400 text-xs bg-red-400/8 rounded-lg px-3 py-2">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold text-sm rounded-xl py-3
                         hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
