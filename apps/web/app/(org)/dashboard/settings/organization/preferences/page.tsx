import type { Metadata } from "next";
import CapSettingsCard from "../components/CapSettingsCard";

export const metadata: Metadata = {
	title: "Preferências da Organização — Ghost Cap",
};

export default function PreferencesPage() {
	return <CapSettingsCard />;
}
