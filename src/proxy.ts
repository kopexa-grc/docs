import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import {
	type NextFetchEvent,
	type NextRequest,
	NextResponse,
} from "next/server";
import { i18n } from "@/lib/i18n";

const i18nMiddleware = createI18nMiddleware(i18n);

export default async function proxy(
	request: NextRequest,
	event: NextFetchEvent,
) {
	// Config redirects in Next 16.0.10 drop custom headers; set them on the response.
	const destination = request.nextUrl.clone();
	destination.pathname = "/de/platform";
	const response =
		request.nextUrl.pathname === "/"
			? NextResponse.redirect(destination, 307)
			: ((await i18nMiddleware(request, event)) ?? NextResponse.next());

	if (process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "staging") {
		response.headers.set("X-Robots-Tag", "noindex, nofollow");
	}
	return response;
}

export const config = {
	// Keep tracking requests out of locale redirects.
	// You may need to adjust it to ignore static assets in `/public` folder
	matcher: [
		"/((?!collect(?:/|$)|api|_next/static|_next/image|favicon.ico|icon|sitemap.xml).*)",
	],
};
