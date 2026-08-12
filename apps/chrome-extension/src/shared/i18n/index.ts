import type { Dictionary } from "./dictionary";
import { en } from "./en";
import { pt } from "./pt";

export type Locale = "pt" | "en";

export const DEFAULT_LOCALE: Locale = "pt";

export const LOCALES: Locale[] = ["pt", "en"];

export const LOCALE_LABELS: Record<Locale, string> = {
	pt: "Português",
	en: "English",
};

const DICTIONARIES: Record<Locale, Dictionary> = { pt, en };

export const isLocale = (value: unknown): value is Locale =>
	value === "pt" || value === "en";

export const getDictionary = (locale: Locale): Dictionary =>
	DICTIONARIES[locale];

export type { Dictionary };
