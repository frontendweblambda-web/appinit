import { makeTempDir, readJson } from "../utils";
import { ResolvedTemplate } from "@appinit/types";
import path from "node:path";
import fs from "node:fs/promises";
import { logger } from "@appinit/utils";

/**
 * Marketplace locator: market:slug@version
 * Marketplace API must be configured via APPINIT_MARKETPLACE_API env
 */
export async function resolveMarket(
	locator: string,
): Promise<ResolvedTemplate> {
	const api = process.env.APPINIT_MARKETPLACE_API;
	if (!api)
		throw new Error(
			"APPINIT_MARKETPLACE_API not configured for marketplace templates",
		);

	const withoutPrefix = locator.replace(/^market:/, "");
	const [slug] = withoutPrefix.split("@");

	const temp = await makeTempDir();
	logger.step(`Downloading marketplace template ${slug} from ${api}`);

	const res = await fetch(
		`${api}/templates/${encodeURIComponent(slug)}/download`,
	);
	if (!res.ok) throw new Error(`Marketplace error: ${res.status}`);

	const arrayBuffer = await res.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const tarballPath = path.join(temp, "market.tgz");
	await fs.writeFile(tarballPath, buffer);

	const tar = await import("tar");
	await tar.x({ file: tarballPath, cwd: temp });

	const meta = await findTemplateJson(temp);

	return { source: "market", sourceLocator: locator, tempDir: temp, meta };
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
