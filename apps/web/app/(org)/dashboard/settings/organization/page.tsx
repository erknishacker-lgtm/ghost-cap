import type { Metadata } from "next";
import { GeneralPage } from "./GeneralPage";

export const metadata: Metadata = {
	title: "Configurações da Organização — Ghost Cap",
};

export default function OrganizationPage() {
	return <GeneralPage />;
}
