import type { Metadata } from "next";
import { ApiKeysClient } from "./ApiKeysClient";

export const metadata: Metadata = {
	title: "Chaves de API — Ghost Cap",
};

export default async function ApiKeysPage() {
	return <ApiKeysClient />;
}
