import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const gitPack: PromptPack = {
	name: "git",

	handler: async (ctx: PromptContext, accum) => {
		// ---------------------------------------------------
		// 1. Non-interactive mode (CI, automation, flags)
		// ---------------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				initGit: ctx.flags.git ?? true,
				createRemote: ctx.flags.createRemote ?? false,
				remoteOrg: ctx.flags.remoteOrg ?? null,
				repoVisibility: ctx.flags.repoVisibility ?? "public",
				setupCI: ctx.flags.setupCI ?? false,
				ciProvider: ctx.flags.ciProvider ?? "none",
			};
		}

		// Pre-calc initial index for repoVisibility
		const visibilityOrder = ["public", "private"] as const;
		const visibilityIdx =
			visibilityOrder.indexOf(ctx.flags.repoVisibility) >= 0
				? visibilityOrder.indexOf(ctx.flags.repoVisibility)
				: 0;

		// ---------------------------------------------------
		// 2. Interactive prompts
		// ---------------------------------------------------
		const res = await askAnswers(
			[
				{
					type: "toggle",
					name: "initGit",
					message: "🐙 Initialize a Git repository?",
					initial: ctx.flags.git ?? true,
					active: "yes",
					inactive: "no",
				},
				{
					type: (prev) => (prev.initGit ? "toggle" : null),
					name: "createRemote",
					message: "📦 Create a remote GitHub repository?",
					initial: ctx.flags.createRemote ?? false,
					active: "yes",
					inactive: "no",
				},
				{
					type: (prev) => (prev.createRemote ? "text" : null),
					name: "remoteOrg",
					message: "🏢 GitHub organization (optional):",
					initial: ctx.flags.remoteOrg ?? "",
				},
				{
					type: (prev) => (prev.createRemote ? "select" : null),
					name: "repoVisibility",
					message: "🔒 Repository visibility:",
					choices: [
						{ title: "Public", value: "public" },
						{ title: "Private", value: "private" },
					],
					initial: visibilityIdx, // numeric index ✔
				},
				{
					type: (prev) => (prev.createRemote ? "toggle" : null),
					name: "setupCI",
					message: "⚙️ Setup CI/CD pipeline?",
					initial: ctx.flags.setupCI ?? false,
					active: "yes",
					inactive: "no",
				},
				{
					type: (prev) => (prev.setupCI ? "select" : null),
					name: "ciProvider",
					message: "🚀 Choose deployment target:",
					choices: [
						{ title: "Vercel", value: "vercel" },
						{ title: "Netlify", value: "netlify" },
						{ title: "GitHub Actions", value: "github-actions" },
						{ title: "None", value: "none" },
					],
					initial: 3, // "none"
				},
			],
			accum,
		);

		return res;
	},
};
