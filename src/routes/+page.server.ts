import prisma from '$lib/db';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		try {
			const { customer_name, customer_email, amount } = Object.fromEntries(
				await request.formData()
			);
			const order_id = crypto.randomUUID();

			// Create Donation
			const response = await fetch('/api/midtrans/request', {
				method: 'POST',
				body: JSON.stringify({ customer_name, customer_email, amount, order_id })
			});
			const data = await response.json();

			// Insert to database
			await prisma.transaction.create({
				data: {
					customer_name: (customer_name as string) || 'Hamba Allah',
					customer_email: customer_email as string,
					gross_amount: parseInt(amount as string),
					method: 'QRIS',
					order_id
				}
			});

			return {
				message: 'Midtrans request successful',
				url: data.data?.redirect_url || ''
			};
		} catch (e) {
			console.error('Error in default action:', e);
			return fail(500, {
				message: 'Internal Server Error',
				error: e instanceof Error ? e.message : 'Unknown error'
			});
		}
	}
};
