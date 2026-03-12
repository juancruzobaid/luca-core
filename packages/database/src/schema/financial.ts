import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { entities } from './entities'

export const periodStatusEnum = ['draft', 'approved'] as const
export type PeriodStatus = typeof periodStatusEnum[number]

export const financialPeriods = sqliteTable('financial_periods', {
  id: text('id').primaryKey(),
  entityId: text('entity_id').notNull().references(() => entities.id),
  year: integer('year').notNull(),
  month: integer('month').notNull(), // 1-12
  status: text('status', { enum: periodStatusEnum }).notNull().default('draft'),
  currency: text('currency').notNull().default('USD'),
  // Exchange rate to USD at period close (for multi-currency consolidation)
  exchangeRateToUsd: text('exchange_rate_to_usd').notNull().default('1'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  approvedAt: text('approved_at'),
  approvedBy: text('approved_by'),
})

// All monetary values stored as integers (cents / smallest currency unit)
// e.g. $1,234.56 USD = 123456
export const incomeStatements = sqliteTable('income_statements', {
  id: text('id').primaryKey(),
  periodId: text('period_id').notNull().references(() => financialPeriods.id).unique(),
  // Revenue
  revenue: integer('revenue').notNull().default(0),
  // Cost of Goods Sold
  cogs: integer('cogs').notNull().default(0),
  // Gross Profit = revenue - cogs (computed, stored for performance)
  grossProfit: integer('gross_profit').notNull().default(0),
  // Operating Expenses
  operatingExpenses: integer('operating_expenses').notNull().default(0),
  // EBITDA
  ebitda: integer('ebitda').notNull().default(0),
  // Net Income
  netIncome: integer('net_income').notNull().default(0),
  // Extra line items as JSON: [{ label: string, amount: integer, order: number }]
  extraLines: text('extra_lines', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const balanceSheets = sqliteTable('balance_sheets', {
  id: text('id').primaryKey(),
  periodId: text('period_id').notNull().references(() => financialPeriods.id).unique(),
  totalAssets: integer('total_assets').notNull().default(0),
  totalLiabilities: integer('total_liabilities').notNull().default(0),
  // Equity = totalAssets - totalLiabilities (computed, stored for performance)
  equity: integer('equity').notNull().default(0),
  // Extra line items as JSON: [{ label: string, amount: integer, category: 'asset'|'liability', order: number }]
  extraLines: text('extra_lines', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export type FinancialPeriod = typeof financialPeriods.$inferSelect
export type NewFinancialPeriod = typeof financialPeriods.$inferInsert
export type IncomeStatement = typeof incomeStatements.$inferSelect
export type NewIncomeStatement = typeof incomeStatements.$inferInsert
export type BalanceSheet = typeof balanceSheets.$inferSelect
export type NewBalanceSheet = typeof balanceSheets.$inferInsert
