import { db } from "@cap/database";
import { authOptions } from "@cap/database/auth/auth-options";
import { sql } from "drizzle-orm";
import NextAuth from "next-auth";

export const dynamic = "force-dynamic";

const nextAuthHandler = NextAuth(authOptions());

async function handler(req: Request, ctx: unknown) {
	try {
		// @ts-expect-error - debug wrapper, ctx typing not needed here
		return await nextAuthHandler(req, ctx);
	} catch (error) {
		console.error("NEXTAUTH_HANDLER_CRASH", error);
		const dump = (e: unknown, depth = 0): Record<string, unknown> | null => {
			if (!e || typeof e !== "object" || depth > 4) return null;
			const out: Record<string, unknown> = {};
			for (const key of Object.getOwnPropertyNames(e)) {
				const value = (e as Record<string, unknown>)[key];
				if (typeof value === "object" && value !== null) {
					out[key] = dump(value, depth + 1);
				} else {
					out[key] = value;
				}
			}
			return out;
		};

		let columns: unknown = null;
		let columnsError: unknown = null;
		try {
			const result = await db().execute(sql`SHOW COLUMNS FROM users`);
			columns = result;
		} catch (e) {
			columnsError = dump(e);
		}

		let rawQuery: unknown = null;
		let rawQueryError: unknown = null;
		try {
			const result = await db().execute(
				sql`select id, email from users where email = 'louzadaof@gmail.com' limit 1`,
			);
			rawQuery = result;
		} catch (e) {
			rawQueryError = dump(e);
		}

		return new Response(
			JSON.stringify(
				{ debugDump: dump(error), columns, columnsError, rawQuery, rawQueryError },
				null,
				2,
			),
			{
				status: 500,
				headers: { "content-type": "application/json" },
			},
		);
	}
}

export { handler as GET, handler as POST };
