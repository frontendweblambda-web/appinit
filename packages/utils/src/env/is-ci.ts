export function isCI() {
	return !!(
		process.env.CI ||
		process.env.GITHUB_ACTIONS ||
		process.env.GITLAB_CI
	);
}
