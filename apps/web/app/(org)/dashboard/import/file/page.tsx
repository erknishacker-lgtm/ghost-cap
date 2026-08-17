import type { Metadata } from "next";
import { ImportFilePage } from "./ImportFilePage";

export const metadata: Metadata = {
	title: "Enviar Arquivo — Ghost Cap",
};

export default function Page() {
	return <ImportFilePage />;
}
