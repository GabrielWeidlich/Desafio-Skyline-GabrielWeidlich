import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '../db';
import { tasks, NewTask, Task, Priority } from '../db/schema/tasks';
import { QueryTaskInput } from '../validators/task.validator';

export class TaskRepository {
  async create(taskData: NewTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(taskData).returning();
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || null;
  }

  async findAll(filters: QueryTaskInput): Promise<Task[]> {
    let query = db.select().from(tasks);
    
    const conditions = [];
    
    if (filters.completed !== undefined) {
      conditions.push(eq(tasks.completed, filters.completed));
    }
    
    if (filters.priority) {
      conditions.push(eq(tasks.priority, filters.priority));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query
      .orderBy(desc(tasks.createdAt))
      .limit(filters.limit)
      .offset(filters.offset);
  }

  async update(id: string, updateData: Partial<NewTask>): Promise<Task | null> {
    const [task] = await db
      .update(tasks)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    
    return task || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount > 0;
  }

  async count(filters: QueryTaskInput): Promise<number> {
    let query = db.select({ count: tasks.id }).from(tasks);
    
    const conditions = [];
    
    if (filters.completed !== undefined) {
      conditions.push(eq(tasks.completed, filters.completed));
    }
    
    if (filters.priority) {
      conditions.push(eq(tasks.priority, filters.priority));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const result = await query;
    return result.length;
  }
}
