import { askAnswers } from "../prompt";
import type {
	PromptPack,
	PromptContext,
	PromptQuestion,
	ChoiceOption,
	PromptResult,
} from "@appinit/types";

export const gitPack: PromptPack = {
	name: "git",
	priority: 80,

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const prev = ctx.config ?? {};
		const ai = ctx.hooks;

		const nonInteractive = flags["non-interactive"] || ctx.runtime === "api";

		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (nonInteractive) {
			return {
				initGit: flags.initGit ?? prev.initGit ?? accum.initGit ?? true,
				createRemote:
					flags.createRemote ??
					prev.createRemote ??
					accum.createRemote ??
					false,
				remoteOrg: flags.remoteOrg ?? prev.remoteOrg ?? accum.remoteOrg ?? null,
				repoVisibility:
					flags.repoVisibility ??
					prev.repoVisibility ??
					accum.repoVisibility ??
					"public",
				setupCI: flags.setupCI ?? prev.setupCI ?? accum.setupCI ?? false,
				ciProvider:
					flags.ciProvider ??
					prev.ciProvider ??
					accum.ciProvider ??
					"github-actions",
				setupCD: flags.setupCD ?? prev.setupCD ?? accum.setupCD ?? false,
			};
		}

		// ----------------------------------------------------
		// INTERACTIVE MODE
		// ----------------------------------------------------
		const questions: PromptQuestion[] = [];

		// → initGit
		if (flags.initGit === undefined) {
			questions.push({
				type: "confirm",
				name: "initGit",
				message: "🐙 Initialize a Git repository?",
				initial: accum.initGit ?? prev.initGit ?? true,
			});
		} else {
			accum.initGit = flags.initGit;
		}

		// → createRemote
		questions.push({
			type: "confirm",
			name: "createRemote",
			message: "📦 Create a remote GitHub/GitLab/Bitbucket repo?",
			when: (a: PromptResult) => a.initGit === true,
			initial:
				flags.createRemote ?? prev.createRemote ?? accum.createRemote ?? false,
		});

		// → remoteOrg
		questions.push({
			type: "text",
			name: "remoteOrg",
			message: "🏢 Organization (optional):",
			when: (a: PromptResult) => a.initGit && a.createRemote,
			initial: flags.remoteOrg ?? prev.remoteOrg ?? accum.remoteOrg ?? "",
			format: (v: string) => (v ? v : null),
		});

		// → repoVisibility
		questions.push({
			type: "select",
			name: "repoVisibility",
			message: "🔒 Repository visibility:",
			when: (a: PromptResult) => a.initGit && a.createRemote,
			choices: [
				{ label: "Public", value: "public" },
				{ label: "Private", value: "private" },
				{ label: "Internal (GitLab)", value: "internal" },
			] as ChoiceOption[],
			initial:
				flags.repoVisibility ??
				prev.repoVisibility ??
				accum.repoVisibility ??
				"public",
		});

		// → setup CI?
		questions.push({
			type: "confirm",
			name: "setupCI",
			message: "⚙️ Setup CI/CD?",
			when: (a: PromptResult) => a.initGit && a.createRemote,
			initial: flags.setupCI ?? prev.setupCI ?? accum.setupCI ?? false,
		});

		// → CI Provider
		questions.push({
			type: "select",
			name: "ciProvider",
			message: "🚀 Choose CI provider:",
			when: (a: PromptResult) => a.setupCI === true,
			choices: [
				{ label: "GitHub Actions", value: "github-actions" },
				{ label: "GitLab CI", value: "gitlab-ci" },
				{ label: "Vercel", value: "vercel" },
				{ label: "Netlify", value: "netlify" },
				{ label: "AWS Pipeline", value: "aws-pipeline" },
				{ label: "None", value: "none" },
			] as ChoiceOption[],
			initial:
				flags.ciProvider ??
				prev.ciProvider ??
				accum.ciProvider ??
				"github-actions",
		});

		// → setupCD
		questions.push({
			type: "confirm",
			name: "setupCD",
			message: "🚚 Enable CD (continuous deployment)?",
			when: (a: PromptResult) =>
				a.setupCI === true && ["vercel", "netlify"].includes(a.ciProvider),
			initial: flags.setupCD ?? prev.setupCD ?? accum.setupCD ?? false,
		});

		// ASK
		const result = await askAnswers(questions, accum, ctx);

		return result;
	},
};
