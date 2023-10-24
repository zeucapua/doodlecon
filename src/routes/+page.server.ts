import { database } from "$lib/server/prisma";

export async function load() {
  const doodles = database.doodle.findMany();
  return { doodles };
}

export const actions = {
  submitDoodle: async ({ request }) => {
    const form_data = await request.formData();
    const canvas_data = form_data.get("canvas_data");
    const artist = form_data.get("artist");

    await database.doodle.create({
      data: {
        artist,
        canvas: canvas_data
      }
    });
  },
}
