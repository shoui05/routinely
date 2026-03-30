'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Routine } from '@/types';

async function fetchRoutines(): Promise<Routine[]> {
  const res = await fetch('/api/routines');
  if (!res.ok) throw new Error('Failed to fetch routines');
  return res.json();
}

async function saveRoutine(data: any): Promise<Routine> {
  const res = await fetch('/api/routines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save routine');
  return res.json();
}

async function deleteRoutine(id: string): Promise<void> {
  const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete routine');
}

async function updateRoutine({ id, ...data }: any) {
  const res = await fetch(`/api/routines/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update routine');
  return res.json();
}

export function useRoutines() {
  return useQuery({ queryKey: ['routines'], queryFn: fetchRoutines });
}

export function useSaveRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveRoutine,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routines'] }),
  });
}

export function useDeleteRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteRoutine,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routines'] }),
  });
}

export function useUpdateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateRoutine,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routines'] }),
  });
}
