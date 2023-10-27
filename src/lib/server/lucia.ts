import { lucia } from "lucia";
import { postgres as pg_adapter } from "@lucia-auth/adapter-postgresql";

import { query_client } from "./drizzle";
import { dev } from "$app/environment";
import { sveltekit } from "lucia/middleware";
import { discord } from "@lucia-auth/oauth/providers";
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "$env/static/private";

export const auth = lucia({
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  adapter: pg_adapter(query_client, {
    user: "auth_user",
    key: "user_key",
    session: "user_session"
  }),
});

export const discord_auth = discord(auth, {
  clientId: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
  redirectUri: (dev ? "http://localhost:5173/auth/discord/callback" : "https://doodlecon.vercel.app/auth/discord/callback")
});

export type Auth = typeof auth;
