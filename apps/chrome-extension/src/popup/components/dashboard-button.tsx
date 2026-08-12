import { LayoutDashboardIcon } from "lucide-react";
import type { Dictionary } from "../../shared/i18n";
import { Button } from "../ui/button";

interface DashboardButtonProps {
	t: Dictionary;
	onClick: () => void;
}

export const DashboardButton = ({ t, onClick }: DashboardButtonProps) => (
	<Button
		type="button"
		variant="outline"
		size="icon"
		aria-label={t.popup.dashboardAriaLabel}
		className="!p-0"
		onClick={onClick}
	>
		<LayoutDashboardIcon size={18} aria-hidden className="text-gray-12" />
	</Button>
);
