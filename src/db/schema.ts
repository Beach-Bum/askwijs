import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  serial,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Users ──────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  authId: varchar("auth_id", { length: 255 }).unique().notNull(), // Supabase Auth UUID
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  language: varchar("language", { length: 5 }).default("en").notNull(),
  companyName: varchar("company_name", { length: 255 }),
  kvkNumber: varchar("kvk_number", { length: 20 }),
  btwId: varchar("btw_id", { length: 30 }),
  iban: varchar("iban", { length: 34 }),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default("trial"),
  bankConnectionId: varchar("bank_connection_id", { length: 255 }), // Nordigen/GoCardless requisition ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Transactions ───────────────────────────────────────────────────

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    externalId: varchar("external_id", { length: 255 }), // PSD2 transaction ID
    date: timestamp("date").notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
    counterpartyName: varchar("counterparty_name", { length: 255 }),
    counterpartyIban: varchar("counterparty_iban", { length: 34 }),
    description: text("description"),
    category: varchar("category", { length: 100 }),
    btwRate: decimal("btw_rate", { precision: 5, scale: 2 }),
    btwAmount: decimal("btw_amount", { precision: 12, scale: 2 }),
    isBusiness: boolean("is_business").default(false),
    isDeductible: boolean("is_deductible").default(false),
    confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
    status: varchar("status", { length: 20 }).default("pending_review").notNull(),
    receiptId: uuid("receipt_id"),
    importSource: varchar("import_source", { length: 20 }).default("psd2"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_transactions_user_date").on(table.userId, table.date),
    index("idx_transactions_status").on(table.userId, table.status),
  ]
);

// ── Receipts ───────────────────────────────────────────────────────

export const receipts = pgTable("receipts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  imageUrl: text("image_url"),
  vendor: varchar("vendor", { length: 255 }),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  date: timestamp("date"),
  btwAmount: decimal("btw_amount", { precision: 12, scale: 2 }),
  btwRate: decimal("btw_rate", { precision: 5, scale: 2 }),
  category: varchar("category", { length: 100 }),
  source: varchar("source", { length: 20 }).default("upload"),
  transactionId: uuid("transaction_id"),
  extractedData: jsonb("extracted_data"), // AWS Textract output
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Invoices ───────────────────────────────────────────────────────

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    clientId: uuid("client_id").references(() => clients.id),
    items: jsonb("items").notNull(), // [{description, quantity, rate, btwRate}]
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
    btwAmount: decimal("btw_amount", { precision: 12, scale: 2 }).notNull(),
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
    clientName: varchar("client_name", { length: 255 }),
    clientEmail: varchar("client_email", { length: 255 }),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    issueDate: timestamp("issue_date").defaultNow().notNull(),
    dueDate: timestamp("due_date"),
    sentAt: timestamp("sent_at"),
    paidAt: timestamp("paid_at"),
    isRecurring: boolean("is_recurring").default(false),
    recurringInterval: varchar("recurring_interval", { length: 20 }),
    pdfUrl: text("pdf_url"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_invoices_user_status").on(table.userId, table.status),
  ]
);

// ── Clients ────────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  kvkNumber: varchar("kvk_number", { length: 20 }),
  btwId: varchar("btw_id", { length: 30 }),
  defaultPaymentTerms: integer("default_payment_terms").default(30),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── BTW Returns ────────────────────────────────────────────────────

export const btwReturns = pgTable("btw_returns", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  quarter: integer("quarter").notNull(),
  year: integer("year").notNull(),
  btwCollected: decimal("btw_collected", { precision: 12, scale: 2 }).default("0"),
  btwDeducted: decimal("btw_deducted", { precision: 12, scale: 2 }).default("0"),
  btwNet: decimal("btw_net", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).default("draft"),
  filedDate: timestamp("filed_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Counterparty Rules (learned from user corrections) ─────────

export const counterpartyRules = pgTable("counterparty_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  counterpartyPattern: varchar("counterparty_pattern", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  btwRate: decimal("btw_rate", { precision: 5, scale: 2 }),
  isBusiness: boolean("is_business").default(true),
  isDeductible: boolean("is_deductible").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Relations ──────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  receipts: many(receipts),
  invoices: many(invoices),
  clients: many(clients),
  btwReturns: many(btwReturns),
  counterpartyRules: many(counterpartyRules),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  invoices: many(invoices),
}));
