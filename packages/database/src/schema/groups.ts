import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { entities } from './entities'

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const groupEntities = sqliteTable('group_entities', {
  id: text('id').primaryKey(),
  groupId: text('group_id').notNull().references(() => groups.id),
  entityId: text('entity_id').notNull().references(() => entities.id),
  createdAt: text('created_at').notNull(),
})

export type Group = typeof groups.$inferSelect
export type NewGroup = typeof groups.$inferInsert
export type GroupEntity = typeof groupEntities.$inferSelect
export type NewGroupEntity = typeof groupEntities.$inferInsert
