import type { Metadata } from "next";
import { UsageClient } from "./UsageClient";

export const metadata: Metadata = {
	title: "Uso do Desenvolvedor — Ghost Cap",
};

export default async function UsagePage() {
	return <UsageClient />;
}
