import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const rateLimitCounters = sqliteTable('rate_limit_counters', {
  id: text('id').primaryKey(),
  key: text('key').notNull(),
  count: integer('count').notNull().default(1),
  windowStart: text('window_start').notNull(),
  createdAt: text('created_at').notNull(),
})
