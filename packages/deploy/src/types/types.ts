export type DeployTarget = "vercel" | "netlify" | "aws" | "custom" | "none";

export interface DeployFile {
	name: string;
	content: string;
}
