import { EngineContext } from "@appinit/types";

export function applyRename(ctx: EngineContext) {
	const rename =
		ctx.template.templateConfig?.resolvers?.rename ??
		ctx.template.templateMeta?.rename ??
		{};

	for (const [oldPath, newName] of Object.entries(rename)) {
		for (const filePath of [...ctx.template.files!.keys()]) {
			if (filePath.endsWith(oldPath)) {
				const content = ctx.template.files!.get(filePath)!;

				const newPath = filePath.replace(oldPath, newName);

				// Delete old
				ctx.template.files!.delete(filePath);

				// Write new
				ctx.template.files!.set(newPath, content);
			}
		}
	}
}
