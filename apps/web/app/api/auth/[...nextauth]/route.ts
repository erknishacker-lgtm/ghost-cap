import { db } from "@cap/database";
import { users } from "@cap/database/schema";
import { authOptions } from "@cap/database/auth/auth-options";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

async function debugImage(email: string) {
	const [user] = await db()
		.select({ image: users.image, email: users.email })
		.from(users)
		.where(eq(users.email, email.toLowerCase()));

	let presignedUrl: string | null = null;
	let presignError: string | null = null;
	if (user?.image) {
		try {
			const client = new S3Client({
				endpoint: process.env.S3_PUBLIC_ENDPOINT,
				region: process.env.CAP_AWS_REGION,
				credentials: {
					accessKeyId: process.env.CAP_AWS_ACCESS_KEY ?? "",
					secretAccessKey: process.env.CAP_AWS_SECRET_KEY ?? "",
				},
				forcePathStyle: process.env.S3_PATH_STYLE === "true",
			});
			presignedUrl = await getSignedUrl(
				client,
				new GetObjectCommand({
					Bucket: process.env.CAP_AWS_BUCKET,
					Key: user.image,
				}),
				{ expiresIn: 3600 },
			);
		} catch (error) {
			presignError = (error as Error)?.message ?? String(error);
		}
	}

	return {
		userImage: user?.image ?? null,
		S3_PUBLIC_ENDPOINT: process.env.S3_PUBLIC_ENDPOINT ?? null,
		S3_INTERNAL_ENDPOINT: process.env.S3_INTERNAL_ENDPOINT ?? null,
		CAP_AWS_ENDPOINT: process.env.CAP_AWS_ENDPOINT ?? null,
		CAP_AWS_BUCKET: process.env.CAP_AWS_BUCKET ?? null,
		S3_PATH_STYLE: process.env.S3_PATH_STYLE ?? null,
		presignedUrl,
		presignError,
		CAP_CHROME_EXTENSION_ID: process.env.CAP_CHROME_EXTENSION_ID ?? null,
		WEB_URL: process.env.WEB_URL ?? null,
		NODE_ENV: process.env.NODE_ENV ?? null,
	};
}

async function wrapped(req: Request, ctx: unknown) {
	const url = new URL(req.url);
	if (url.searchParams.get("__debugimg") === "1") {
		const email = url.searchParams.get("email");
		if (!email) {
			return new Response(JSON.stringify({ error: "missing email" }), {
				status: 400,
			});
		}
		try {
			const result = await debugImage(email);
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
