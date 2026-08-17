import { Button } from "@cap/ui";
import { Organisation } from "@cap/web-domain";
import {
	faCheckCircle,
	faExclamationCircle,
	faGlobe,
	faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { removeOrganizationDomain } from "@/actions/organization/remove-domain";
import { Tooltip } from "@/components/Tooltip";
import { UpgradeModal } from "@/components/UpgradeModal";
import { ConfirmationDialog } from "../../../_components/ConfirmationDialog";
import { useDashboardContext } from "../../../Contexts";
import CustomDomainDialog from "./CustomDomainDialog/CustomDomainDialog";

export function CustomDomain() {
	const router = useRouter();
	const { activeOrganization, user } = useDashboardContext();
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);
	const [showCustomDomainDialog, setShowCustomDomainDialog] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [isVerified, setIsVerified] = useState(
		!!activeOrganization?.organization.domainVerified,
	);

	const orgCustomDomain = activeOrganization?.organization.customDomain;

	const removeDomainMutation = useMutation({
		mutationFn: (organizationId: string) =>
			removeOrganizationDomain(
				Organisation.OrganisationId.make(organizationId),
			),
		onSuccess: () => {
			setIsVerified(false);
			toast.success("Domínio personalizado removido");
			router.refresh();
			setConfirmOpen(false);
		},
		onError: () => {
			toast.error("Falha ao remover o domínio");
			setConfirmOpen(false);
		},
	});

	const handleRemoveDomain = () => {
		if (!user.isPro) {
			setShowUpgradeModal(true);
			return;
		}

		if (activeOrganization?.organization.id) {
			removeDomainMutation.mutate(activeOrganization.organization.id);
		}
	};

	return (
		<>
			{showCustomDomainDialog && (
				<CustomDomainDialog
					isVerified={isVerified}
					setIsVerified={setIsVerified}
					open={showCustomDomainDialog}
					setShowUpgradeModal={(arg) => setShowUpgradeModal(arg)}
					onClose={() => setShowCustomDomainDialog(false)}
				/>
			)}
			<ConfirmationDialog
				open={confirmOpen}
				title="Remover domínio personalizado"
				icon={<FontAwesomeIcon icon={faGlobe} />}
				description={`Tem certeza que deseja remover o domínio personalizado: ${orgCustomDomain}?`}
				onConfirm={handleRemoveDomain}
				confirmLabel={removeDomainMutation.isPending ? "Removendo..." : "Remover"}
				cancelLabel="Cancelar"
				loading={removeDomainMutation.isPending}
				onCancel={() => setConfirmOpen(false)}
			/>
			<div className="flex flex-col flex-1 gap-3 justify-between w-full md:flex-row md:items-center h-fit">
				<div className="space-y-4 w-full">
					<div
						className={clsx(
							"flex flex-col md:flex-row gap-3 md:items-center",
							(isVerified && orgCustomDomain) ||
								(!isVerified && orgCustomDomain)
								? "mb-3"
								: "mb-0",
						)}
					>
						<div className="flex flex-col gap-1">
							<h1 className="text-sm font-medium text-gray-12">
								Domínio personalizado
							</h1>
							<p className="w-full text-sm text-gray-10">
								Configure um domínio personalizado para as gravações compartilhadas da sua organização.
							</p>
						</div>
					</div>
					<div className="flex flex-1 gap-2 justify-between items-center w-full">
						<div className="flex gap-2 justify-between items-center px-3 flex-1 h-[44px] rounded-xl border bg-gray-2 border-gray-3">
							<p className="text-[13px] text-gray-8">
								{orgCustomDomain || "Nenhum domínio personalizado configurado"}
							</p>
							<div className="flex items-center">
								{orgCustomDomain && isVerified ? (
									<Tooltip content="Verificado">
										<div className="flex gap-2 items-center p-2 h-full text-xs rounded-full w-fit text-gray-10">
											<FontAwesomeIcon
												className="text-green-500 size-5"
												icon={faCheckCircle}
											/>
										</div>
									</Tooltip>
								) : (
									orgCustomDomain &&
									!isVerified && (
										<Tooltip content="Configuração incompleta">
											<div className="flex gap-2 items-center p-2 h-full text-xs rounded-full w-fit text-gray-10">
												<FontAwesomeIcon
													className="text-red-500 size-5"
													icon={faExclamationCircle}
												/>
											</div>
										</Tooltip>
									)
								)}

								{orgCustomDomain && (
									<Tooltip content="Remover domínio personalizado">
										<div
											onClick={(e) => {
												e.preventDefault();
												setConfirmOpen(true);
											}}
											className="flex justify-center items-center text-xs rounded-full border transition-colors duration-200 cursor-pointer hover:bg-gray-8 hover:border-gray-9 size-5 bg-gray-6 border-gray-7"
										>
											<FontAwesomeIcon
												icon={faX}
												className="text-gray-12 size-[10px]"
											/>
										</div>
									</Tooltip>
								)}
							</div>
						</div>

						{!isVerified && (
							<Button
								type="submit"
								size="sm"
								className="min-w-fit"
								variant="dark"
								onClick={(e) => {
									e.preventDefault();
									setShowCustomDomainDialog(true);
								}}
							>
								Configurar
							</Button>
						)}
					</div>
				</div>
			</div>

			{showUpgradeModal && (
				<UpgradeModal
					open={showUpgradeModal}
					onOpenChange={setShowUpgradeModal}
				/>
			)}
		</>
	);
}
