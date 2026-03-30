'use client';
import { useState } from 'react';
import { GenerateRoutineOutput, Occupation } from '@/types';

const OCCUPATIONS: { value: Occupation; emoji: string }[] = [
  { value: 'Student',       emoji: '📚' },
  { value: 'Freelancer',    emoji: '💻' },
  { value: 'Professional',  emoji: '💼' },
  { value: 'Entrepreneur',  emoji: '🚀' },
  { value: 'Remote Worker', emoji: '🏠' },
  { value: 'Creator',       emoji: '🎨' },
];

const GOAL_TAGS = [
  'Exam preparation', 'Deep work & focus', 'Fitness & health',
  'Learning new skills', 'Work-life balance', 'Side project',
  'Morning routine', 'Stress reduction',
];

const LOADING_MSGS = [
  'Gemini is crafting your routine...',
  'Analyzing your goals and schedule...',
  'Building your daily blocks...',
  'Almost ready...',
];

interface Props {
  onGenerated: (
    routine: GenerateRoutineOutput,
    input: { occupation: Occupation; goal_text: string; goal_tags: string[] }
  ) => void;
}

export function GeneratorForm({ onGenerated }: Props) {
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [tags, setTags]             = useState<string[]>([]);
  const [goalText, setGoalText]     = useState('');
  const [wakeTime, setWakeTime]     = useState('06:00');
  const [sleepTime, setSleepTime]   = useState('23:00');
  const [loading, setLoading]       = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0]);
  const [error, setError]           = useState('');

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleGenerate = async () => {
    if (!occupation) { setError('Please select your occupation first.'); return; }
    setError('');
    setLoading(true);

    let mi = 0;
    const timer = setInterval(() => {
      mi = (mi + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[mi]);
    }, 2500);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occupation, goal_text: goalText,
          goal_tags: tags, wake_time: wakeTime, sleep_time: sleepTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) throw new Error('Rate limit reached. Please wait ~60 seconds. (Gemini free: 15 req/min)');
        if (res.status === 403) throw new Error('Daily quota reached. Gemini free tier allows 1,500 requests/day.');
        throw new Error(data.error || 'Generation failed. Please try again.');
      }

      onGenerated(data, { occupation, goal_text: goalText, goal_tags: tags });
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      clearInterval(timer);
      setLoadingMsg(LOADING_MSGS[0]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-9 h-9 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-gray-400 text-sm">{loadingMsg}</p>
          <p className="text-gray-600 text-xs mt-1">Usually takes 5–10 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-7">
        <h2 className="font-serif text-3xl mb-2">Build your routine</h2>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-400" />
          <p className="text-gray-400 text-sm">Powered by Gemini 1.5 Flash (free tier)</p>
        </div>
      </div>

      {/* Occupation */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Your occupation
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {OCCUPATIONS.map(({ value, emoji }) => (
            <button key={value} onClick={() => setOccupation(value)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm
                          font-medium transition-all
                ${occupation === value
                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                  : 'border-white/8 bg-[#161719] text-gray-400 hover:border-white/15'
                }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-xs">{value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Goal Tags */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Primary goals
        </label>
        <div className="flex flex-wrap gap-2">
          {GOAL_TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full border text-xs transition-all
                ${tags.includes(tag)
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                  : 'border-white/8 text-gray-400 hover:text-gray-200 hover:border-white/15'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <textarea
          value={goalText} onChange={e => setGoalText(e.target.value)}
          placeholder="Describe your goals in your own words (optional)..."
          rows={2}
          className="mt-3 w-full bg-[#161719] border border-white/8 rounded-xl px-4 py-3
                     text-sm text-gray-100 placeholder-gray-500 outline-none
                     focus:border-white/15 resize-none transition-colors"
        />
      </div>

      {/* Sleep Schedule */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Sleep schedule
        </label>
        <div className="flex flex-wrap gap-5 items-center text-sm text-gray-400">
          <label className="flex items-center gap-2">
            Wake up
            <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)}
              className="bg-[#161719] border border-white/8 rounded-lg px-3 py-2
                         text-gray-100 outline-none transition-colors" />
          </label>
          <label className="flex items-center gap-2">
            Sleep
            <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)}
              className="bg-[#161719] border border-white/8 rounded-lg px-3 py-2
                         text-gray-100 outline-none transition-colors" />
          </label>
        </div>
      </div>

      {/* Gemini info */}
      <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/15
                      rounded-xl p-4 mb-5">
        <span className="text-base mt-0.5">ℹ️</span>
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-200">Gemini free tier:</strong> 15 requests/min ·
          1,500 requests/day · No credit card needed. Get your API key at{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank"
            className="text-blue-400 hover:underline">
            aistudio.google.com
          </a>
        </p>
      </div>

      {error && (
        <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4 mb-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 text-white font-semibold text-sm rounded-xl py-4
                   hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/15"
      >
        ✦ Generate with Gemini
      </button>
    </div>
  );
}
