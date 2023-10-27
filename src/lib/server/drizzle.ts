import postgres from "postgres";
import * as schema from "../schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "$env/static/private";

export const query_client = postgres(DATABASE_URL);
export const database = drizzle(query_client, { schema });
