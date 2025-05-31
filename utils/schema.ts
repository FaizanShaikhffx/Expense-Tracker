import { integer, pgTable, numeric, serial, varchar } from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
  id: serial('id').primaryKey(), 
  name: varchar("name").notNull(),
  amount: numeric('amount', { mode: "number" }).notNull(), 
  icon: varchar('icon'),
  createdBy: varchar('createdBy').notNull()
});

export const Expenses = pgTable('expenses', {
  id: serial('id').primaryKey(), 
  name: varchar("name").notNull(),
  amount: numeric('amount', { mode: "number" }).notNull(), 
  budgetId: integer('budgetId').references(() => Budgets.id),
  createdAt: varchar('createdAt').notNull() 
});
