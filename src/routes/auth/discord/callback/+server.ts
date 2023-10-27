import { auth, discord_auth } from "$lib/server/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";

export async function GET({ url, cookies, locals }) {
  const stored_state = cookies.get("discord_oauth_state");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!stored_state || !state || stored_state !== state || !code) {
    return new Response(null, { status: 400 });
  }

  try {
    const { getExistingUser, discordUser, createUser } =
      await discord_auth.validateCallback(code);

    const getUser = async () => {
      const existing_user = await getExistingUser();
      if (existing_user) return existing_user;

      const user = await createUser({
        attributes: {}
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    });

    locals.auth.setSession(session);
    return new Response(null, { 
      status: 302,
      headers: { Location: "/" }
    });
  }
  catch (e) {
    if (e instanceof OAuthRequestError) {
      return new Response(null, { status: 400 });
    }
    else {
      return new Response(null, { status: 500 });
    }
  }
}
