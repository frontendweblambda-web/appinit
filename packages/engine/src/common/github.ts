import { Octokit } from "@octokit/rest";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import chalk from "chalk";
import { spinner } from "@clack/prompts";
import { color, runCommand, theme } from "@appinit/core";

export const createGitHubRepo = async ({
	projectName,
	visibility = "public",
	org,
	cwd,
}: {
	projectName: string;
	visibility: "public" | "private";
	org?: string | null;
	cwd: string;
}) => {
	const s = spinner();
	s.start("Authenticating with GitHub...");

	try {
		const clientId = "Iv1.1234567890abcdef"; // replace with your actual GitHub OAuth App ID

		const auth = createOAuthDeviceAuth({
			clientType: "oauth-app",
			clientId,
			scopes: ["repo"],
			onVerification(verification) {
				s.stop();
				console.log(chalk.yellowBright(`\n🔑 Please complete authentication:`));
				console.log(chalk.cyan(`👉 ${verification.verification_uri}`));
				console.log(chalk.gray(`Your code: ${verification.user_code}\n`));
			},
		});

		const tokenAuth = await auth({ type: "oauth" });
		s.message("✅ Authenticated with GitHub!");

		const octokit = new Octokit({ auth: tokenAuth.token });

		s.message("📦 Creating repository on GitHub...");
		let repo;

		if (org) {
			repo = await octokit.repos.createInOrg({
				org,
				name: projectName,
				private: visibility === "private",
			});
		} else {
			repo = await octokit.repos.createForAuthenticatedUser({
				name: projectName,
				private: visibility === "private",
			});
		}

		s.message(
			`✅ GitHub repository created: ${theme.info(repo.data.html_url)}`,
		);

		// Link local repo → remote
		await runCommand("git", ["remote", "add", "origin", repo.data.ssh_url], {
			cwd,
		});
		await runCommand("git", ["branch", "-M", "main"], { cwd });
		await runCommand("git", ["push", "-u", "origin", "main"], { cwd });

		console.log(color.success("\n🚀 Pushed initial commit to GitHub!\n"));
		s.stop();
		return repo.data.html_url;
	} catch (error: any) {
		s.stop("❌ GitHub repo creation failed");
		console.error(error.message || error);
		return null;
	}
};
