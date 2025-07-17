import { dev } from '$app/environment';
import { MIDTRANS_DEV_URL, MIDTRANS_PROD_URL, MIDTRANS_SERVER_KEY } from '$env/static/private';
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
			enabled_payments: ['gopay', 'shopeepay', 'other_qris']
		};
		const url = dev ? MIDTRANS_DEV_URL : MIDTRANS_PROD_URL;
		const response = await fetch(url, {
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
		console.error('Error processing request:', e);
		return json({ message: 'Internal Server Error' }, { status: 500 });
	}
};
