import { prisma } from '../src/configs/database.js';
import { env } from '../src/configs/env.js';
import { UserRole, UserStatus } from '../src/generated/prisma/enums.js';

/**
 * Makes `SUPER_ADMIN_EMAIL` the one Super Admin. Safe to re-run. A previous
 * Super Admin (the env changed) is demoted to Admin, never removed; a
 * matching user who was suspended or removed is restored, since the env is
 * the final word on who owns the dashboard.
 */
async function seedSuperAdmin() {
	const email = env.superAdminEmail;

	await prisma.$transaction(async (tx) => {
		await tx.user.updateMany({
			where: { role: UserRole.SUPER_ADMIN, email: { not: email } },
			data: { role: UserRole.ADMIN }
		});

		await tx.user.upsert({
			where: { email },
			create: { email, role: UserRole.SUPER_ADMIN },
			update: {
				role: UserRole.SUPER_ADMIN,
				status: UserStatus.ACTIVE,
				suspendedAt: null,
				suspendedById: null,
				deletedAt: null,
				deletedById: null
			}
		});
	});

	console.info(`Super Admin: ${email}`);
}

try {
	await seedSuperAdmin();
} finally {
	await prisma.$disconnect();
}
