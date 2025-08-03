import prisma from '$lib/db';
import { comparePassword } from '$lib/server/hash';
import { createToken } from '$lib/server/jwt';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		try {
			if (!username || !password) {
				return fail(400, {
					message: 'Username dan password harus diisi'
				});
			}

			const user = await prisma.user.findUnique({
				where: {
					username: username as string
				}
			});

			if (!user) {
				return fail(400, {
					message: 'Username tidak ditemukan'
				});
			}

			const isPasswordValid = await comparePassword(password, user.password);
			if (!isPasswordValid) {
				return fail(400, {
					message: 'Username dan Password tidak sesuai'
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
		} catch (e) {
			console.log(e);
			return fail(400, {
				message: 'Terjadi kesalahan'
			});
		}

    throw redirect(302, "/dashboard");
	}
};
