"use client";

import { Button } from "@cap/ui";
import { trackEvent } from "@/app/utils/analytics";
import { ChromeExtensionButton } from "@/components/ChromeExtensionButton";
import {
	CAP_CHROME_EXTENSION_URL,
	CHROME_EXTENSION_BUTTON_CLASS,
} from "@/lib/chrome-extension";

export const DownloadPage = () => {
	return (
		<div className="flex flex-col items-center px-5 pt-32 pb-24 mx-auto max-w-2xl text-center">
			<h1 className="text-4xl font-medium text-gray-12 md:text-5xl">
				Comece a gravar
			</h1>
			<p className="mt-4 text-lg text-gray-10">
				Grave direto no navegador ou instale a extensão do Chrome. Sem
				instalação pesada, sem espera.
			</p>

			<div className="flex flex-col gap-3 items-center mt-8 sm:flex-row">
				<Button
					href="/signup"
					variant="dark"
					size="lg"
					onClick={() =>
						trackEvent("download_page_cta_clicked", {
							cta_location: "primary",
							target: "signup",
						})
					}
				>
					Gravar no navegador
				</Button>
				<span className="text-sm text-gray-10">ou</span>
				<ChromeExtensionButton
					variant="dark"
					className={`${CHROME_EXTENSION_BUTTON_CLASS} font-medium`}
					onClick={() =>
						trackEvent("download_page_cta_clicked", {
							cta_location: "secondary",
							target: "chrome_extension",
							target_url: CAP_CHROME_EXTENSION_URL,
						})
					}
				/>
			</div>
		</div>
	);
};
