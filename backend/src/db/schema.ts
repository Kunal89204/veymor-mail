import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Supabase auth user id

  firstName: text('first_name'),
  lastName: text('last_name'),

  email: text('email').notNull().unique(),

  isActive: boolean('is_active').default(true),
  onboardingCompleted: boolean('onboarding_completed').default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// export const mailAccounts = pgTable('mail_accounts', {
//   id: uuid('id').defaultRandom().primaryKey(),

//   userId: uuid('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),

//     provider: text("provider").notNull(),
//     email:text("email").notNull(),

//     displayName: text("display_name"),

//     protocol: text("protocol").default("imap")
  
// });
