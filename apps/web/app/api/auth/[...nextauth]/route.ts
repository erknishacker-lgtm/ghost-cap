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
		const err = error as Error;
		return new Response(
			JSON.stringify({
				debugError: err?.message ?? String(error),
				debugStack: err?.stack ?? null,
			}),
			{ status: 500, headers: { "content-type": "application/json" } },
		);
	}
}

export { handler as GET, handler as POST };
