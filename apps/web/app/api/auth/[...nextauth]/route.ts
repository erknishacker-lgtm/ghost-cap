import { authOptions } from "@cap/database/auth/auth-options";
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
				if (key === "cause" || key === "originalError" || key === "cause_") {
					out[key] = dump(value, depth + 1);
				} else if (typeof value === "object" && value !== null) {
					out[key] = dump(value, depth + 1);
				} else {
					out[key] = value;
				}
			}
			return out;
		};
		return new Response(JSON.stringify({ debugDump: dump(error) }, null, 2), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
}

export { handler as GET, handler as POST };
