import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { entities } from './entities'
import { users } from './users'

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  entityId: text('entity_id').notNull().references(() => entities.id),
  name: text('name').notNull(),
  // R2 object key
  storageKey: text('storage_key').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  uploadedBy: text('uploaded_by').references(() => users.id),
  createdAt: text('created_at').notNull(),
})

export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
