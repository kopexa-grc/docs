import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// In the future, add checks here (e.g., required env vars, ability to read content directory)
export function GET(_req: NextRequest) {
	return new Response("ready", {
		status: 200,
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "no-store",
		},
	});
}

export function HEAD(_req: NextRequest) {
	return new Response(null, {
		status: 200,
		headers: {
			"cache-control": "no-store",
		},
	});
}
