import { askAnswers } from "../prompt";
import type {
	PromptPack,
	PromptContext,
	PromptQuestion,
	ChoiceOption,
	PromptResult,
} from "@appinit/types";

// -------------------------------------------------------------
// Mapped providers by project type
// -------------------------------------------------------------
const FRONTEND_PROVIDERS: ChoiceOption[] = [
	{ label: "Clerk", value: "clerk" },
	{ label: "Firebase Auth", value: "firebase" },
	{ label: "Auth.js Client", value: "authjs-client" },
	{ label: "Magic.link", value: "magic" },
	{ label: "None", value: "none" },
];

const BACKEND_PROVIDERS: ChoiceOption[] = [
	{ label: "Custom JWT", value: "custom-jwt" },
	{ label: "OAuth2 Server", value: "oauth-server" },
	{ label: "API Key", value: "api-key" },
	{ label: "Basic Auth", value: "basic" },
	{ label: "None", value: "none" },
];

const FULLSTACK_PROVIDERS: ChoiceOption[] = [
	{ label: "Clerk", value: "clerk" },
	{ label: "Auth.js", value: "authjs" },
	{ label: "Supabase Auth", value: "supabase" },
	{ label: "Firebase Auth", value: "firebase" },
	{ label: "Magic.link", value: "magic" },
	{ label: "AWS Cognito", value: "cognito" },
	{ label: "Custom JWT", value: "custom-jwt" },
	{ label: "None", value: "none" },
];

// -------------------------------------------------------------
// Dynamic configs per provider
// -------------------------------------------------------------
function questionsForAuthConfig(provider: string): PromptQuestion[] {
	switch (provider) {
		case "clerk":
			return [
				{
					type: "text",
					name: "authConfig.instanceUrl",
					message: "🔑 Clerk Instance URL:",
					initial: "",
				},
				{
					type: "text",
					name: "authConfig.publishableKey",
					message: "🌐 Clerk Publishable Key:",
					initial: "",
				},
				{
					type: "text",
					name: "authConfig.secretKey",
					message: "🔐 Clerk Secret Key:",
					initial: "",
					format: (v: string) => v || null,
				},
			];

		case "firebase":
			return [
				{
					type: "text",
					name: "authConfig.apiKey",
					message: "🔑 Firebase API Key:",
				},
				{
					type: "text",
					name: "authConfig.projectId",
					message: "📦 Firebase Project ID:",
				},
				{
					type: "text",
					name: "authConfig.appId",
					message: "📱 Firebase App ID:",
				},
			];

		case "authjs-client":
			return [
				{
					type: "select",
					name: "authConfig.providers",
					message: "🔌 OAuth Providers:",
					choices: [
						{ label: "Google", value: "google" },
						{ label: "GitHub", value: "github" },
						{ label: "Discord", value: "discord" },
						{ label: "Twitter", value: "twitter" },
					],
				},
			];

		case "magic":
			return [
				{
					type: "text",
					name: "authConfig.apiKey",
					message: "🔑 Magic.link API Key:",
				},
			];

		case "custom-jwt":
			return [
				{
					type: "text",
					name: "authConfig.jwt.secret",
					message: "🔐 JWT Secret:",
				},
				{
					type: "text",
					name: "authConfig.jwt.expiration",
					message: "⏳ Access Token Expiration (e.g., 15m, 1h):",
					initial: "1h",
				},
			];

		case "oauth-server":
			return [
				{
					type: "text",
					name: "authConfig.issuer",
					message: "🏦 OAuth2 Issuer URL:",
				},
			];

		case "api-key":
			return [
				{
					type: "text",
					name: "authConfig.headerName",
					message: "🔑 API Key Header (e.g., x-api-key):",
					initial: "x-api-key",
				},
			];

		case "basic":
			return [
				{ type: "text", name: "authConfig.username", message: "👤 Username:" },
				{ type: "text", name: "authConfig.password", message: "🔐 Password:" },
			];

		case "supabase":
			return [
				{
					type: "text",
					name: "authConfig.url",
					message: "🌐 Supabase URL:",
				},
				{
					type: "text",
					name: "authConfig.publicKey",
					message: "🔑 Supabase Public API Key:",
				},
			];

		case "cognito":
			return [
				{
					type: "text",
					name: "authConfig.userPoolId",
					message: "🌀 AWS Cognito User Pool ID:",
				},
				{
					type: "text",
					name: "authConfig.clientId",
					message: "🔑 Cognito Client ID:",
				},
				{
					type: "text",
					name: "authConfig.region",
					message: "🌍 AWS Region:",
					initial: "us-east-1",
				},
			];

		default:
			return [];
	}
}

// -------------------------------------------------------------
// AUTH PACK — FINAL VERSION
// -------------------------------------------------------------
export const authPack: PromptPack = {
	name: "auth",
	priority: 50,

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const prev = ctx.config ?? {};
		const projectType = accum.type ?? flags.type;

		// ---------------------------------------------
		// NON-INTERACTIVE MODE
		// ---------------------------------------------
		if (flags["non-interactive"]) {
			return {
				auth: flags.auth ?? "none",
				authConfig: flags.authConfig ?? undefined,
			};
		}

		let providerChoices: ChoiceOption[];

		// ---------------------------------------------
		// ProjectType → Provider list
		// ---------------------------------------------
		switch (projectType) {
			case "frontend":
				providerChoices = FRONTEND_PROVIDERS;
				break;

			case "backend":
				providerChoices = BACKEND_PROVIDERS;
				break;

			case "fullstack":
				providerChoices = FULLSTACK_PROVIDERS;
				break;

			case "library":
			case "cli":
			default:
				// No auth for library/cli
				return { auth: "none" };
		}

		// ---------------------------------------------
		// STEP 1 — Select provider
		// ---------------------------------------------
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "auth",
					message: "🔐 Choose authentication provider:",
					choices: providerChoices,
					initial: accum.auth ?? "none",
				},
			],
			accum,
			ctx,
		);

		if (!base.auth || base.auth === "none") {
			return { auth: "none" };
		}

		// ---------------------------------------------
		// STEP 2 — Ask provider-specific config
		// ---------------------------------------------
		const authQuestions = questionsForAuthConfig(base.auth);

		if (authQuestions.length === 0) {
			return base; // no config required
		}

		const configAnswers = await askAnswers(
			authQuestions,
			{ ...accum, ...base },
			ctx,
		);

		return { ...base, authConfig: configAnswers.authConfig };
	},
};
