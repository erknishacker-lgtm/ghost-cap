import type { Metadata } from "next";
import { AppsListClient } from "./AppsListClient";

export const metadata: Metadata = {
	title: "Apps de Desenvolvedor — Ghost Cap",
};

export default async function AppsPage() {
	return <AppsListClient />;
}
