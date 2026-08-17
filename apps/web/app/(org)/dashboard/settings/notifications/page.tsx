import type { Metadata } from "next";
import { NotificationsSettings } from "./NotificationsSettings";

export const metadata: Metadata = {
	title: "Configurações de Notificação — Ghost Cap",
};

export default function NotificationsSettingsPage() {
	return <NotificationsSettings />;
}
