// packages/template-resolver/src/utils/templateSources/url.ts

import { downloadZip, extractZip } from "./download-zip";

export async function downloadUrlTemplate(url: string, tempDir: string) {
	const zip = await downloadZip(url);
	await extractZip(zip, tempDir);

	return { ok: true, type: "url", tempDir };
}
