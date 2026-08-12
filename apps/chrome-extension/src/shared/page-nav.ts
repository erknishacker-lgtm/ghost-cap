import ghostMark from "../assets/ghost-mark-tile.png";
import { DEFAULT_LOCALE, type Dictionary, getDictionary } from "./i18n";
import { loadSettings } from "./storage";

const BRAND_NAME = "Ghost Cap";

export const PAGE_NAV_LINKS = [
	{ id: "welcome", href: "welcome.html" },
	{ id: "how-it-works", href: "how-it-works.html" },
	{ id: "camera", href: "camera-permission.html" },
	{ id: "options", href: "options.html" },
] as const;

export type PageNavId = (typeof PAGE_NAV_LINKS)[number]["id"];

const DEFAULT_DASHBOARD_URL =
	import.meta.env.MODE === "development"
		? "http://localhost:3000/dashboard"
		: "https://cap.zghost.uk/dashboard";

const GHOST_CAP_LOGO_HTML = `<img class="page-nav-logo" src="${ghostMark}" alt="" /><span class="page-nav-wordmark">Ghost Cap</span>`;

export const mountPageNav = (active: PageNavId) => {
	if (document.querySelector(".page-nav")) return;

	const t = getDictionary(DEFAULT_LOCALE);

	const nav = document.createElement("nav");
	nav.className = "page-nav";
	nav.setAttribute("aria-label", `${BRAND_NAME} extension pages`);

	const inner = document.createElement("div");
	inner.className = "page-nav-inner";

	const brand = document.createElement("a");
	brand.className = "page-nav-brand";
	brand.href = "welcome.html";
	brand.setAttribute("aria-label", BRAND_NAME);
	brand.innerHTML = GHOST_CAP_LOGO_HTML;

	const links = document.createElement("div");
	links.className = "page-nav-links";
	const anchorsById = new Map<PageNavId, HTMLAnchorElement>();
	for (const link of PAGE_NAV_LINKS) {
		const anchor = document.createElement("a");
		anchor.className =
			link.id === active ? "page-nav-link is-active" : "page-nav-link";
		anchor.href = link.href;
		anchor.textContent = t.pageNav[toPageNavKey(link.id)];
		if (link.id === active) {
			anchor.setAttribute("aria-current", "page");
		}
		anchorsById.set(link.id, anchor);
		links.append(anchor);
	}

	const dashboard = document.createElement("a");
	dashboard.className = "page-nav-link";
	dashboard.href = DEFAULT_DASHBOARD_URL;
	dashboard.target = "_blank";
	dashboard.rel = "noopener";
	dashboard.textContent = t.pageNav.dashboard;
	links.append(dashboard);
	// The user may point the extension at a self-hosted instance, so resolve
	// the real base URL once settings load and leave the default until then.
	// The same settings load also carries the saved language, so the nav
	// labels (rendered in the default locale above) get refreshed here too.
	void loadSettings()
		.then((settings) => {
			dashboard.href = new URL("/dashboard", settings.apiBaseUrl).toString();
			const resolved = getDictionary(settings.locale);
			for (const [id, anchor] of anchorsById) {
				anchor.textContent = resolved.pageNav[toPageNavKey(id)];
			}
			dashboard.textContent = resolved.pageNav.dashboard;
		})
		.catch(() => undefined);

	inner.append(brand, links);
	nav.append(inner);
	document.body.prepend(nav);
};

const toPageNavKey = (id: PageNavId): keyof Dictionary["pageNav"] =>
	id === "how-it-works" ? "howItWorks" : id;
