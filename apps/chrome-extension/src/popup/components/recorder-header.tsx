import clsx from "clsx";
import { X } from "lucide-react";
import { GhostCapBrand } from "../../shared/ghost-cap-brand";
import type { Dictionary } from "../../shared/i18n";

interface RecorderHeaderProps {
	t: Dictionary;
	isBusy: boolean;
	isPro: boolean;
	showPlan: boolean;
	/** Hide the logo row; the sign-in screen renders its own centered brand. */
	minimal?: boolean;
	onClose: () => void;
	onUpgradeClick: () => void;
}

export const RecorderHeader = ({
	t,
	isBusy,
	isPro,
	showPlan,
	minimal = false,
	onClose,
	onUpgradeClick,
}: RecorderHeaderProps) => {
	const planLabel = isPro ? t.popup.header.planPro : t.popup.header.planFree;
	const planClassName = clsx(
		"ml-2 inline-flex items-center rounded-full px-2 text-[0.7rem] font-medium transition-colors",
		isPro
			? "bg-gray-12 text-gray-1"
			: "cursor-pointer bg-gray-3 text-gray-12 hover:bg-gray-4",
	);

	return (
		<>
			<div className="absolute left-3.5 top-4 flex gap-2 items-center">
				<button
					type="button"
					onClick={onClose}
					disabled={isBusy}
					title={t.popup.header.closeTitle}
					className={clsx(
						"flex size-4 items-center justify-center rounded-full bg-[#FF5F57] border border-[#E0443E]/60 p-0",
						isBusy
							? "opacity-50 cursor-not-allowed"
							: "cursor-pointer transition-transform hover:scale-110",
					)}
					aria-label={t.popup.header.closeAriaLabel}
				>
					<X
						size={10}
						strokeWidth={3.5}
						className="text-[#741b15]"
						aria-hidden
					/>
				</button>
				<div className="size-3 rounded-full bg-gray-8 opacity-50"></div>
				<div className="size-3 rounded-full bg-gray-8 opacity-50"></div>
			</div>
			{minimal ? null : (
				<div className="flex items-center justify-between pb-[0.25rem]">
					<div className="flex items-center space-x-1">
						<GhostCapBrand className="h-[26px] w-auto block text-gray-12" />
						{showPlan &&
							(isPro ? (
								<span className={planClassName}>{planLabel}</span>
							) : (
								<button
									type="button"
									onClick={onUpgradeClick}
									className={planClassName}
								>
									{planLabel}
								</button>
							))}
					</div>
				</div>
			)}
		</>
	);
};
