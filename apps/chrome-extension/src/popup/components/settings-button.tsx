import type { Dictionary } from "../../shared/i18n";
import { Button } from "../ui/button";
import CogIcon from "./cog-icon";

interface SettingsButtonProps {
	t: Dictionary;
	onClick: () => void;
}

export const SettingsButton = ({ t, onClick }: SettingsButtonProps) => (
	<Button
		type="button"
		variant="outline"
		size="icon"
		aria-label={t.popup.settingsAriaLabel}
		className="group !p-0"
		onClick={onClick}
	>
		<CogIcon
			size={20}
			aria-hidden
			title={t.popup.settingsAriaLabel}
			className="text-gray-12"
		/>
	</Button>
);
