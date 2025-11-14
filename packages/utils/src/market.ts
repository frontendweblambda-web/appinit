// packages/template-resolver/src/utils/templateSources/market.ts

import { downloadZip, extractZip } from "./download-zip"; // reuse fetch

const MARKET_BASE = "https://api.appinit.dev/templates";

export async function downloadMarketTemplate(id: string, tempDir: string) {
	const url = `${MARKET_BASE}/${id}.zip`;

	const zip = await downloadZip(url);
	await extractZip(zip, tempDir);

	return { ok: true, type: "market", tempDir };
}
