import z from "zod";
export const projectNameValidation = z.object({
	projectName: z
		.string()
		.min(1, "Project name is required!")
		.regex(
			/^[a-zA-Z][a-zA-Z0-9-_]*$/,
			"Project name must be alphanumeric, start with a letter, and can include '-' or '_'",
		),
});

export const projectTypeValidation = z.object({
	projectType: z
		.enum(["frontend", "backend", "fullstack", "library", "cli"], {
			error:
				"Project type must be one of: 'frontend','backend','fullstack','library','cli",
		})
		.default("frontend"),
});

export const templateValidation = z.object({
	template: z
		.string()
		.min(1, "Template is required")
		.refine(
			(val) => !val.includes(" "),
			"Template name can not contain spaces",
		),
});

export const projectMetaValidation = z.object({
	projectName: projectNameValidation.shape.projectName.optional(),
	projectType: projectTypeValidation.shape.projectType.optional(),
	template: templateValidation.shape.template.optional(),
});
