import { PUSHER_CHANNEL } from '$env/static/private';
import prisma from '$lib/db';
import { pusher } from '$lib/server/pusher';
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

			// Trigger Pusher
			pusher.trigger(PUSHER_CHANNEL, 'notification', {
				message: 'Ada donasi baru nih!',
				amount: transaction.gross_amount
			})
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
