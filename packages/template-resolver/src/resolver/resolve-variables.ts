import { formatError } from "@appinit/core";
import { PromptResult, Variables } from "@appinit/types";
import { log } from "@clack/prompts";
import z from "zod";
export async function resolveVariables(
	variables: Variables,
	answers: PromptResult,
	ctx: {
		templateDir: string;
		tempDir: string;
		targetDir?: string;
		templateJson?: Record<string, any>;
	},
) {
	// variableModules = { defaults: module, schema: module, transform: module }
	const defaultsMod = variables.defaults ?? {};
	const schemaMod = variables.schema ?? {};
	const transformMod = variables.transform ?? {};

	const defaults =
		defaultsMod?.default ??
		defaultsMod?.defaults ??
		defaultsMod ??
		({} as Record<string, any>);

	const schema =
		schemaMod?.default ?? schemaMod?.schema ?? schemaMod ?? ({} as any);

	const transformFn =
		typeof transformMod?.default === "function"
			? transformMod.default
			: typeof transformMod?.transform === "function"
				? transformMod.transform
				: typeof transformMod?.transformVariables === "function"
					? transformMod.transformVariables
					: null;

	// Merge defaults + answers (answers override)
	let vars: Record<string, any> = {
		...defaults,
		...answers,
	};

	// TODO: apply schema validation here (optional in v1)
	// e.g., validate(vars, schema);
	const zodSchema = createSchema(schema);
	const parsed = zodSchema.safeParse(vars);
	if (!parsed.success) {
		log.error(formatError(parsed.error));
		process.exit(1);
	}
	// Apply transform if provided
	if (transformFn) {
		const maybe = await transformFn(vars, ctx);
		if (maybe && typeof maybe === "object") {
			vars = maybe;
		}
	}

	return vars;
}

type Field = {
	type: string;
	required?: boolean;
	enum?: string[];
};
export const createSchema = (obj: Record<string, Field>) => {
	const shape: Record<string, z.ZodType<unknown>> = {};

	for (const key in obj) {
		const field = obj[key];

		let zodField: z.ZodType<unknown>;

		switch (field.type) {
			case "string":
				zodField = z.string();
				if (field.enum) {
					zodField = z.enum(field.enum as [string, ...string[]]);
				}
				break;
			case "number":
				zodField = z.number();
				break;
			case "boolean":
				zodField = z.boolean();
				break;
			default:
				zodField = z.any();
		}

		if (!field.required) {
			zodField = zodField.optional();
		}

		shape[key] = zodField;
	}

	return z.object(shape);
};
