import type { Metadata } from "next";
import { ImportLoomPage } from "./ImportLoomPage";

export const metadata: Metadata = {
	title: "Importar do Loom — Ghost Cap",
};

export default function Page() {
	return <ImportLoomPage />;
}
