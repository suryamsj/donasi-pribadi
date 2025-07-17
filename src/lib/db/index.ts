import { DATABASE_URL } from '$env/static/private';
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient({
	datasourceUrl: DATABASE_URL
}).$extends(withAccelerate());

export default prisma;
