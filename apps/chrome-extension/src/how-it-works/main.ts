import { getDictionary } from "../shared/i18n";
import { mountPageNav } from "../shared/page-nav";
import { loadSettings } from "../shared/storage";
import "./styles.css";

mountPageNav("how-it-works");

const byId = <T extends HTMLElement>(id: string): T => {
	const element = document.getElementById(id);
	if (!element) throw new Error(`Missing element: ${id}`);
	return element as T;
};

void loadSettings()
	.then((settings) => {
		const t = getDictionary(settings.locale);
		document.title = t.howItWorks.pageTitle;
		byId("hiw-title").textContent = t.howItWorks.title;
		byId("hiw-lede").textContent = t.howItWorks.lede;
		byId("hiw-step-count-1").textContent = t.howItWorks.stepLabel(1);
		byId("hiw-step-text-1").textContent = t.howItWorks.step1;
		byId("hiw-step-count-2").textContent = t.howItWorks.stepLabel(2);
		byId("hiw-step-text-2").textContent = t.howItWorks.step2;
		byId("hiw-step-count-3").textContent = t.howItWorks.stepLabel(3);
		byId("hiw-step-text-3").textContent = t.howItWorks.step3;
		byId("hiw-tips-heading").textContent = t.howItWorks.tipsHeading;
		byId("hiw-tip-1").textContent = t.howItWorks.tip1;
		byId("hiw-tip-2").textContent = t.howItWorks.tip2;
		byId("hiw-tip-3").textContent = t.howItWorks.tip3;
		byId("hiw-footnote").textContent = t.howItWorks.footnote;
	})
	.catch(() => undefined);
