import { makeTempDir, readJson } from "../utils";
import { ResolvedTemplate } from "@appinit/types";
import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const exec = promisify(_exec);

/** locator examples:
 * github:org/repo
 * github:org/repo#branch
 * git+https://github.com/org/repo.git
 */
export async function resolveGitHub(
	locator: string,
): Promise<ResolvedTemplate> {
	// parse locator
	const withoutPrefix = locator.replace(/^github:/, "");
	const [repoPart, ref] = withoutPrefix.split("#");
	const repoUrl = `https://github.com/${repoPart}.git`;

	const temp = await makeTempDir();

	// clone shallow
	const refArg = ref ? `--branch ${ref}` : "--depth 1";
	// if ref provided use --branch (this shallow clones the branch)
	await exec(
		`git clone ${repoUrl} ${temp} ${ref ? `--branch ${ref}` : "--depth 1"}`,
	);

	const meta = await readJson(path.join(temp, "template.json"));

	return { source: "github", sourceLocator: locator, tempDir: temp, meta };
}
