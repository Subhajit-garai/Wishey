import { pgTable as pgTableCore, varchar as varcharCore, text as textCore, integer as integerCore, boolean as booleanCore, timestamp as timestampCore, jsonb as jsonbCore } from "drizzle-orm/pg-core";
import { type Wish } from "@/app/wish/types";

export const wishes = pgTableCore("wishes", {
  id: varcharCore("id", { length: 255 }).primaryKey(),
  slug: varcharCore("slug", { length: 255 }).notNull(),
  templateId: varcharCore("template_id", { length: 255 }).notNull(),
  occasion: varcharCore("occasion", { length: 100 }).notNull(),
  title: varcharCore("title", { length: 255 }).notNull(),
  subtitle: varcharCore("subtitle", { length: 255 }),
  description: textCore("description"),

  // People
  recipient: jsonbCore("recipient").$type<Wish["recipient"]>().notNull(),
  sender: jsonbCore("sender").$type<Wish["sender"]>().notNull(),

  // Content
  messages: jsonbCore("messages").$type<string[]>().notNull(),
  quote: textCore("quote"),
  poem: textCore("poem"),

  // Media
  coverImage: varcharCore("cover_image", { length: 500 }).notNull(),
  profileImage: varcharCore("profile_image", { length: 500 }),
  gallery: jsonbCore("gallery").$type<string[]>(),
  video: varcharCore("video", { length: 500 }),
  voiceMessage: varcharCore("voice_message", { length: 500 }),
  music: varcharCore("music", { length: 500 }),

  // Appearance
  theme: varcharCore("theme", { length: 100 }).notNull(),
  colors: jsonbCore("colors").$type<Wish["colors"]>(),
  font: varcharCore("font", { length: 100 }),
  animation: jsonbCore("animation").$type<Wish["animation"]>(),

  // Interactive sections
  memories: jsonbCore("memories").$type<Wish["memories"]>(),
  timeline: jsonbCore("timeline").$type<Wish["timeline"]>(),

  // Gifts
  gifts: jsonbCore("gifts").$type<Wish["gifts"]>(),

  // Countdown
  countdown: jsonbCore("countdown").$type<Wish["countdown"]>(),

  // Visibility
  isPublic: booleanCore("is_public").default(true).notNull(),
  allowComments: booleanCore("allow_comments").default(true).notNull(),
  allowReactions: booleanCore("allow_reactions").default(true).notNull(),

  // Analytics
  views: integerCore("views").default(0).notNull(),
  reactions: integerCore("reactions").default(0).notNull(),
  shares: integerCore("shares").default(0).notNull(),

  // SEO
  tags: jsonbCore("tags").$type<string[]>(),

  // Schedule
  publishAt: varcharCore("publish_at", { length: 100 }),

  // Dates
  createdAt: varcharCore("created_at", { length: 100 }).notNull(),
  updatedAt: varcharCore("updated_at", { length: 100 }).notNull(),
});

export const users = pgTableCore("users", {
  id: varcharCore("id", { length: 255 }).primaryKey(),
  name: varcharCore("name", { length: 255 }).notNull(),
  email: varcharCore("email", { length: 255 }).notNull().unique(),
  password: varcharCore("password", { length: 255 }).notNull(),
  role: varcharCore("role", { length: 50 }).default("user").notNull(),
  createdAt: varcharCore("created_at", { length: 100 }).notNull(),
});
