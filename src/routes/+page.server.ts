import { doodles } from "$lib/schema";
import { database } from "$lib/server/drizzle";

export async function load() {
  const doodles = await database.query.doodles.findMany();
  return { doodles };
}

export const actions = {
  submitDoodle: async ({ request }) => {
    const form_data = await request.formData();
    const canvas_data = form_data.get("canvas_data");
    const artist = form_data.get("artist");

    await database.insert(doodles).values({
      artist,
      canvas: canvas_data
    });
  },
}
