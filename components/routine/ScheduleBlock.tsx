'use client';
import { BlockCategory, ScheduleBlock } from '@/types';

const CAT_STYLES: Record<BlockCategory, string> = {
  focus:    'bg-sky-400/10 text-sky-300',
  health:   'bg-emerald-400/10 text-emerald-300',
  break:    'bg-violet-400/10 text-violet-300',
  learning: 'bg-blue-400/10 text-blue-300',
  personal: 'bg-pink-400/10 text-pink-300',
  general:  'bg-white/5 text-gray-400',
};

function fmt(t: string) {
  if (!t) return '';
  const [hh, mm] = t.split(':');
  const h = parseInt(hh);
  return `${h % 12 || 12}:${mm} ${h >= 12 ? 'PM' : 'AM'}`;
}

interface Props {
  block: ScheduleBlock;
  isDragging?: boolean;
  onEdit?: () => void;
}

export function ScheduleBlockItem({ block, isDragging, onEdit }: Props) {
  return (
    <div className={`group flex items-start gap-4 p-4 rounded-xl border transition-all
      ${isDragging
        ? 'border-blue-500/50 bg-blue-500/5 opacity-40'
        : 'border-white/8 bg-[#161719] hover:border-white/15'
      }`}
    >
      <div className="text-xs text-gray-500 font-medium pt-0.5 whitespace-nowrap min-w-[88px]
                      font-variant-numeric tabular-nums">
        {fmt(block.start_time)}<br />{fmt(block.end_time)}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold
                          uppercase tracking-wider mb-1.5 ${CAT_STYLES[block.category]}`}>
          {block.category}
        </span>
        <div className="text-sm font-semibold mb-1 text-gray-100">{block.title}</div>
        <div className="text-xs text-gray-500 leading-relaxed">{block.description}</div>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-200
                     p-1.5 rounded-lg hover:bg-white/5 transition-all text-sm flex-shrink-0"
        >
          ✎
        </button>
      )}
    </div>
  );
}
