'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneratorForm } from '@/components/routine/GeneratorForm';
import { RoutineEditor } from '@/components/routine/RoutineEditor';
import { GenerateRoutineOutput, Occupation, ScheduleBlock } from '@/types';
import { useSaveRoutine } from '@/hooks/useRoutines';

type Step = 'form' | 'result';

export default function NewRoutinePage() {
  const router = useRouter();
  const [step, setStep]         = useState<Step>('form');
  const [routine, setRoutine]   = useState<GenerateRoutineOutput | null>(null);
  const [blocks, setBlocks]     = useState<ScheduleBlock[]>([]);
  const [goalInput, setGoalInput] = useState<{
    occupation: Occupation; goal_text: string; goal_tags: string[];
  } | null>(null);
  const [saved, setSaved] = useState(false);

  const saveRoutine = useSaveRoutine();

  const handleGenerated = (
    result: GenerateRoutineOutput,
    input: { occupation: Occupation; goal_text: string; goal_tags: string[] }
  ) => {
    setRoutine(result);
    setBlocks(result.blocks.map((b, i) => ({ ...b, sort_order: i })));
    setGoalInput(input);
    setStep('result');
  };

  const handleSave = async () => {
    if (!routine || !goalInput) return;
    await saveRoutine.mutateAsync({
      title: routine.title,
      description: routine.description,
      goal: goalInput,
      blocks: blocks.map((b, i) => ({ ...b, sort_order: i })),
    });
    setSaved(true);
    setTimeout(() => router.push('/dashboard'), 1200);
  };

  if (step === 'result' && routine) {
    return (
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl mb-1.5">{routine.title}</h1>
            <p className="text-gray-400 text-sm">{routine.description}</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => { setStep('form'); setRoutine(null); }}
              className="px-4 py-2.5 border border-white/10 rounded-xl text-sm text-gray-400
                         hover:text-gray-200 hover:border-white/20 transition-all"
            >
              ← Regenerate
            </button>
            <button
              onClick={handleSave}
              disabled={saveRoutine.isPending || saved}
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl
                         hover:bg-blue-500 transition-colors disabled:opacity-60"
            >
              {saved ? '✓ Saved!' : saveRoutine.isPending ? 'Saving...' : 'Save routine'}
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

  return <GeneratorForm onGenerated={handleGenerated} />;
}
