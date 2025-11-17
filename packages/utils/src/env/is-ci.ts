export const isCI = () =>
	["CI", "GITHUB_ACTIONS", "BUILDKITE", "GITLAB_CI", "CIRCLECI"].some(
		(key) => process.env[key] === "true",
	);
