type AuthOptionValue = "none" | "jwt" | "oauth2" | "clerk" | "supabase";
export function determineAuthChoices(
	framework: Framework,
	db: Database,
): ChoiceOption[] {
	const allowedByFramework =
		FRAMEWORK_SUPPORT[framework as keyof typeof FRAMEWORK_SUPPORT] ??
		FRAMEWORK_SUPPORT.default;

	const allowedByDatabase =
		DATABASE_SUPPORT[db as keyof typeof DATABASE_SUPPORT] ??
		DATABASE_SUPPORT.default;

	const intersect = allowedByFramework.filter((x: AuthOptionValue) =>
		allowedByDatabase.includes(x as any),
	);

	return AUTH_OPTIONS.filter((choice) => intersect.includes(choice.value));
}

import type { Framework, Database, ChoiceOption } from "@appinit/types";

const AUTH_OPTIONS: ChoiceOption[] = [
	{ label: "None", value: "none" },
	{ label: "JWT", value: "jwt" },
	{ label: "OAuth2", value: "oauth2" },
	{ label: "Clerk", value: "clerk" },
	{ label: "Supabase Auth", value: "supabase" },
];

const FRAMEWORK_SUPPORT = {
	next: ["none", "jwt", "oauth2", "clerk", "supabase"],
	express: ["none", "jwt", "oauth2", "supabase"], // clerk less useful
	fastify: ["none", "jwt", "oauth2", "supabase"],
	hono: ["none", "jwt", "oauth2", "supabase"],
	react: ["none", "clerk", "oauth2", "jwt"],
	vue: ["none", "oauth2", "jwt", "supabase"],
	svelte: ["none", "oauth2", "jwt", "supabase"],
	default: ["none", "jwt"],
} as const;

const DATABASE_SUPPORT = {
	none: ["none", "jwt"],
	postgres: ["none", "jwt", "oauth2", "supabase"],
	mysql: ["none", "jwt", "oauth2"],
	sqlite: ["none", "jwt"],
	mongo: ["none", "jwt", "oauth2"],
	supabase: ["none", "supabase"], // fully managed auth
	default: ["none", "jwt"],
} as const;
