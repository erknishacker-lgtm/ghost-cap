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

export function DownloadLink({ email = "" }: { email: string }) {
	return (
		<Html>
			<Head />
			<Preview>Baixe o Ghost Cap — a alternativa ao Loom</Preview>
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
							Seus links de download do Ghost Cap chegaram
						</Heading>
						<Text className="text-sm leading-6 text-black">
							Obrigado pelo interesse no Ghost Cap! Aqui estão os links de
							download para cada plataforma:
						</Text>

						<Section className="my-6">
							<table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
								<tr>
									<td style={{ paddingBottom: "12px" }}>
										<Link
											className="block w-full rounded-lg bg-black px-6 py-3 text-center text-[13px] font-semibold text-white no-underline"
											href="https://cap.so/download/apple-silicon"
										>
											Baixar para Mac (Apple Silicon)
										</Link>
									</td>
								</tr>
								<tr>
									<td style={{ paddingBottom: "12px" }}>
										<Link
											className="block w-full rounded-lg border border-solid border-gray-300 bg-white px-6 py-3 text-center text-[13px] font-semibold text-black no-underline"
											href="https://cap.so/download/apple-intel"
										>
											Baixar para Mac (Intel)
										</Link>
									</td>
								</tr>
								<tr>
									<td>
										<Link
											className="block w-full rounded-lg border border-solid border-gray-300 bg-white px-6 py-3 text-center text-[13px] font-semibold text-black no-underline"
											href="https://cap.so/download/windows"
										>
											Baixar para Windows
										</Link>
									</td>
								</tr>
							</table>
						</Section>

						<Text className="text-sm leading-6 text-black mt-4">
							O Ghost Cap é uma alternativa ao Loom. Gravações de tela
							bonitas e compartilháveis — leves, poderosas e focadas em privacidade.
						</Text>
						<Footer email={email} marketing={true} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
