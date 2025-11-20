function stripTemplateSuffix(file: string): string {
	return file.replace(/__tmpl$/, "");
}
