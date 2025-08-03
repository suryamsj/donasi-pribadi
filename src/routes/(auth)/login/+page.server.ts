import prisma from '$lib/db';
import { comparePassword } from '$lib/server/hash';
import { createToken } from '$lib/server/jwt';
import { loginSchema } from '$lib/validation/auth.schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import z from 'zod';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		try {
			const validation = loginSchema.safeParse({
				username: username,
				password: password
			});

			if(!validation.success){
				const flatError = z.flattenError(validation.error);

				// Get Error
				const usernameError = flatError.fieldErrors?.username?.join(', ');
				const passwordError = flatError.fieldErrors?.password?.join(', ');

				return fail(400, {
					message: 'Perhatikan inputan Anda!',
					errors: {
						username: usernameError,
						password: passwordError,
					}
				})
			}

			const user = await prisma.user.findUnique({
				where: {
					username: username as string
				}
			});

			if (!user) {
				return fail(400, {
					message: 'Username tidak ditemukan',
				});
			}

			const isPasswordValid = await comparePassword(password, user.password);
			if (!isPasswordValid) {
				return fail(400, {
					message: 'Username dan Password tidak sesuai',
				});
			}

			// JWT
			const token = createToken({
				id: user.id,
				username: user.username
			});

			// COOKIES
			cookies.set('token', token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/'
			});
		} catch {
			return fail(400, {
				message: 'Terjadi kesalahan',
			});
		}

    throw redirect(302, "/dashboard");
	}
};
