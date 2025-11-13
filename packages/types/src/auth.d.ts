export interface AuthOptions {
	auth: boolean;
	authProvider?:
		| "nextauth"
		| "clerk"
		| "supabase"
		| "auth0"
		| "firebase"
		| "cognito"
		| "custom"
		| "none";
	authMode?: "jwt" | "session" | "oauth" | "token" | "hybrid";
	oauthProviders?: (
		| "google"
		| "github"
		| "discord"
		| "facebook"
		| "twitter"
		| "cognito"
	)[];
	roles?: boolean;
}
