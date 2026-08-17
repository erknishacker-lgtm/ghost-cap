import type { Metadata } from "next";
import { ImportPage } from "./ImportPage";

export const metadata: Metadata = {
	title: "Importar — Ghost Cap",
};

export default function Page() {
	return <ImportPage />;
}
