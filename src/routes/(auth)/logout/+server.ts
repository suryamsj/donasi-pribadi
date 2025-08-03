import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({cookies}) => {
  cookies.delete('token', {
    path: '/',
    maxAge: 0
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    }
  });
};
