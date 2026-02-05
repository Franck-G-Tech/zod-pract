import {z} from 'zod';
import { Doc } from '../../convex/_generated/dataModel';

export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required')
  .min(3, 'Title must be at least 3 characters long')
  .max(50, 'Title must be at most 50 characters long'),
});

export type TodoFormData = z.infer<typeof todoSchema>;
export type Todo =Doc<"task">;