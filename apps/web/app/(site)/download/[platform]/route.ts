import { NextResponse } from "next/server";

// We don't ship our own desktop installers yet, so this no longer proxies
// third-party binaries -- send visitors to the real download page instead.
export async function GET(request: Request) {
	return NextResponse.redirect(new URL("/download", request.url));
}
