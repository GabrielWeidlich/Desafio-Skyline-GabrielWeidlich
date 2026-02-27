import { pgTable, text, timestamp, uuid, boolean, varchar } from 'drizzle-orm/pg-core';

export const priorityEnum = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  priority: varchar('priority', { enum: priorityEnum }).default('MEDIUM').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}
);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Priority = typeof priorityEnum[number];
