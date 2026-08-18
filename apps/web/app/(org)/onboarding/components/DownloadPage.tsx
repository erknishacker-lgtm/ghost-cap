"use client";

import { Button, LogoBadge } from "@cap/ui";
import { Clapperboard, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const recordingModes = [
	{
		name: "Modo Instantâneo",
		icon: <Zap fill="yellow" className="mb-4 size-8" strokeWidth={1.5} />,
		description:
			"Aperte gravar, pare, compartilhe o link. Seu vídeo fica no ar em segundos, com legendas, título, resumo e capítulos gerados automaticamente. Perfeito para feedback rápido, relatar bugs ou mostrar algo na hora.",
	},
	{
		name: "Modo Estúdio",
		icon: (
			<Clapperboard
				fill="var(--blue-9)"
				className="mb-4 size-8"
				strokeWidth={1.5}
			/>
		),
		description:
			"Gravações profissionais com edição local, fundos personalizados e opções de exportação. Para demos, tutoriais e apresentações impecáveis que representam sua marca.",
	},
];

export function DownloadPage() {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-12 justify-center items-center min-h-fit lg:gap-20">
			<div className="space-y-10">
				<div className="flex flex-col gap-6 justify-center items-center">
					<LogoBadge className="mx-auto w-auto h-12" />
					<div className="space-y-1 text-center">
						<h1 className="text-3xl font-medium text-gray-12">Tudo pronto!</h1>
						<p className="text-lg text-center text-gray-11 text-pretty">
							Comece a gravar sua tela direto do navegador ou pela extensão do Chrome
						</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-10 justify-center items-center w-full max-w-[1000px] mx-auto">
					{recordingModes.map((recordingMode) => (
						<div
							key={recordingMode.name}
							className="flex flex-col w-full max-w-[440px] gap-2 items-center p-6 text-center rounded-xl border bg-gray-2 border-gray-3"
						>
							{recordingMode.icon}
							<h2 className="text-xl font-medium text-gray-12">
								{recordingMode.name}
							</h2>
							<p className="text-base text-gray-10 text-pretty">
								{recordingMode.description}
							</p>
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-wrap gap-4 justify-center">
				<Button
					onClick={() => router.push("/dashboard/caps")}
					className="min-w-[120px]"
					variant="dark"
					size="lg"
				>
					Continuar
				</Button>
			</div>
		</div>
	);
}
