import { EngineContext } from "@appinit/types";
import { renderTemplate } from "@appinit/utils";

export async function renderTemplates(ctx: EngineContext) {
	for (const [file, content] of [...ctx.template.files!.entries()]) {
		const rendered = renderTemplate(content, ctx.variables);
		ctx.template.files!.set(file, rendered);
	}
}
