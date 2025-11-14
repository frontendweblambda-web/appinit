/* ────────────────────────────────────────────────
   AppInit Auth Types (V2)
   Framework-aware, Project-type–aware authentication
   FRONTEND | BACKEND | FULLSTACK
────────────────────────────────────────────────── */

// -------------------------------------------------
// 🔐 Base Config Types (Shared building blocks)
// -------------------------------------------------

export interface TokenConfig {
	expiration?: string; // "15m", "1h", "7d"
	refreshExpiration?: string;
	issuer?: string;
	secret?: string | null;
}

export interface PasswordPolicy {
	minLength?: number;
	requireNumbers?: boolean;
	requireSymbols?: boolean;
	requireUppercase?: boolean;
	requireLowercase?: boolean;
}

export interface RBAC {
	enabled?: boolean;
	roles?: string[];
	defaultRole?: string;
}

export interface MultiTenantConfig {
	enabled?: boolean;
	orgRoles?: string[];
	orgRequired?: boolean;
}

export interface EmailAuthConfig {
	enabled?: boolean;
	magicLink?: boolean;
	emailPassword?: boolean;
}

export interface TwoFactorAuth {
	enabled?: boolean;
	otp?: boolean;
	sms?: boolean;
	authenticatorApp?: boolean;
	webAuthn?: boolean;
}

// -------------------------------------------------
// 🔵 Clerk
// -------------------------------------------------
export interface ClerkConfig {
	instanceUrl?: string;
	secretKey?: string | null;
	publishableKey?: string | null;
	organization?: MultiTenantConfig;
}

// -------------------------------------------------
// 🔵 Auth.js (server)
// -------------------------------------------------
export interface AuthJSConfig {
	session?: "jwt" | "database" | "server";
	providers?: OAuthProvider[];
	database?: boolean;
	email?: EmailAuthConfig;
	token?: TokenConfig;
}

// -------------------------------------------------
// 🔵 Auth.js (client SDK)
// -------------------------------------------------
export interface AuthJSClientConfig {
	providers?: OAuthProvider[];
	email?: EmailAuthConfig;
}

// -------------------------------------------------
// 🔵 Supabase Auth
// -------------------------------------------------
export interface SupabaseAuthConfig {
	url?: string;
	publicKey?: string | null;
	secretKey?: string | null;
	oauth?: OAuthProvider[];
	email?: EmailAuthConfig;
	rbac?: RBAC;
}

// -------------------------------------------------
// 🔵 Firebase Auth
// -------------------------------------------------
export interface FirebaseAuthConfig {
	appId?: string;
	apiKey?: string;
	projectId?: string;
	messagingSenderId?: string;

	email?: EmailAuthConfig;
	oauth?: OAuthProvider[];
	phoneAuth?: boolean;
}

// -------------------------------------------------
// 🔵 AWS Cognito Auth
// -------------------------------------------------
export interface CognitoAuthConfig {
	userPoolId?: string;
	clientId?: string;
	region?: string;

	oauth?: OAuthProvider[];
	mfa?: TwoFactorAuth;
}

// -------------------------------------------------
// 🔵 Magic.link Auth
// -------------------------------------------------
export interface MagicAuthConfig {
	apiKey?: string;
	magicLink?: boolean;
}

// -------------------------------------------------
// 🔵 Custom JWT (Backend / Fullstack)
// -------------------------------------------------
export interface CustomAuthConfig {
	jwt?: TokenConfig;
	passwordPolicy?: PasswordPolicy;

	rbac?: RBAC;
	multiTenant?: MultiTenantConfig;

	email?: EmailAuthConfig;
	twoFactor?: TwoFactorAuth;
}

// -------------------------------------------------
// 🔵 OAuth Server (Backend)
// -------------------------------------------------
export interface OAuthServerConfig {
	issuer?: string;
	token?: TokenConfig;
	providers?: OAuthProvider[];
}

// -------------------------------------------------
// 🔵 API Key Provider (Backend)
// -------------------------------------------------
export interface ApiKeyAuthConfig {
	headerName?: string; // e.g. "x-api-key"
	required?: boolean;
}

// -------------------------------------------------
// 🔵 Basic Auth (Backend)
// -------------------------------------------------
export interface BasicAuthConfig {
	username?: string;
	password?: string;
}

// -------------------------------------------------
// 🌐 OAuth Providers
// -------------------------------------------------
export type OAuthProvider =
	| "google"
	| "github"
	| "facebook"
	| "twitter"
	| "azure"
	| "discord"
	| "apple"
	| "linkedin"
	| "spotify"
	| "reddit"
	| "twitch"
	| "gitlab";

// =================================================
//  FRONTEND AUTH OPTIONS (React, Vue, Svelte, etc.)
// =================================================

export type FrontendAuthProvider =
	| "clerk"
	| "firebase"
	| "authjs-client"
	| "magic"
	| "none";

export type FrontendAuthOptions =
	| { auth: "clerk"; authConfig?: ClerkConfig }
	| { auth: "firebase"; authConfig?: FirebaseAuthConfig }
	| { auth: "authjs-client"; authConfig?: AuthJSClientConfig }
	| { auth: "magic"; authConfig?: MagicAuthConfig }
	| { auth: "none"; authConfig?: undefined };

// =================================================
//  BACKEND AUTH OPTIONS (Node / Bun / Deno APIs)
// =================================================

export type BackendAuthProvider =
	| "custom-jwt"
	| "oauth-server"
	| "api-key"
	| "basic"
	| "none";

export type BackendAuthOptions =
	| { auth: "custom-jwt"; authConfig?: CustomAuthConfig }
	| { auth: "oauth-server"; authConfig?: OAuthServerConfig }
	| { auth: "api-key"; authConfig?: ApiKeyAuthConfig }
	| { auth: "basic"; authConfig?: BasicAuthConfig }
	| { auth: "none"; authConfig?: undefined };

// =================================================
//  FULLSTACK AUTH OPTIONS (Next, Remix, SvelteKit)
// =================================================

export type FullstackAuthProvider =
	| "clerk"
	| "authjs"
	| "supabase"
	| "firebase"
	| "magic"
	| "cognito"
	| "custom-jwt"
	| "none";

export type FullstackAuthOptions =
	| { auth: "clerk"; authConfig?: ClerkConfig }
	| { auth: "authjs"; authConfig?: AuthJSConfig }
	| { auth: "supabase"; authConfig?: SupabaseAuthConfig }
	| { auth: "firebase"; authConfig?: FirebaseAuthConfig }
	| { auth: "magic"; authConfig?: MagicAuthConfig }
	| { auth: "cognito"; authConfig?: CognitoAuthConfig }
	| { auth: "custom-jwt"; authConfig?: CustomAuthConfig }
	| { auth: "none"; authConfig?: undefined };

// =================================================
//  CONDITIONAL AUTH OPTIONS BASED ON PROJECT TYPE
// =================================================
//
// type ProjectType = "frontend" | "backend" | "fullstack" | "library" | "cli";
// (From BaseAnswers["type"])
//
export type AuthOptions<ProjectType extends string> =
	ProjectType extends "frontend"
		? FrontendAuthOptions
		: ProjectType extends "backend"
			? BackendAuthOptions
			: ProjectType extends "fullstack"
				? FullstackAuthOptions
				: { auth: "none"; authConfig?: undefined };
