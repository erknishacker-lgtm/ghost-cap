import type { Metadata } from "next";
import { DownloadPage } from "@/components/pages/DownloadPage";
import { buildMarketingMetadata } from "@/lib/og/url";

export const metadata: Metadata = buildMarketingMetadata({
	title: "Baixar — Ghost Cap",
	path: "/download",
	ogTitle: "Comece a gravar com o Ghost Cap",
	ogTag: "Download",
});

export default function App() {
	return <DownloadPage />;
}
