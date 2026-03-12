import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const persons = sqliteTable('persons', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  taxId: text('tax_id'),
  country: text('country').notNull().default('US'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export type Person = typeof persons.$inferSelect
export type NewPerson = typeof persons.$inferInsert
