import { deepMerge } from "@appinit/utils";

export function mergePackageJson(ctx: any) {
	const pkg = ctx.templateModule?.package;
	if (!pkg) return;

	const path = "package.json";
	const raw = ctx.files.get(path);
	if (!raw) return;

	const existing = JSON.parse(raw);
	const merged = deepMerge(existing, pkg);

	ctx.files.set(path, JSON.stringify(merged, null, 2));
}
