import { pgTable, varchar, serial, bigint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("auth_user", {
	id: varchar("id", {
		length: 15 // change this when using custom user ids
	}).primaryKey()
	// other user attributes
});

export const session = pgTable("user_session", {
	id: varchar("id", {
		length: 128
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	activeExpires: bigint("active_expires", {
		mode: "number"
	}).notNull(),
	idleExpires: bigint("idle_expires", {
		mode: "number"
	}).notNull()
});

export const key = pgTable("user_key", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar("hashed_password", {
		length: 255
	})
});

export const doodles = pgTable("doodles", {
  id: serial("id").primaryKey(),
  artist: varchar("artist"),
  canvas: varchar("canvas"),
  user_id: varchar("user_id")
});

export const userRelations = relations(user, ({ many }) => ({
  doodles: many(doodles)
}));

export const doodleRelations = relations(doodles, ({ one }) => ({
  user: one(user, {
    fields: [doodles.user_id],
    references: [user.id]
  })
}));

export type Doodle = typeof doodles.$inferSelect;
