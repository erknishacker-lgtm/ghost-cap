import type { Metadata } from "next";
import { AppSettingsClient } from "./AppSettingsClient";

export const metadata: Metadata = {
	title: "Configurações do App — Ghost Cap",
};

export default async function AppSettingsPage() {
	return <AppSettingsClient />;
}
