import type { Metadata } from "next";
import { Download } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/og/url";

export const metadata: Metadata = buildMarketingMetadata({
	title: "Extensão do Chrome — Ghost Cap",
	description:
		"Baixe e instale a extensão do Ghost Cap para o Chrome em poucos passos.",
	path: "/chrome-extension",
	ogTitle: "Extensão do Chrome — Ghost Cap",
	ogTag: "Extensão",
});

const steps = [
	{
		title: "Baixe o arquivo da extensão",
		description:
			'Clique no botão abaixo para baixar o "ghost-cap-extension.zip" e descompacte em uma pasta no seu computador.',
	},
	{
		title: "Abra as extensões do Chrome",
		description:
			'Digite "chrome://extensions" na barra de endereço do Chrome e aperte Enter.',
	},
	{
		title: 'Ative o "Modo do desenvolvedor"',
		description: "É um botão no canto superior direito da página.",
	},
	{
		title: 'Clique em "Carregar sem compactação"',
		description:
			"Selecione a pasta que você descompactou no passo 1 (a pasta em si, não um arquivo dentro dela).",
	},
	{
		title: "Pronto!",
		description:
			"O ícone do fantasma vai aparecer na barra de extensões do Chrome. Fixe ele pra ter acesso rápido.",
	},
];

export default function ChromeExtensionPage() {
	return (
		<div className="flex flex-col items-center px-5 pt-32 pb-24 mx-auto max-w-2xl">
			<div className="text-center">
				<h1 className="text-4xl font-medium text-gray-12 md:text-5xl">
					Extensão do Chrome
				</h1>
				<p className="mt-4 text-lg text-gray-10">
					Grave sua tela direto do navegador com o Ghost Cap. Instalação em
					menos de um minuto.
				</p>

				<a
					href="/ghost-cap-extension.zip"
					download
					className="inline-flex gap-2 items-center px-6 py-3 mt-8 font-medium text-white bg-black rounded-full transition-colors hover:bg-gray-800"
				>
					<Download className="size-4" />
					Baixar extensão (.zip)
				</a>
			</div>

			<ol className="mt-16 space-y-6 w-full">
				{steps.map((step, index) => (
					<li key={step.title} className="flex gap-4">
						<span className="flex flex-shrink-0 justify-center items-center text-sm font-semibold text-white bg-black rounded-full size-8">
							{index + 1}
						</span>
						<div>
							<p className="font-medium text-gray-12">{step.title}</p>
							<p className="mt-1 text-sm text-gray-10">{step.description}</p>
						</div>
					</li>
				))}
			</ol>
		</div>
	);
}
