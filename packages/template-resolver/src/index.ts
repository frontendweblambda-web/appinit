import { ResolvedTemplate } from "@appinit/types";
import { resolveLocal } from "./resolvers/local";
import { resolveGitHub } from "./resolvers/github";
import { resolveNpm } from "./resolvers/npm";
import { resolveUrl } from "./resolvers/url";
import { resolveRegistry } from "./resolvers/registry";
import { resolveMarket } from "./resolvers/marketplace";

export async function resolveTemplate(
	locator: string,
): Promise<ResolvedTemplate> {
	// determine which resolver to use
	if (
		locator.startsWith("./") ||
		locator.startsWith("/") ||
		locator.startsWith("../")
	) {
		return resolveLocal(locator);
	}

	if (locator.startsWith("github:") || /github.com/.test(locator)) {
		// support both github:org/repo and full urls
		const l = locator.startsWith("github:")
			? locator
			: `github:${locator.replace(/^(https?:\/\/github.com\/?)/, "")}`;
		return resolveGitHub(l);
	}

	if (locator.startsWith("npm:") || /^[^\s@]+\/[\w-]+|^@/.test(locator)) {
		return resolveNpm(locator);
	}

	if (locator.startsWith("registry:")) {
		return resolveRegistry(locator);
	}

	if (locator.startsWith("market:")) {
		return resolveMarket(locator);
	}

	if (/^https?:\/\//.test(locator)) {
		return resolveUrl(locator);
	}

	// fallback: try local
	return resolveLocal(locator);
}
