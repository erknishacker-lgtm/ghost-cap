import { redirect } from "next/navigation";

// This used to list release history pulled from the upstream Cap GitHub
// repo -- we don't ship our own desktop builds, so there's nothing of ours
// to show here.
export default function VersionsPage() {
	redirect("/download");
}
