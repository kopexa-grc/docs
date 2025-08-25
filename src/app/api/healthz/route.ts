import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export function GET(_req: NextRequest) {
	return new Response("ok", {
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
