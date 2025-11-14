import type { PromptPack } from "@appinit/types";
import { askText, askConfirm, askSelect } from "../helpers";

export const gitPack: PromptPack = {
	name: "git",
	priority: 10,

	async handler(ctx, accum) {
		const r: Partial<Record<string, any>> = {};

		// Git init
		r.initGit = await askConfirm("🐙 Initialize a Git repository?", true);

		// Remote repo
		if (r.initGit) {
			r.createRemote = await askConfirm(
				"📦 Create a remote GitHub repository?",
				false,
			);

			if (r.createRemote) {
				r.remoteOrg = await askText(
					"🏢 GitHub organization (optional):",
					ctx.flags.remoteOrg ?? "",
				);

				r.repoVisibility = await askSelect("🔒 Visibility:", [
					{ label: "Public", value: "public" },
					{ label: "Private", value: "private" },
				]);

				r.setupCI = await askConfirm("⚙️ Setup CI/CD?", false);

				if (r.setupCI) {
					r.ciProvider = await askSelect("🚀 CI provider:", [
						{ label: "Vercel", value: "vercel" },
						{ label: "Netlify", value: "netlify" },
						{ label: "GitHub Actions", value: "github-actions" },
						{ label: "None", value: "none" },
					]);
				}
			}
		}

		return r;
	},
};
