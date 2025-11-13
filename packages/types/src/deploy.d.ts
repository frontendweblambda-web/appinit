export interface DeployOptions {
	deploy?: boolean;
	deploymentStrategy?:
		| "static"
		| "server"
		| "serverless"
		| "hybrid"
		| "edge"
		| "container";
	frontendDeployTarget?:
		| "vercel"
		| "netlify"
		| "aws-cloudfront"
		| "cloudflare"
		| "digitalocean"
		| "custom";
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
}
