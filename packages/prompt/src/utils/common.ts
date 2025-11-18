export function determineAuthChoices({
	framework,
	db,
}: {
	framework: string;
	db: string;
}) {
	const shared = [
		{ label: "None", value: "none" },
		{ label: "JWT", value: "jwt" },
		{ label: "OAuth2", value: "oauth2" },
		{ label: "Clerk", value: "clerk" },
		{ label: "Supabase Auth", value: "supabase" },
	];

	// Example future business logic:
	if (db === "none" && framework !== "next") {
		return shared.filter((x) => ["none", "jwt"].includes(x.value));
	}

	return shared;
}
