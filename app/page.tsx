import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-5 py-16 overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-purple-400/8 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-400 tracking-widest uppercase mb-8">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-400" />
          Powered by Gemini AI
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-7xl leading-[1.08] mb-5">
          Your day,{' '}
          <em className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            intelligently
          </em>{' '}
          structured.
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
          Tell us who you are and what you&apos;re working toward — Gemini AI will
          build a daily routine that actually fits your life.
        </p>

        <Link
          href="/login"
          className="bg-blue-600 text-white font-semibold text-base rounded-full px-9 py-4
                     hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
        >
          Get started free →
        </Link>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-12">
          {[
            'Gemini free tier',
            'AI-generated schedule',
            'Drag to reorder',
            'Save unlimited routines',
          ].map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 bg-neutral-900 border border-white/8
                         rounded-lg px-4 py-2 text-xs text-gray-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
