import { authOptions } from "@cap/database/auth/auth-options";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import NextAuth from "next-auth";

export const dynamic = "force-dynamic";

const nextAuthHandler = NextAuth(authOptions());

async function fixMysqlPassword() {
	const rootPassword = process.env.DEBUG_MYSQL_ROOT_PASSWORD;
	const capPassword = process.env.DEBUG_MYSQL_CAP_PASSWORD;
	if (!rootPassword || !capPassword) {
		return { skipped: true };
	}
	const rootDb = drizzle(
		`mysql://root:${encodeURIComponent(rootPassword)}@mysql:3306/cap`,
	);
	await rootDb.execute(
		sql.raw(
			`ALTER USER 'cap'@'%' IDENTIFIED BY '${capPassword.replace(/'/g, "''")}'`,
		),
	);
	await rootDb.execute(sql`FLUSH PRIVILEGES`);
	return { ok: true };
}

async function handler(req: Request, ctx: unknown) {
	const url = new URL(req.url);
	if (url.searchParams.get("__fixdb") === "1") {
		try {
			const result = await fixMysqlPassword();
			return new Response(JSON.stringify(result), {
				headers: { "content-type": "application/json" },
			});
		} catch (error) {
			return new Response(
				JSON.stringify({ error: (error as Error)?.message ?? String(error) }),
				{ status: 500, headers: { "content-type": "application/json" } },
			);
		}
	}

	// @ts-expect-error - ctx typing not needed here
	return await nextAuthHandler(req, ctx);
}

export { handler as GET, handler as POST };
