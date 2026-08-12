import { CircleHelpIcon } from "lucide-react";
import type { Dictionary } from "../../shared/i18n";

interface HowItWorksButtonProps {
	t: Dictionary;
	onClick: () => void;
}

export const HowItWorksButton = ({ t, onClick }: HowItWorksButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex items-center justify-center gap-1 text-xs font-medium transition-colors hover:text-gray-12"
		>
			<CircleHelpIcon className="size-3.5" aria-hidden />
			{t.popup.howItWorks}
		</button>
	);
};
