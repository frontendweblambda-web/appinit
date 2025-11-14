// packages/template-resolver/src/utils/templateSources/downloadUrlTemplate.ts

import fetch from "node-fetch";
import AdmZip from "adm-zip";
import fs from "fs-extra";

export async function downloadUrlTemplate(url: string, tempDir: string) {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to download template from ${url}`);
	}

	const buffer = Buffer.from(await res.arrayBuffer());
	const zip = new AdmZip(buffer);
	zip.extractAllTo(tempDir, true);

	return { ok: true, type: "url", tempDir };
}
