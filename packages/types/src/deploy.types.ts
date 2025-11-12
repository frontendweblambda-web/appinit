export type DeployOptions = {
	deploy?: boolean;
	deploymentStrategy?:
		| "static"
		| "server"
		| "serverless"
		| "hybrid"
		| "edge"
		| "container";

	// Frontend Deploy Targets
	frontendDeployTarget?:
		| "vercel"
		| "netlify"
		| "aws-cloudfront"
		| "cloudflare"
		| "digitalocean"
		| "custom";

	// Backend Deploy Targets
	backendDeployTarget?:
		| "lambda"
		| "aws-ec2"
		| "vercel"
		| "netlify-functions"
		| "fly"
		| "railway"
		| "render"
		| "none";

	ciProvider?:
		| "github-actions"
		| "gitlab-ci"
		| "vercel"
		| "netlify"
		| "aws-pipeline"
		| "none";

	monitoring?: boolean;
	monitoringProvider?: "sentry" | "logrocket" | "datadog" | "newrelic" | "none";
	analytics?: boolean;
	analyticsProvider?: "posthog" | "plausible" | "google" | "none";
};
