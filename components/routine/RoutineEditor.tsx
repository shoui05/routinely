'use client';
import { useState } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScheduleBlock, BlockCategory } from '@/types';
import { ScheduleBlockItem } from './ScheduleBlock';

// ── Sortable wrapper ──────────────────────────────────────────
function SortableBlock({
  block, onEdit,
}: { block: ScheduleBlock & { id: string }; onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2"
    >
      <button
        {...attributes} {...listeners}
        className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing
                   px-1 py-4 touch-none select-none"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="flex-1">
        <ScheduleBlockItem block={block} isDragging={isDragging} onEdit={onEdit} />
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────
function EditModal({
  block, onSave, onClose,
}: { block: ScheduleBlock; onSave: (b: ScheduleBlock) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...block });

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center
                    justify-center z-50 px-4">
      <div className="bg-[#161719] border border-white/12 rounded-2xl p-7
                      w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <h3 className="font-serif text-xl mb-5">Edit block</h3>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-2">
              Title
            </label>
            <input type="text" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-[#1e1f23] border border-white/8 rounded-xl px-4 py-3
                         text-sm text-gray-100 outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-2">
              Description
            </label>
            <input type="text" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full bg-[#1e1f23] border border-white/8 rounded-xl px-4 py-3
                         text-sm text-gray-100 outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-2">
              Time
            </label>
            <div className="flex gap-3">
              <input type="time" value={form.start_time}
                onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                className="flex-1 bg-[#1e1f23] border border-white/8 rounded-xl px-3 py-3
                           text-sm text-gray-100 outline-none"
              />
              <input type="time" value={form.end_time}
                onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                className="flex-1 bg-[#1e1f23] border border-white/8 rounded-xl px-3 py-3
                           text-sm text-gray-100 outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-2">
              Category
            </label>
            <select value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as BlockCategory }))}
              className="w-full bg-[#1e1f23] border border-white/8 rounded-xl px-4 py-3
                         text-sm text-gray-100 outline-none"
            >
              {['focus', 'health', 'break', 'learning', 'personal', 'general'].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose}
            className="px-5 py-2.5 border border-white/10 rounded-xl text-sm text-gray-400
                       hover:text-gray-200 hover:border-white/20 transition-colors">
            Cancel
          </button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm
                       hover:bg-blue-500 transition-colors">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Editor ───────────────────────────────────────────────
interface Props {
  blocks: ScheduleBlock[];
  onChange: (blocks: ScheduleBlock[]) => void;
}

export function RoutineEditor({ blocks, onChange }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const withIds = blocks.map((b, i) => ({ ...b, id: b.id || `block-${i}` }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIdx = withIds.findIndex(b => b.id === active.id);
    const newIdx = withIds.findIndex(b => b.id === over.id);
    onChange(arrayMove(blocks, oldIdx, newIdx).map((b, i) => ({ ...b, sort_order: i })));
  };

  const handleSave = (updated: ScheduleBlock) => {
    if (editingIndex === null) return;
    const next = [...blocks];
    next[editingIndex] = { ...updated, sort_order: editingIndex };
    onChange(next);
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={withIds.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {withIds.map((block, i) => (
              <SortableBlock key={block.id} block={block} onEdit={() => setEditingIndex(i)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingIndex !== null && (
        <EditModal
          block={blocks[editingIndex]}
          onSave={handleSave}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </>
  );
}
