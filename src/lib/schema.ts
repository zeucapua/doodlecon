import { pgTable, varchar, serial } from "drizzle-orm/pg-core";

export const doodles = pgTable("doodles", {
  id: serial("id").primaryKey(),
  artist: varchar("artist"),
  canvas: varchar("canvas")
});

export type Doodle = typeof doodles.$inferSelect;
