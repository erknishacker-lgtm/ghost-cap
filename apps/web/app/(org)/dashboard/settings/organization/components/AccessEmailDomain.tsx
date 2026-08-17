import { Button, Label } from "@cap/ui";
import type { Organisation } from "@cap/web-domain";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateOrganizationDetails } from "@/actions/organization/update-details";
import { useDashboardContext } from "../../../Contexts";

export const AccessEmailDomain = () => {
	const { activeOrganization } = useDashboardContext();
	const [emailDomain, setEmailDomain] = useState(
		activeOrganization?.organization.allowedEmailDomain || null,
	);
	const [saveLoading, setSaveLoading] = useState(false);
	const router = useRouter();

	const handleEmailDomainSave = async () => {
		try {
			setSaveLoading(true);
			await updateOrganizationDetails({
				allowedEmailDomain: emailDomain,
				organizationId: activeOrganization?.organization
					.id as Organisation.OrganisationId,
			});
			toast.success("Configurações atualizadas com sucesso");
			router.refresh();
		} catch (error) {
			console.error("Error updating settings:", error);
			toast.error("Ocorreu um erro ao atualizar as configurações");
		} finally {
			setSaveLoading(false);
		}
	};

	return (
		<div className="flex-1 space-y-4">
			<div className="space-y-1">
				<Label htmlFor="allowedEmailDomain">Restrição de acesso por e-mail</Label>
				<p className="text-sm text-gray-10">
					Restrinja quem pode acessar vídeos públicos "qualquer pessoa com o
					link". Adicione domínios de e-mail (ex.{" "}
					<code className="text-xs bg-gray-3 px-1 py-0.5 rounded">
						empresa.com
					</code>
					) ou e-mails específicos (ex.{" "}
					<code className="text-xs bg-gray-3 px-1 py-0.5 rounded">
						larry@google.com
					</code>
					), separados por vírgula.
				</p>
				<p className="text-sm text-gray-10">
					Membros da sua organização e espaços sempre podem acessar vídeos
					compartilhados com eles, independente dessa configuração.{" "}
					<span className="font-medium text-gray-11">
						Deixe em branco para permitir qualquer pessoa com o link.
					</span>
				</p>
			</div>
			<div className="flex flex-col gap-3 w-full h-fit">
				<textarea
					className="flex px-4 py-3 w-full font-thin transition-all duration-200 text-[16px] md:text-[13px] text-gray-12 bg-gray-1 border-gray-4 outline-0 focus:bg-gray-2 rounded-xl hover:bg-gray-2 border-[1px] focus:border-gray-5 placeholder:text-gray-8 ring-0 ring-gray-2 focus:ring-1 focus:ring-gray-12 focus:ring-offset-2 ring-offset-gray-3 hover:placeholder:text-gray-12 placeholder:duration-200 min-h-[72px] resize-y"
					placeholder="ex. empresa.com, parceiro.org, larry@google.com"
					value={emailDomain || ""}
					id="allowedEmailDomain"
					name="allowedEmailDomain"
					onChange={(e) => {
						setEmailDomain(e.target.value);
					}}
				/>
				<div>
					<Button
						className="min-w-fit"
						type="submit"
						spinner={saveLoading}
						size="sm"
						variant="dark"
						disabled={
							saveLoading ||
							emailDomain ===
								activeOrganization?.organization.allowedEmailDomain
						}
						onClick={handleEmailDomainSave}
					>
						{saveLoading ? null : "Salvar"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AccessEmailDomain;
