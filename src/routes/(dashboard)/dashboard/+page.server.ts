import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/db";

export const load: PageServerLoad = async () => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy:{
        created_at: 'desc'
      }
    });
    return {
      transactions
    }
  } catch (e) {
    console.log(e);
    error(500, 'Internal Server Error');
  }
};
