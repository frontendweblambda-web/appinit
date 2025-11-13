import { makeTempDir, readJson } from "../utils";
import { ResolvedTemplate } from "@appinit/types";
import path from "node:path";
import fs from "node:fs/promises";
import { logger } from "@appinit/utils";
/**
 * The internal Appinit registry is organization-specific. This resolver assumes
 * an environment variable APPINIT_REGISTRY_API or a configured endpoint is available.
 * Registry locators look like: registry:org/component-name@1.2.0
 */

export async function resolveRegistry(
	locator: string,
): Promise<ResolvedTemplate> {
	const api = process.env.APPINIT_REGISTRY_API;
	if (!api)
		throw new Error(
			"APPINIT_REGISTRY_API not configured for registry templates",
		);

	const withoutPrefix = locator.replace(/^registry:/, "");
	// possible @version
	const [name] = withoutPrefix.split("@");

	const temp = await makeTempDir();

	logger.step(`Fetching template ${name} from registry: ${api}`);

	const res = await fetch(`${api}/templates/${encodeURIComponent(name)}`);
	if (!res.ok) throw new Error(`Registry error: ${res.status}`);

	// registry returns a tarball
	const arrayBuffer = await res.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const tarballPath = path.join(temp, "registry.tgz");
	await fs.writeFile(tarballPath, buffer);

	const tar = await import("tar");
	await tar.x({ file: tarballPath, cwd: temp });

	const meta = await findTemplateJson(temp);

	return { source: "registry", sourceLocator: locator, tempDir: temp, meta };
}

async function findTemplateJson(folder: string) {
	const entries = await fs.readdir(folder, { withFileTypes: true });
	for (const e of entries) {
		const p = path.join(folder, e.name);
		if (e.isFile() && e.name === "template.json")
			return JSON.parse(await fs.readFile(p, "utf8"));
		if (e.isDirectory()) {
			const found = await findTemplateJson(p);
			if (found) return found;
		}
	}
	return null;
}
