import {
	TRIPAY_channel,
	TRIPAY_merchant_code,
	TRIPAY_merchant_ref,
	TRIPAY_privateKey
} from '$env/static/private';
import crypto from 'crypto';

export const signature = crypto
	.createHmac('sha256', TRIPAY_privateKey)
	.update(TRIPAY_merchant_code + TRIPAY_channel + TRIPAY_merchant_ref)
	.digest('hex');
