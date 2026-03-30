import { z } from 'zod';

export const blockCategorySchema = z.enum([
  'focus', 'health', 'break', 'learning', 'personal', 'general',
]);

export const scheduleBlockSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(400),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM'),
  category: blockCategorySchema,
});

export const routineOutputSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(400),
  blocks: z.array(scheduleBlockSchema).min(1).max(20),
});

export const generateRequestSchema = z.object({
  occupation: z.enum([
    'Student', 'Freelancer', 'Professional',
    'Entrepreneur', 'Remote Worker', 'Creator',
  ]),
  goal_text: z.string().max(500).optional().default(''),
  goal_tags: z.array(z.string()).max(10).default([]),
  wake_time: z.string().regex(/^\d{2}:\d{2}$/),
  sleep_time: z.string().regex(/^\d{2}:\d{2}$/),
});

export const saveRoutineSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(400).optional(),
  goal: z.object({
    occupation: z.string(),
    goal_text: z.string(),
    goal_tags: z.array(z.string()),
  }),
  blocks: z.array(
    scheduleBlockSchema.extend({ sort_order: z.number() })
  ),
});
