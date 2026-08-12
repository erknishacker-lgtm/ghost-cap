export const Logo = ({
	className,
	showVersion,
	showBeta,
	white,
	hideLogoName,
	viewBoxDimensions = "0 0 120 40",
	style,
}: {
	className?: string;
	showVersion?: boolean;
	showBeta?: boolean;
	white?: boolean;
	hideLogoName?: boolean;
	style?: React.CSSProperties;
	viewBoxDimensions?: `${string} ${string} ${string} ${string}`;
}) => {
	return (
		<div className="flex items-center">
			<svg
				viewBox={viewBoxDimensions}
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="xMidYMid meet"
				fill="none"
				style={style}
				aria-label="Ghost Cap Logo"
				className={className}
			>
				<image href="/ghost-mark-tile.png" x="0" y="0" width="40" height="40" />
				{!hideLogoName && (
					<text
						x="44"
						y="26"
						fontFamily="var(--font-sf-pro-display), ui-sans-serif, system-ui, sans-serif"
						fontWeight="700"
						fontSize="15"
						letterSpacing="-0.01"
						className={`${white ? "fill-white" : "fill-gray-12"}`}
						fill={white ? "#ffffff" : "#12161F"}
					>
						Ghost Cap
					</text>
				)}
			</svg>
			{showVersion && (
				<span
					className={`text-[10px] font-medium ${
						white ? "text-white" : "text-gray-1"
					}`}
				>
					v{process.env.appVersion}
				</span>
			)}
			{showBeta && (
				<span
					className={`text-[10px] font-medium min-w-[52px] ${
						white ? "text-white" : "text-gray-1"
					}`}
				>
					Beta v{process.env.appVersion}
				</span>
			)}
		</div>
	);
};
