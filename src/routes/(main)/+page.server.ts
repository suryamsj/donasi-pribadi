import prisma from '$lib/db';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		try {
			const { customer_name, customer_email, amount, donation_type } = Object.fromEntries(
				await request.formData()
			);
			const order_id = crypto.randomUUID();
			const newAmount = amount ? amount : donation_type;


			// Create Donation
			const response = await fetch('/api/midtrans/request', {
				method: 'POST',
				body: JSON.stringify({ customer_name, customer_email, amount: newAmount, order_id })
			});
			const data = await response.json();

			// Insert to database
			await prisma.transaction.create({
				data: {
					customer_name: (customer_name as string) || 'Hamba Allah',
					customer_email: customer_email as string,
					gross_amount: parseInt(newAmount as string),
					method: 'QRIS',
					order_id
				}
			});

			return {
				message: 'Pembayaran QRIS telah di-generate. Silakan scan QRIS untuk melanjutkan.',
				url: data.data?.redirect_url || ''
			};
		} catch (e) {
			return fail(500, {
				message: 'Pembayaran QRIS gagal di-generate. Silakan coba lagi.',
				error: e instanceof Error ? e.message : 'Unknown error'
			});
		}
	}
};
