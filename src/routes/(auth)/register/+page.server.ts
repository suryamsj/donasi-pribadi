import prisma from '$lib/db';
import { hashPassword } from '$lib/server/hash';
import { registerSchema } from '$lib/validation/auth.schema';
import z from 'zod';
import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const user = await prisma.user.count();
	if (user > 0) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		try {
			const validation = registerSchema.safeParse({
				name: name,
				username: username,
				password: password,
				confirmPassword: confirmPassword
			});

			if (!validation.success) {
				const flatError = z.flattenError(validation.error);


				// Get Error
				const nameError = flatError.fieldErrors?.name?.join(', ');
				const usernameError = flatError.fieldErrors?.username?.join(', ');
				const passwordError = flatError.fieldErrors?.password?.join(', ');
				const confirmPasswordError = flatError.fieldErrors?.confirmPassword?.join(', ');

				return fail(400, {
					message: 'Perhatikan inputan Anda!',
					errors: {
						name: nameError,
						username: usernameError,
						password: passwordError,
						confirmPassword: confirmPasswordError
					}
				});
			}

			const hash = await hashPassword(password);

			await prisma.user.create({
				data: {
					name: name,
					username: username,
					password: hash
				}
			});
		} catch (e) {
			return fail(400, {
				message: (e as Error).message
			});
		}

		throw redirect(302, '/login');
	}
};
