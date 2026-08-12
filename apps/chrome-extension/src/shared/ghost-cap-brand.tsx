import type { SVGProps } from "react";
import ghostMark from "../assets/ghost-mark-tile.png";

export const GhostCapBrand = (props: SVGProps<SVGSVGElement>) => (
	<svg
		className="brand-logo"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 176 40"
		aria-label="Ghost Cap"
		{...props}
	>
		<title>Ghost Cap</title>
		<image href={ghostMark} x="0" y="0" width="40" height="40" rx="9" />
		<text
			x="48"
			y="27"
			fill="currentColor"
			fontFamily="'Neue Montreal', ui-sans-serif, system-ui, sans-serif"
			fontWeight="700"
			fontSize="21"
			letterSpacing="-0.01"
		>
			Ghost Cap
		</text>
	</svg>
);

export const DoodleBoilFilter = ({ id = "boil" }: { id?: string }) => (
	<filter id={id} x="-15%" y="-15%" width="130%" height="130%">
		<feTurbulence
			type="fractalNoise"
			baseFrequency="0.05"
			numOctaves="2"
			seed="1"
			result="noise"
		>
			<animate
				attributeName="seed"
				values="1;3;5;7"
				dur="0.6s"
				repeatCount="indefinite"
				calcMode="discrete"
			/>
		</feTurbulence>
		<feDisplacementMap
			in="SourceGraphic"
			in2="noise"
			scale="3"
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
);
