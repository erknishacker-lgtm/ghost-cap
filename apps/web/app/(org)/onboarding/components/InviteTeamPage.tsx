"use client";

import { Button, Switch } from "@cap/ui";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberFlow from "@number-flow/react";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { type MouseEvent, startTransition, useId, useState } from "react";
import { toast } from "sonner";
import { useStripeContext } from "@/app/Layout/StripeContext";
import { useEffectMutation, useRpcClient } from "@/lib/EffectRuntime";
import { homepageCopy } from "../../../../data/homepage-copy";
import { Base } from "./Base";

export function InviteTeamPage() {
	const billingCycleId = useId();
	const stripeCtx = useStripeContext();
	const [users, setUsers] = useState(1);
	const [isAnnually, setIsAnnually] = useState(true);
	const router = useRouter();
	const rpc = useRpcClient();

	const CAP_PRO_ANNUAL_PRICE_PER_USER = homepageCopy.pricing.pro.pricing.annual;
	const CAP_PRO_MONTHLY_PRICE_PER_USER =
		homepageCopy.pricing.pro.pricing.monthly;

	const currentTotalPrice =
		users *
		(isAnnually
			? CAP_PRO_ANNUAL_PRICE_PER_USER
			: CAP_PRO_MONTHLY_PRICE_PER_USER);
	const billingCycleText = isAnnually
		? "por usuário, cobrado anualmente"
		: "por usuário, cobrado mensalmente";

	const incrementUsers = () => setUsers((n) => n + 1);
	const decrementUsers = () => setUsers((n) => (n > 1 ? n - 1 : 1));

	const inviteTeamMutation = useEffectMutation({
		mutationFn: (_redirect: boolean) =>
			rpc.UserCompleteOnboardingStep({
				step: "inviteTeam",
				data: undefined,
			}),
		onSuccess: (_, redirect: boolean) => {
			startTransition(() => {
				if (redirect) {
					router.push("/onboarding/download");
					router.refresh();
				}
			});
		},
		onError: () => {
			toast.error("Ocorreu um erro, tente novamente");
		},
	});

	const handleSubmit = async (
		e: MouseEvent<HTMLButtonElement>,
		redirect = true,
	) => {
		e.preventDefault();
		await inviteTeamMutation.mutateAsync(redirect);
	};

	const planCheckout = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			const planId = stripeCtx.plans[isAnnually ? "yearly" : "monthly"];

			const response = await fetch(`/api/settings/billing/subscribe`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					priceId: planId,
					quantity: users,
					isOnBoarding: true,
				}),
			});
			if (!response.ok) {
				toast.error("Não foi possível iniciar o checkout. Tente novamente.");
				return;
			}
			const data = await response.json();
			if (data.subscription === true) {
				toast.success("Você já está no plano Ghost Cap Pro");
				return;
			}

			await handleSubmit(e, false);

			if (data.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error("Plan checkout error:", error);
			toast.error("Algo deu errado. Tente novamente.");
		}
	};

	const planCheckoutMutation = useMutation({
		mutationFn: (e: MouseEvent<HTMLButtonElement>) => planCheckout(e),
		onError: (error) => {
			console.error("Plan checkout error:", error);
			toast.error("Algo deu errado. Tente novamente.");
		},
	});

	return (
		<Base
			title="Convide sua equipe"
			descriptionClassName="max-w-[360px]"
			description="Convide membros da sua equipe para participar da organização e compartilhar gravações juntos"
		>
			<div className="text-center">
				<span className="mr-2 text-2xl tabular-nums lg:text-3xl text-gray-12">
					R$<NumberFlow suffix="/mês" value={currentTotalPrice} />
				</span>
				<span className="text-base tabular-nums text-gray-10">
					{" "}
					{billingCycleText}
				</span>
				{isAnnually ? (
					<p className="text-base text-gray-10">
						ou,{" "}
						<NumberFlow
							value={CAP_PRO_MONTHLY_PRICE_PER_USER * users}
							className="text-sm tabular-nums lg:text-base text-gray-12"
							format={{
								notation: "compact",
								style: "currency",
								currency: "BRL",
							}}
							suffix="/mês"
						/>{" "}
						{users === 1 ? (
							"por usuário, "
						) : (
							<>
								para{" "}
								<NumberFlow value={users} className="text-base tabular-nums" />{" "}
								usuários,{" "}
							</>
						)}
						cobrado mensalmente
					</p>
				) : (
					<p className="text-base text-gray-10">
						ou,{" "}
						<NumberFlow
							value={CAP_PRO_ANNUAL_PRICE_PER_USER * users}
							className="text-sm tabular-nums lg:text-base text-gray-12"
							format={{
								notation: "compact",
								style: "currency",
								currency: "BRL",
							}}
							suffix="/mês"
						/>{" "}
						{users === 1 ? (
							"por usuário, "
						) : (
							<>
								para{" "}
								<NumberFlow value={users} className="text-base tabular-nums" />{" "}
								usuários,{" "}
							</>
						)}
						cobrado anualmente
					</p>
				)}
			</div>

			<div className="space-y-3">
				<div className="flex flex-wrap gap-5 justify-center items-center p-5 w-full rounded-xl border bg-gray-3 border-gray-4 xs:gap-3 xs:p-3 xs:rounded-full xs:justify-between">
					<div className="flex gap-2 items-center">
						<p className="text-sm text-gray-12">Por usuário</p>
						<div className="flex items-center">
							<Button
								onClick={decrementUsers}
								className="p-1 bg-gray-12 hover:bg-gray-11 min-w-fit h-fit"
								aria-label="Diminuir número de usuários"
							>
								<FontAwesomeIcon
									icon={faMinus}
									className="text-gray-1 size-2.5"
								/>
							</Button>
							<span className="w-6 font-medium tabular-nums text-center text-gray-12">
								<NumberFlow value={users} />
							</span>
							<Button
								onClick={incrementUsers}
								className="p-1 bg-gray-12 hover:bg-gray-11 min-w-fit h-fit"
								aria-label="Aumentar número de usuários"
							>
								<FontAwesomeIcon
									icon={faPlus}
									className="text-gray-1 size-2.5"
								/>
							</Button>
						</div>
					</div>
					<div className="flex items-center">
						<span
							className={clsx(
								"text-sm",
								!isAnnually ? "text-gray-12" : "text-gray-10",
							)}
						>
							{homepageCopy.pricing.pro.labels.monthly}
						</span>
						<Switch
							checked={isAnnually}
							onCheckedChange={setIsAnnually}
							aria-label="Ciclo de cobrança"
							className="scale-75"
							id={billingCycleId}
						/>
						<span
							className={clsx(
								"text-sm",
								isAnnually ? "text-gray-12" : "text-gray-10",
							)}
						>
							{homepageCopy.pricing.pro.labels.annually}
						</span>
					</div>
				</div>
				<Button
					className="w-full"
					variant="blue"
					spinner={planCheckoutMutation.isPending}
					disabled={planCheckoutMutation.isPending}
					onClick={planCheckoutMutation.mutate}
				>
					Começar
				</Button>
			</div>
			<div className="w-full h-px bg-gray-4" />
			<Button
				variant="dark"
				className="mx-auto w-full"
				onClick={handleSubmit}
				spinner={inviteTeamMutation.isPending}
				disabled={inviteTeamMutation.isPending}
			>
				Pular
			</Button>
		</Base>
	);
}
