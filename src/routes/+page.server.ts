import { auth } from "$lib/server/lucia";
import { doodles, user } from "$lib/schema";
import { database } from "$lib/server/drizzle";
import { eq } from "drizzle-orm";
import { fail, redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  const session = await locals.auth.validate(); 
  const session_user = session?.user;
  if (session_user) {
    const u = await database.query.user.findFirst({
      where: eq(user.id, session_user.userId),
      with: { doodles: true }
    });


    return { user: u };
  }
}

export const actions = {
  logout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) { return fail(401); }
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);

    throw redirect(302, "/");
  },
  submitDoodle: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    const session_user = session?.user;
    if (session_user) {
      const form_data = await request.formData();
      const canvas_data = form_data.get("canvas_data");
      const artist = form_data.get("artist");

      await database.insert(doodles).values({
        artist,
        canvas: canvas_data,
        user_id: session_user.userId
      });
    }
    else {
      return new Response(null, { status: 401 });
    }
  },
}
