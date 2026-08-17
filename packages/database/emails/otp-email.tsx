import { CAP_LOGO_URL } from "@cap/utils";
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import Footer from "./components/Footer";

export function OTPEmail({
	email = "",
	code = "",
}: {
	email: string;
	code: string;
}) {
	return (
		<Html>
			<Head />
			<Preview>Seu código de verificação Ghost Cap: {code}</Preview>
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
							Seu código de verificação
						</Heading>
						<Text className="text-sm leading-6 text-black">
							Bem-vindo ao Ghost Cap!
						</Text>
						<Text className="text-sm leading-6 text-black">
							Use o código de verificação abaixo para entrar na sua conta:
						</Text>
						<Section className="my-8 text-center">
							<div className="rounded-lg bg-gray-100 px-8 py-6">
								<Text className="m-0 text-3xl font-bold tracking-wider text-black">
									{code}
								</Text>
							</div>
						</Section>
						<Text className="text-sm leading-6 text-black">
							Este código expira em 10 minutos. Se você não solicitou este
							código, pode ignorar este e-mail com segurança.
						</Text>
						<Footer email={email} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
