import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './users'

// IMMUTABLE — no updates or deletes allowed on this table
export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id), // nullable (system actions)
  action: text('action').notNull(), // e.g. 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'
  tableName: text('table_name').notNull(),
  recordId: text('record_id').notNull(),
  // JSON snapshots — null if not applicable
  oldValue: text('old_value', { mode: 'json' }),
  newValue: text('new_value', { mode: 'json' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: text('timestamp').notNull(), // ISO 8601
})

export type AuditLog = typeof auditLog.$inferSelect
export type NewAuditLog = typeof auditLog.$inferInsert
