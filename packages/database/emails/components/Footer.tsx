import { Hr, Tailwind, Text } from "@react-email/components";

export default function Footer({
	email,
	marketing,
	manageNotificationsUrl,
}: {
	email: string;
	marketing?: boolean;
	manageNotificationsUrl?: string;
}) {
	return (
		<Tailwind>
			<Hr className="mx-0 my-6 w-full border border-gray-200" />
			{manageNotificationsUrl && (
				<Text className="text-[12px] leading-6 text-gray-500">
					Não quer mais receber essas notificações?{" "}
					<a href={manageNotificationsUrl} className="text-gray-600 underline">
						Desativar esta notificação
					</a>
					.
				</Text>
			)}
			{marketing ? (
				<Text className="text-[12px] leading-6 text-gray-500">
					Este e-mail foi enviado para{" "}
					<span className="text-black">{email}</span>. Se você não esperava
					este e-mail, pode ignorá-lo. Se não quiser mais receber
					e-mails como este,{" "}
					<a href="{{{RESEND_UNSUBSCRIBE_URL}}}" className="text-gray-600">
						clique aqui para cancelar
					</a>
					.
				</Text>
			) : (
				<Text className="text-[12px] leading-6 text-gray-500">
					Este e-mail foi enviado para{" "}
					<span className="text-black">{email}</span>. Se você não esperava
					este e-mail, pode ignorá-lo. Se estiver preocupado com a
					segurança da sua conta, responda este e-mail para falar com a gente.
				</Text>
			)}
		</Tailwind>
	);
}
