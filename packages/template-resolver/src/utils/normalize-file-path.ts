import { normalizePath } from "./normalize-path";
/**
 * Normalize template file paths.
 *
 * Converts:
 *   src/App.tsx__tmpl → src/App.tsx
 *   src/config.json.tmpl → src/config.json
 *   src/page.tpl → src/page
 *   src/component.hbs → src/component
 *
 * Returns:
 *   { outputPath, isTemplateFile }
 */
export function normalizeTemplateFilePath(rel: string): {
	outputPath: string;
	isTemplateFile: boolean;
} {
	let isTemplateFile = false;

	// REGEX EXPLANATION:
	// 1. Capture extension ".tsx", ".js", ".json", etc.
	// 2. Match any one of:
	//    - "__tmpl"
	//    - "_tmpl"
	//    - ".tmpl"
	//    - ".tpl"
	//    - ".hbs"
	//
	// 3. Replace the matched suffix with the captured extension
	//    (extWithDot) OR "" if none.
	const out = rel.replace(
		/(\.[a-zA-Z0-9]+)?(?:__tmpl|_tmpl|\.tmpl|\.tpl|\.hbs)$/i,
		(_, extWithDot) => {
			isTemplateFile = true;
			return extWithDot ?? "";
		},
	);

	return {
		outputPath: normalizePath(out),
		isTemplateFile,
	};
}
