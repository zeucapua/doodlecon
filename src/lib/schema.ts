// Drizzle Data Schema

import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

// TEMPORARY:
export const doodles = pgTable("doodles", {
  id: serial("id").primaryKey(),
  artist: varchar("artist"),
  canvas: varchar("canvas") // JSON stringified
});
