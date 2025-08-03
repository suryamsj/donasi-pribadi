import prisma from "$lib/db";
import { hashPassword } from "$lib/server/hash";
import type { PageServerLoad } from "./$types";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  const user = await prisma.user.count();
  if (user > 0) {
    throw redirect(302, "/");
  }
};

export const actions: Actions = {
  default: async ({request}) => {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      if (password !== confirmPassword) {
        return fail(400, {
          message: "Password tidak cocok",
        })
      }

      const hash = await hashPassword(password);

      await prisma.user.create({
        data: {
          name: name,
          username: username,
          password: hash,
        }
      })
    } catch (e) {
      console.log(e);
      return fail(400, {
				message: 'Terjadi kesalahan'
			});
    }

    throw redirect(302, "/login");
  }
};
