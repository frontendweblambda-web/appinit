import {
	TemplateSource,
	ResolvedTemplate,
	ResolveOptions,
} from "@appinit/types";
import { VFS } from "./vfs.js";
import { resolveLocalTemplate } from "./resolvers/local";
import { resolveGitTemplate } from "./resolvers/github";
import { resolveNpmPackage } from "./resolvers/npm.js";
import { resolveUrlTemplate } from "./resolvers/url.js";
import path from "node:path";
import fs from "fs-extra";

export async function resolveTemplate(
	src: TemplateSource | string,
	opts: ResolveOptions = {},
): Promise<ResolvedTemplate> {
	// normalize input
	let source: TemplateSource;
	if (typeof src === "string") {
		// heuristics
		if (
			src.startsWith("file:") ||
			src.startsWith("./") ||
			src.startsWith("../") ||
			src.startsWith("/")
		) {
			const p = src.replace(/^file:/, "");
			source = { kind: "local", path: p };
		} else if (src.startsWith("http://") || src.startsWith("https://")) {
			source = { kind: "url", url: src };
		} else if (
			/^(github|gitlab|bitbucket):/.test(src) ||
			/github.com/.test(src) ||
			src.endsWith(".git")
		) {
			source = { kind: "git", url: src };
		} else if (
			src.startsWith("@") ||
			src.includes("template") ||
			src.startsWith("npm:")
		) {
			source = { kind: "npm", package: src.replace(/^npm:/, "") };
		} else {
			// fallback — treat as builtin/local workspace template name
			source = {
				kind: "local",
				path: path.join(process.cwd(), "templates", src),
			};
		}
	} else {
		source = src;
	}

	// dispatch to correct resolver
	let vfs: VFS | null = null;
	switch (source.kind) {
		case "local":
			vfs = await resolveLocalTemplate(source.path);
			break;
		case "git":
			vfs = await resolveGitTemplate(
				source.url,
				(source as any).ref,
				(source as any).subpath,
			);
			break;
		case "npm":
			vfs = await resolveNpmPackage(source.package);
			break;
		case "url":
			vfs = await resolveUrlTemplate(source.url);
			break;
		case "marketplace":
			throw new Error(
				"Marketplace resolver not wired — implement marketplace client or proxy",
			);
		default:
			throw new Error(`Unknown template source: ${JSON.stringify(source)}`);
	}

	// Post-process: if vfs contains appinit.template.js, evaluate for metadata
	const result: ResolvedTemplate = { files: new Map(vfs.files), context: {} };

	if (vfs.read("appinit.template.js")) {
		// NOTE: we return the template file content under files and also try to parse minimal static JSON if available
		const tplText = vfs.read("appinit.template.js") as string;
		result.files.set("appinit.template.js", tplText);
	}

	// Try to extract package.json fragment
	if (vfs.read("package.json")) {
		try {
			const pj = JSON.parse(vfs.read("package.json") as string);
			result.packageJson = pj;
		} catch {}
	}

	return result;
}
