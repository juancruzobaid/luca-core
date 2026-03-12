import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { persons } from './persons'
import { entities } from './entities'

export const memberships = sqliteTable('memberships', {
  id: text('id').primaryKey(),
  personId: text('person_id').notNull().references(() => persons.id),
  entityId: text('entity_id').notNull().references(() => entities.id),
  // Percentage stored as decimal: 50.25 = 50.25%
  // Using real (float) here is acceptable because this is display/reporting only,
  // never used in financial arithmetic directly
  percentage: real('percentage').notNull(),
  effectiveDate: text('effective_date').notNull(), // ISO 8601
  endDate: text('end_date'),                        // null = still active
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export type Membership = typeof memberships.$inferSelect
export type NewMembership = typeof memberships.$inferInsert
