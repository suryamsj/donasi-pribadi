import prisma from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const transaction = await request.json();
		if (transaction.transaction_status === 'settlement') {
			await prisma.transaction.update({
				where: {
					order_id: String(transaction.order_id)
				},
				data: {
					midtrans_status: 'settlement',
					transaction_status: 'SUCCESS',
					raw_response: transaction
				}
			});
		} else if (
			transaction.transaction_status === 'cancel' ||
			transaction.transaction_status === 'expire' ||
			transaction.transaction_status === 'deny'
		) {
			await prisma.transaction.update({
				where: {
					order_id: String(transaction.order_id)
				},
				data: {
					midtrans_status: 'failure',
					transaction_status: 'FAILED',
					raw_response: transaction
				}
			});
		} else {
			await prisma.transaction.update({
				where: {
					order_id: String(transaction.order_id)
				},
				data: {
					midtrans_status: 'pending',
					transaction_status: 'PENDING',
					raw_response: transaction
				}
			});
		}
		return json(
			{
				message: 'Webhook processed successfully'
			},
			{ status: 200 }
		);
	} catch (e) {
		return json({ message: 'Internal Server Error', error: (e as Error).message }, { status: 500 });
	}
};
