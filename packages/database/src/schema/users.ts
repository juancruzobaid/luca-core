import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { persons } from './persons'
import { entities } from './entities'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  personId: text('person_id').references(() => persons.id), // nullable
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  lastLoginAt: text('last_login_at'),
})

export const roleEnum = ['owner', 'bookkeeper', 'advisor'] as const
export type Role = typeof roleEnum[number]

export const userRoles = sqliteTable('user_roles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  entityId: text('entity_id').notNull().references(() => entities.id),
  role: text('role', { enum: roleEnum }).notNull(),
  createdAt: text('created_at').notNull(),
  createdBy: text('created_by').references(() => users.id),
})

// Auth: magic link sessions
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: integer('expires_at').notNull(), // Unix timestamp
  createdAt: text('created_at').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  lastUsedAt: text('last_used_at'),
})

export const magicLinks = sqliteTable('magic_links', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at').notNull(), // Unix timestamp
  usedAt: text('used_at'),
  createdAt: text('created_at').notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserRole = typeof userRoles.$inferSelect
export type NewUserRole = typeof userRoles.$inferInsert
export type Session = typeof sessions.$inferSelect
export type MagicLink = typeof magicLinks.$inferSelect
