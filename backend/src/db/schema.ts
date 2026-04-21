import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

/* =========================
   USERS
========================= */
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Supabase auth user id

  firstName: text('first_name'),
  lastName: text('last_name'),

  email: text('email').notNull().unique(),

  isActive: boolean('is_active').default(true).notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* =========================
   MAIL ACCOUNTS
========================= */
export const mailAccounts = pgTable(
  'mail_accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    provider: text('provider').notNull(), // gmail, zoho, outlook, custom
    protocol: text('protocol').default('imap').notNull(),

    email: text('email').notNull(),
    displayName: text('display_name'),

    host: text('host').notNull(),
    port: integer('port').notNull(),
    secure: boolean('secure').default(true).notNull(),

    encryptedPassword: text('encrypted_password').notNull(),

    isPrimary: boolean('is_primary').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),

    status: text('status').default('connected').notNull(), // connected, failed, expired

    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userEmailUnique: uniqueIndex('mail_accounts_user_email_unique').on(
      table.userId,
      table.email,
    ),
  }),
);

/* =========================
   MAIL FOLDERS
========================= */
export const mailFolders = pgTable(
  'mail_folders',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    accountId: uuid('account_id')
      .notNull()
      .references(() => mailAccounts.id, { onDelete: 'cascade' }),

    name: text('name').notNull(), // Inbox, Sent, Trash
    path: text('path').notNull(), // INBOX, [Gmail]/Sent Mail

    unreadCount: integer('unread_count').default(0).notNull(),
    totalCount: integer('total_count').default(0).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    accountPathUnique: uniqueIndex('mail_folders_account_path_unique').on(
      table.accountId,
      table.path,
    ),
  }),
);

/* =========================
   EMAILS
========================= */
export const emails = pgTable(
  'emails',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    accountId: uuid('account_id')
      .notNull()
      .references(() => mailAccounts.id, { onDelete: 'cascade' }),

    folderId: uuid('folder_id').references(() => mailFolders.id, {
      onDelete: 'set null',
    }),

    uid: text('uid').notNull(), // provider UID as string
    messageId: text('message_id'),

    threadId: text('thread_id'),

    subject: text('subject'),
    snippet: text('snippet'),

    fromJson: text('from_json').notNull(),
    toJson: text('to_json'),
    ccJson: text('cc_json'),
    bccJson: text('bcc_json'),

    receivedAt: timestamp('received_at', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),

    isRead: boolean('is_read').default(false).notNull(),
    isStarred: boolean('is_starred').default(false).notNull(),
    isImportant: boolean('is_important').default(false).notNull(),
    hasAttachments: boolean('has_attachments').default(false).notNull(),

    labelsJson: text('labels_json'),

    rawMeta: text('raw_meta'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    accountUidUnique: uniqueIndex('emails_account_uid_unique').on(
      table.accountId,
      table.uid,
    ),
  }),
);
