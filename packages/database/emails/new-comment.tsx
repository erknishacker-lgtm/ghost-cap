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

export function NewComment({
	email = "",
	url = "",
	videoName = "",
	commenterName = "",
	commentContent = "",
	manageNotificationsUrl,
}: {
	email: string;
	url: string;
	videoName: string;
	commenterName: string;
	commentContent: string;
	manageNotificationsUrl?: string;
}) {
	return (
		<Html>
			<Head />
			<Preview>Novo comentário na sua gravação: {videoName}</Preview>
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
							Novo comentário na sua gravação
						</Heading>
						<Text className="text-sm leading-6 text-black">
							{commenterName} deixou um comentário na sua gravação "{videoName}":
						</Text>
						<Section className="my-4 p-4 bg-gray-50 rounded-lg">
							<Text className="text-sm leading-6 text-gray-700 italic">
								"{commentContent}"
							</Text>
						</Section>
						<Text className="text-sm leading-6 text-black">
							Clique no botão abaixo para ver o comentário e responder.
						</Text>
						<Section className="my-8 text-center">
							<Link
								className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
								href={url}
							>
								Ver comentário
							</Link>
						</Section>
						<Text className="text-sm leading-6 text-black">
							ou copie e cole este link no seu navegador:
						</Text>
						<Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
							{url.replace(/^https?:\/\//, "")}
						</Text>
						<Footer
							email={email}
							manageNotificationsUrl={manageNotificationsUrl}
						/>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
