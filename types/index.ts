export type Occupation =
  | 'Student'
  | 'Freelancer'
  | 'Professional'
  | 'Entrepreneur'
  | 'Remote Worker'
  | 'Creator';

export type BlockCategory =
  | 'focus'
  | 'health'
  | 'break'
  | 'learning'
  | 'personal'
  | 'general';

export interface ScheduleBlock {
  id?: string;
  routine_id?: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  sort_order: number;
  category: BlockCategory;
}

export interface Goal {
  id?: string;
  user_id?: string;
  occupation: Occupation;
  goal_text: string;
  goal_tags: string[];
  created_at?: string;
}

export interface Routine {
  id?: string;
  user_id?: string;
  goal_id?: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  schedule_blocks?: ScheduleBlock[];
  goals?: Goal;
}

export interface GenerateRoutineInput {
  occupation: Occupation;
  goal_text: string;
  goal_tags: string[];
  wake_time: string;
  sleep_time: string;
}

export interface GenerateRoutineOutput {
  title: string;
  description: string;
  blocks: Omit<ScheduleBlock, 'id' | 'routine_id' | 'sort_order'>[];
}
