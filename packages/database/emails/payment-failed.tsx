import { CAP_LOGO_URL } from "@cap/utils";
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import Footer from "./components/Footer";

export function PaymentFailed({
	email = "",
	billingUrl = "",
	nextRetryDate = null,
	finalAttempt = false,
}: {
	email: string;
	billingUrl: string;
	nextRetryDate?: string | null;
	finalAttempt?: boolean;
}) {
	return (
		<Html>
			<Head />
			<Preview>
				{finalAttempt
					? "Sua assinatura Ghost Cap Pro será cancelada se não conseguirmos cobrar o pagamento"
					: "Não conseguimos cobrar seu pagamento do Ghost Cap Pro. Seu acesso continua normal enquanto tentamos de novo."}
			</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-gray-1 font-sans">
					<Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
						<Section className="mt-8">
							<Img
								src={CAP_LOGO_URL}
								width="40"
								height="40"
								alt="Ghost Cap"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
							{finalAttempt
								? "Última chance de manter o Ghost Cap Pro"
								: "Seu pagamento não foi processado"}
						</Heading>
						<Text className="text-sm leading-6 text-black">
							Tentamos cobrar seu cartão pelo Ghost Cap Pro, mas o pagamento falhou.
							Isso geralmente é um cartão vencido ou uma recusa pontual do banco.
						</Text>
						{finalAttempt ? (
							<Text className="text-sm leading-6 text-black">
								Esta foi nossa última tentativa automática. Se o pagamento não
								puder ser cobrado, sua assinatura será cancelada e você perderá
								recursos Pro como gravação sem limite de tempo, Ghost Cap AI e
								domínios personalizados.
							</Text>
						) : (
							<Text className="text-sm leading-6 text-black">
								Seus recursos Pro continuam ativos
								{nextRetryDate
									? `, e tentaremos cobrar novamente em ${nextRetryDate}`
									: ", e tentaremos novamente automaticamente"}
								. A forma mais rápida de resolver é atualizar sua forma de pagamento:
							</Text>
						)}
						<Section className="my-8 text-center">
							<Link
								className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
								href={billingUrl}
							>
								Atualizar forma de pagamento
							</Link>
						</Section>
						<Text className="text-sm leading-6 text-black">
							Se você já atualizou seu cartão, pode ignorar este e-mail.
							Responda se algo parecer errado que resolvemos.
						</Text>
						<Footer email={email} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
