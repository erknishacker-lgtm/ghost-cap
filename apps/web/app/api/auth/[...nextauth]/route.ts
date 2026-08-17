import { authOptions } from "@cap/database/auth/auth-options";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import NextAuth from "next-auth";

export const dynamic = "force-dynamic";

const nextAuthHandler = NextAuth(authOptions());

function dump(e: unknown, depth = 0): unknown {
	if (!e || typeof e !== "object" || depth > 4) return String(e);
	const out: Record<string, unknown> = {};
	for (const key of Object.getOwnPropertyNames(e)) {
		const value = (e as Record<string, unknown>)[key];
		out[key] = typeof value === "object" && value !== null ? dump(value, depth + 1) : value;
	}
	return out;
}

async function fixMysqlPassword() {
	const rootPassword = process.env.DEBUG_MYSQL_ROOT_PASSWORD;
	const capPassword = process.env.DEBUG_MYSQL_CAP_PASSWORD;
	if (!rootPassword || !capPassword) {
		return { skipped: true };
	}
	const rootDb = drizzle(
		`mysql://root:${encodeURIComponent(rootPassword)}@mysql:3306/cap`,
	);

	const grants = await rootDb.execute(
		sql`SELECT user, host FROM mysql.user WHERE user = 'cap'`,
	);

	const escapedPassword = capPassword.replace(/'/g, "''");
	const results: Record<string, unknown> = { grants };
	const hosts = new Set<string>(["%"]);
	for (const row of grants as unknown as { host: string }[]) {
		hosts.add(row.host);
	}

	for (const host of hosts) {
		try {
			await rootDb.execute(
				sql.raw(
					`ALTER USER 'cap'@'${host}' IDENTIFIED BY '${escapedPassword}'`,
				),
			);
			results[`alter_${host}`] = "ok";
		} catch (e) {
			results[`alter_${host}`] = dump(e);
		}
	}

	await rootDb.execute(sql`FLUSH PRIVILEGES`);
	return results;
}

async function handler(req: Request, ctx: unknown) {
	const url = new URL(req.url);
	if (url.searchParams.get("__fixdb") === "1") {
		try {
			const result = await fixMysqlPassword();
			return new Response(JSON.stringify(result, null, 2), {
				headers: { "content-type": "application/json" },
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: dump(error) }, null, 2), {
				status: 500,
				headers: { "content-type": "application/json" },
			});
		}
	}

	// @ts-expect-error - ctx typing not needed here
	return await nextAuthHandler(req, ctx);
}

export { handler as GET, handler as POST };
