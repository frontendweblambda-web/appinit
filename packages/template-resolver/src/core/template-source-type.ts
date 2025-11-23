import { TemplateSource } from "@appinit/types";

export function templateSource(source: string): TemplateSource {
	if (source.startsWith("github:")) return "github";
	if (source.startsWith("npm:")) return "npm";
	if (source.startsWith("market:")) return "market";
	if (source.startsWith("http://") || source.startsWith("https://"))
		return "url";
	return "appinit";
}
