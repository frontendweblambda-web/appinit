import { EngineContext } from "@appinit/types";

export async function applyTemplateLogic(ctx: EngineContext) {
	const logic = ctx.template.templateModule?.default;
	if (!logic) return;

	if (logic.transform) {
		await logic.transform(ctx);
	}
}
