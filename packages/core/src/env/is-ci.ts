export const isCI = () =>
	[
		"CI",
		"GITHUB_ACTIONS",
		"BITBUCKET_PIPELINES",
		"BUILDKITE",
		"GITLAB_CI",
		"CIRCLECI",
		"JENKINS_HOME",
	].some((key) => process.env[key] === "true");
