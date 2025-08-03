import { verifyToken } from '$lib/server/jwt';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('token');

  // Check Token
  if(token){
    try {
      const payload = verifyToken(token);
      event.locals.user = payload;
    } catch (e) {
      console.log((e as Error).message);
      event.locals.user = {
        id: '',
        username: '',
      };
      event.cookies.set('token', '', {
        path: '/',
      });
    }
  }

  // Check Route
  if(event.url.pathname === '/dashboard' && !event.locals.user){
    redirect(303, '/');
  }

  if(event.url.pathname === '/login' && event.locals.user){
    redirect(303, '/dashboard');
  }

	return resolve(event);
};
