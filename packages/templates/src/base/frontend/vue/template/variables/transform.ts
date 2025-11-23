export function transform(vars) {
  vars.projectNameSlug = vars.projectName.toLowerCase().replace(/\s+/g, "-");
  return vars;
}
