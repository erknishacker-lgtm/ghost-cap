"use client";

import {
	Button,
	Card,
	CardDescription,
	CardTitle,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input,
	Select,
} from "@cap/ui";
import { type ImageUpload, Organisation } from "@cap/web-domain";
import { useMutation } from "@tanstack/react-query";
import { Effect, Option } from "effect";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { resetUser } from "@/app/utils/analytics";
import { SignedImageUrl } from "@/components/SignedImageUrl";
import { useEffectMutation, useRpcClient } from "@/lib/EffectRuntime";
import { useDashboardContext } from "../../Contexts";
import { ProfileImage } from "./components/ProfileImage";
import { patchAccountSettings, signOutAllDevices } from "./server";

export const Settings = () => {
	const router = useRouter();
	const { organizationData, user } = useDashboardContext();
	const [firstName, setFirstName] = useState(user?.name || "");
	const [lastName, setLastName] = useState(user?.lastName || "");
	const [defaultOrgId, setDefaultOrgId] = useState<
		Organisation.OrganisationId | undefined
	>(user?.defaultOrgId || undefined);
	const [signOutAllDevicesOpen, setSignOutAllDevicesOpen] = useState(false);
	const firstNameId = useId();
	const lastNameId = useId();
	const contactEmailId = useId();
	const initialProfileImage = user?.imageUrl ?? null;
	const [profileImageOverride, setProfileImageOverride] = useState<
		ImageUpload.ImageUrl | null | undefined
	>(undefined);
	const profileImagePreviewUrl =
		profileImageOverride !== undefined
			? profileImageOverride
			: initialProfileImage;

	useEffect(() => {
		if (
			profileImageOverride !== undefined &&
			profileImageOverride === initialProfileImage
		) {
			setProfileImageOverride(undefined);
		}
	}, [initialProfileImage, profileImageOverride]);

	// Track if form has unsaved changes
	const hasChanges =
		firstName !== (user?.name || "") ||
		lastName !== (user?.lastName || "") ||
		defaultOrgId !== user?.defaultOrgId;

	const { mutate: updateName, isPending: updateNamePending } = useMutation({
		mutationFn: async () => {
			await patchAccountSettings(
				firstName.trim(),
				lastName.trim() ? lastName.trim() : undefined,
				defaultOrgId,
			);
		},
		onSuccess: () => {
			toast.success("Nome atualizado com sucesso");
			router.refresh();
		},
		onError: () => {
			toast.error("Falha ao atualizar o nome");
		},
	});

	const signOutAllDevicesMutation = useMutation({
		mutationFn: signOutAllDevices,
		onSuccess: () => {
			toast.success("Sessão encerrada em todos os dispositivos");
			setSignOutAllDevicesOpen(false);
			resetUser();
			signOut({ callbackUrl: "/login" });
		},
		onError: () => {
			toast.error("Falha ao encerrar sessão em todos os dispositivos");
		},
	});

	// Prevent navigation when there are unsaved changes
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasChanges]);

	const rpc = useRpcClient();

	const uploadProfileImageMutation = useEffectMutation({
		mutationFn: Effect.fn(function* (file: File) {
			const arrayBuffer = yield* Effect.promise(() => file.arrayBuffer());
			yield* rpc.UserUpdate({
				id: user.id,
				image: Option.some({
					data: new Uint8Array(arrayBuffer),
					contentType: file.type,
					fileName: file.name,
				}),
			});
		}),
		onSuccess: () => {
			setProfileImageOverride(undefined);
			toast.success("Imagem de perfil atualizada com sucesso");
			router.refresh();
		},
		onError: (error) => {
			console.error("Error uploading profile image:", error);
			setProfileImageOverride(undefined);
			toast.error(
				error instanceof Error
					? error.message
					: "Falha ao enviar a imagem de perfil",
			);
		},
	});

	const removeProfileImageMutation = useEffectMutation({
		mutationFn: () => rpc.UserUpdate({ id: user.id, image: Option.none() }),
		onSuccess: () => {
			setProfileImageOverride(null);
			toast.success("Imagem de perfil removida");
			router.refresh();
		},
		onError: (error) => {
			console.error("Error removing profile image:", error);
			setProfileImageOverride(initialProfileImage);
			toast.error(
				error instanceof Error
					? error.message
					: "Falha ao remover a imagem de perfil",
			);
		},
	});

	const isProfileImageMutating =
		uploadProfileImageMutation.isPending ||
		removeProfileImageMutation.isPending;

	const handleProfileImageChange = (file: File | null) => {
		if (!file || isProfileImageMutating) {
			return;
		}
		uploadProfileImageMutation.mutate(file);
	};

	const handleProfileImageRemove = () => {
		if (isProfileImageMutating) {
			return;
		}
		setProfileImageOverride(null);
		removeProfileImageMutation.mutate();
	};

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					updateName();
				}}
			>
				<div className="grid gap-6 w-full md:grid-cols-2">
					<Card className="space-y-4">
						<div className="space-y-1">
							<CardTitle>Imagem de perfil</CardTitle>
							<CardDescription>
								Essa imagem aparece no seu perfil, comentários e gravações compartilhadas.
							</CardDescription>
						</div>
						<ProfileImage
							initialPreviewUrl={profileImagePreviewUrl}
							onChange={handleProfileImageChange}
							onRemove={handleProfileImageRemove}
							disabled={isProfileImageMutating}
							isUploading={uploadProfileImageMutation.isPending}
							isRemoving={removeProfileImageMutation.isPending}
							userName={user?.name}
						/>
					</Card>
					<Card className="space-y-4">
						<div className="space-y-1">
							<CardTitle>Seu nome</CardTitle>
							<CardDescription>
								Alterar seu nome abaixo atualiza como ele aparece ao
								compartilhar uma gravação e no seu perfil.
							</CardDescription>
						</div>
						<div className="flex flex-col flex-wrap gap-3 w-full">
							<div className="flex-1">
								<Input
									type="text"
									placeholder="Nome"
									onChange={(e) => setFirstName(e.target.value)}
									defaultValue={firstName as string}
									id={firstNameId}
									name="firstName"
								/>
							</div>
							<div className="flex-1 space-y-2">
								<Input
									type="text"
									placeholder="Sobrenome"
									onChange={(e) => setLastName(e.target.value)}
									defaultValue={lastName as string}
									id={lastNameId}
									name="lastName"
								/>
							</div>
						</div>
					</Card>
					<Card className="flex flex-col gap-4">
						<div className="space-y-1">
							<CardTitle>E-mail de contato</CardTitle>
							<CardDescription>
								Este é o e-mail que você usou para se cadastrar no Ghost Cap.
							</CardDescription>
						</div>
						<Input
							type="email"
							value={user?.email as string}
							id={contactEmailId}
							name="contactEmail"
							disabled
						/>
					</Card>
					<Card className="flex flex-col gap-4">
						<div className="space-y-1">
							<CardTitle>Organização padrão</CardTitle>
							<CardDescription>
								Esta é a organização padrão
							</CardDescription>
						</div>

						<Select
							placeholder="Organização padrão"
							value={
								defaultOrgId ??
								user?.defaultOrgId ??
								organizationData?.[0]?.organization.id ??
								""
							}
							onValueChange={(value) =>
								setDefaultOrgId(Organisation.OrganisationId.make(value))
							}
							options={(organizationData || []).map((org) => ({
								value: org.organization.id,
								label: org.organization.name,
								image: (
									<SignedImageUrl
										className="size-5"
										image={org.organization.iconUrl}
										name={org.organization.name}
									/>
								),
							}))}
						/>
					</Card>
				</div>
				<Button
					disabled={!firstName || updateNamePending || !hasChanges}
					className="mt-6"
					type="submit"
					size="sm"
					variant="dark"
					spinner={updateNamePending}
				>
					{updateNamePending ? "Salvando..." : "Salvar"}
				</Button>
			</form>
			<Card className="flex flex-col gap-4 mt-6 md:flex-row md:items-center md:justify-between">
				<div className="space-y-1">
					<CardTitle>Encerrar sessão em todos os dispositivos</CardTitle>
					<CardDescription>
						Invalida toda sessão web, token de autenticação do app desktop e
						chave de API do CLI conectados à sua conta.
					</CardDescription>
				</div>
				<Button
					type="button"
					size="sm"
					variant="destructive"
					icon={<LogOut className="size-4" />}
					onClick={() => setSignOutAllDevicesOpen(true)}
				>
					Encerrar em todos os dispositivos
				</Button>
			</Card>
			<Dialog
				open={signOutAllDevicesOpen}
				onOpenChange={setSignOutAllDevicesOpen}
			>
				<DialogContent>
					<DialogHeader
						icon={<LogOut className="size-4" />}
						description="Isso invalida imediatamente as sessões web, tokens de sessão do desktop, chaves de API do desktop e do CLI da sua conta."
					>
						<DialogTitle>Encerrar sessão em todos os dispositivos?</DialogTitle>
					</DialogHeader>
					<div className="p-5 space-y-3 text-sm text-gray-11">
						<p>
							Sua sessão neste navegador também será encerrada após a redefinição.
						</p>
						<p>
							O app desktop do Ghost Cap pode pedir que você clique em Sair e
							entre novamente para que uploads e configurações voltem a sincronizar.
						</p>
					</div>
					<DialogFooter>
						<Button
							type="button"
							size="sm"
							variant="gray"
							onClick={() => setSignOutAllDevicesOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							type="button"
							size="sm"
							variant="destructive"
							icon={<LogOut className="size-4" />}
							onClick={() => signOutAllDevicesMutation.mutate()}
							spinner={signOutAllDevicesMutation.isPending}
							disabled={signOutAllDevicesMutation.isPending}
						>
							{signOutAllDevicesMutation.isPending
								? "Encerrando..."
								: "Encerrar em todos os dispositivos"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
