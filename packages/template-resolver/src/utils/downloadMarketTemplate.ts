// packages/template-resolver/src/utils/templateSources/downloadMarketTemplate.ts

import { downloadUrlTemplate } from "./download-url-template";

// Example: market URLs like https://api.appinit.dev/templates/<id>.zip
const MARKET_BASE = "https://api.appinit.dev/templates";

export async function downloadMarketTemplate(id: string, tempDir: string) {
	const url = `${MARKET_BASE}/${id}.zip`;
	return downloadUrlTemplate(url, tempDir);
}
