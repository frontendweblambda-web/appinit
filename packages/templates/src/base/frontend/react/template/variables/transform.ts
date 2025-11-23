export function transform(vars, ctx) {
	vars.projectNameSlug = vars.projectName.toLowerCase().replace(/\s+/g, "-");
	return vars;
}
