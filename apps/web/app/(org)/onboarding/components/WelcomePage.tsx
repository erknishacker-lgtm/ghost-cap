"use client";

import { Button, Input } from "@cap/ui";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";
import { useEffectMutation, useRpcClient } from "@/lib/EffectRuntime";
import { Base } from "./Base";

export function WelcomePage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const router = useRouter();
	const rpc = useRpcClient();

	const welcomeMutation = useEffectMutation({
		mutationFn: (data: { firstName: string; lastName?: string }) =>
			rpc.UserCompleteOnboardingStep({
				step: "welcome",
				data,
			}),
		onSuccess: () => {
			startTransition(() => {
				router.push("/onboarding/organization-setup");
				router.refresh();
			});
		},
		onError: () => {
			toast.error("Ocorreu um erro, tente novamente");
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		welcomeMutation.mutate({ firstName, lastName });
	};

	return (
		<Base
			title="Bem-vindo ao Ghost Cap"
			description="Vamos começar"
			hideBackButton
		>
			<form className="space-y-7" onSubmit={handleSubmit}>
				<div className="space-y-3">
					<Input
						value={firstName}
						disabled={welcomeMutation.isPending}
						onChange={(e) => setFirstName(e.target.value)}
						type="text"
						placeholder="Nome"
						name="firstName"
						required
					/>
					<Input
						value={lastName}
						disabled={welcomeMutation.isPending}
						onChange={(e) => setLastName(e.target.value)}
						type="text"
						placeholder="Sobrenome (opcional)"
						name="lastName"
					/>
				</div>
				<div className="w-full h-px bg-gray-4" />
				<Button
					spinner={welcomeMutation.isPending}
					disabled={!firstName || welcomeMutation.isPending}
					type="submit"
					variant="dark"
					className="mx-auto w-full"
				>
					Continuar
				</Button>
			</form>
		</Base>
	);
}
