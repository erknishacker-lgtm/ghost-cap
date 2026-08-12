import { getDictionary } from "../shared/i18n";
import { mountPageNav } from "../shared/page-nav";
import { sendServiceWorkerMessage } from "../shared/runtime";
import { loadAuth, loadSettings } from "../shared/storage";
import "./styles.css";

mountPageNav("welcome");

const byId = <T extends HTMLElement>(id: string): T => {
	const element = document.getElementById(id);
	if (!element) throw new Error(`Missing element: ${id}`);
	return element as T;
};

const stage = byId<HTMLElement>("stage");
const signInButton = byId<HTMLButtonElement>("sign-in");
const signedInPill = byId<HTMLElement>("signed-in");
const ctaNote = byId<HTMLElement>("cta-note");

void loadSettings()
	.then((settings) => {
		const t = getDictionary(settings.locale);
		document.title = t.welcome.pageTitle;
		byId("corner-hint").textContent = t.welcome.cornerHint;
		byId("welcome-title").textContent = t.welcome.title;
		byId("welcome-lede").textContent = t.welcome.lede;
		byId("step-count-1").textContent = t.welcome.stepLabel(1);
		byId("step-text-1").textContent = t.welcome.step1;
		byId("step-count-2").textContent = t.welcome.stepLabel(2);
		byId("step-text-2").textContent = t.welcome.step2;
		byId("step-count-3").textContent = t.welcome.stepLabel(3);
		byId("step-text-3").textContent = t.welcome.step3;
		signInButton.textContent = t.welcome.signIn;
		byId("signed-in-text").textContent = t.welcome.signedIn;
		ctaNote.textContent = t.welcome.ctaNote;
		byId("welcome-footnote").textContent = t.welcome.footnote;
	})
	.catch(() => undefined);

let authPollId: number | null = null;

const showSignedIn = () => {
	if (authPollId !== null) {
		window.clearInterval(authPollId);
		authPollId = null;
	}
	stage.dataset.mode = "ready";
	signInButton.hidden = true;
	ctaNote.hidden = true;
	signedInPill.hidden = false;
};

const checkAuth = async () => {
	const auth = await loadAuth().catch(() => null);
	if (auth) showSignedIn();
};

signInButton.addEventListener("click", () => {
	ctaNote.hidden = false;
	void sendServiceWorkerMessage({
		target: "service-worker",
		type: "auth-start",
	}).catch(() => undefined);
});

authPollId = window.setInterval(() => void checkAuth(), 1000);
void checkAuth();
