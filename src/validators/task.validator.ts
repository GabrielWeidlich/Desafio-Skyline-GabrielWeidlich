import { z } from 'zod';
import { priorityEnum } from '../db/schema/tasks';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  priority: z.enum(priorityEnum).default('MEDIUM'),
  dueDate: z.date().optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional().nullable(),
  completed: z.boolean().optional(),
  priority: z.enum(priorityEnum).optional(),
  dueDate: z.date().optional().nullable(),
});

export const taskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID format'),
});

export const queryTaskSchema = z.object({
  completed: z.enum(['true', 'false']).transform(Boolean).optional(),
  priority: z.enum(priorityEnum).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
  offset: z.string().transform(Number).pipe(z.number().min(0)).default('0'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdInput = z.infer<typeof taskIdSchema>;
export type QueryTaskInput = z.infer<typeof queryTaskSchema>;
