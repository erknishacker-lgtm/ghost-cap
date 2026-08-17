import type { Metadata } from "next";
import { DomainsClient } from "./DomainsClient";

export const metadata: Metadata = {
	title: "Domínios Permitidos — Ghost Cap",
};

export default async function DomainsPage() {
	return <DomainsClient />;
}
