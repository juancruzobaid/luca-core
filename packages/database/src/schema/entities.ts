import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const entityTypeEnum = ['LLC', 'S-Corp', 'C-Corp', 'holding', 'other'] as const
export type EntityType = typeof entityTypeEnum[number]

export const currencyEnum = ['USD', 'EUR', 'GBP', 'CAD'] as const
export type Currency = typeof currencyEnum[number]

export const entities = sqliteTable('entities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: entityTypeEnum }).notNull().default('LLC'),
  state: text('state'),            // US state (e.g. 'DE', 'WY')
  ein: text('ein'),                // Employer Identification Number
  currency: text('currency', { enum: currencyEnum }).notNull().default('USD'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export type Entity = typeof entities.$inferSelect
export type NewEntity = typeof entities.$inferInsert
