import { dev } from '$app/environment';
import { DEV_URL, MIDTRANS_DEV_URL, MIDTRANS_SERVER_KEY, PROD_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const payload = {
			transaction_details: {
				order_id: body.order_id,
				gross_amount: body.amount
			},
			item_details: [
				{
					id: crypto.randomUUID(),
					price: body.amount,
					quantity: 1,
					name: 'Donasi Ke Channel Youtube'
				}
			],
			customer_details: {
				first_name: body.customer_name || 'Hamba Allah',
				email: body.customer_email
			},
			enabled_payments: ['gopay', 'shopeepay', 'other_qris'],
			callbacks: {
				finish: dev ? `${DEV_URL}/notifikasi` : `${PROD_URL}/notifikasi`,
				error: dev ? `${DEV_URL}/notifikasi` : `${PROD_URL}/notifikasi`
			}
		};


		/**
		 * Midtrans API
		 * JIKA PRODUCTION, GANTI MIDTRANS_DEV_URL DENGAN MIDTRANS_PROD_URL
		 */
		const response = await fetch(MIDTRANS_DEV_URL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY).toString('base64')}`
			},
			body: JSON.stringify(payload)
		});
		const data = await response.json();
		return json({ message: 'Berhasil', data }, { status: 200 });
	} catch (e) {
		return json({ message: 'Internal Server Error', error: (e as Error).message }, { status: 500 });
	}
};
