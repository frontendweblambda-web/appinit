import { askAnswers } from "../prompt";
import type {
	PromptPack,
	PromptContext,
	PromptQuestion,
	PromptResult,
	ChoiceOption,
} from "@appinit/types";

// -------------------------------------------------------------
// Hosting options by project type
// -------------------------------------------------------------
const FRONTEND_TARGETS: ChoiceOption[] = [
	{ label: "Vercel", value: "vercel" },
	{ label: "Netlify", value: "netlify" },
	{ label: "Cloudflare Pages", value: "cloudflare-pages" },
	{ label: "Static Export (SPA)", value: "static" },
	{ label: "None", value: "none" },
];

const BACKEND_TARGETS: ChoiceOption[] = [
	{ label: "Node Server", value: "node" },
	{ label: "Docker", value: "docker" },
	{ label: "Cloudflare Workers", value: "cloudflare-workers" },
	{ label: "Fly.io", value: "flyio" },
	{ label: "Render", value: "render" },
	{ label: "None", value: "none" },
];

const FULLSTACK_TARGETS: ChoiceOption[] = [
	{ label: "Vercel", value: "vercel" },
	{ label: "Netlify", value: "netlify" },
	{ label: "Node Server", value: "node" },
	{ label: "Docker", value: "docker" },
	{ label: "Cloudflare Workers", value: "cloudflare-workers" },
	{ label: "Fly.io", value: "flyio" },
	{ label: "Render", value: "render" },
	{ label: "None", value: "none" },
];

// -------------------------------------------------------------
// Dynamic configuration questions per deploy target
// -------------------------------------------------------------
function questionsForTarget(target: string): PromptQuestion[] {
	switch (target) {
		case "vercel":
			return [
				{
					type: "text",
					name: "deployConfig.vercel.projectId",
					message: "🔧 Vercel Project ID:",
				},
				{
					type: "text",
					name: "deployConfig.vercel.orgId",
					message: "🏢 Vercel Org ID:",
				},
				{
					type: "confirm",
					name: "deployConfig.vercel.autoDeploy",
					message: "⚡ Enable automatic deployments?",
					initial: true,
				},
			];

		case "netlify":
			return [
				{
					type: "text",
					name: "deployConfig.netlify.siteId",
					message: "🌐 Netlify Site ID:",
				},
				{
					type: "confirm",
					name: "deployConfig.netlify.autoDeploy",
					message: "⚡ Enable automatic deployments?",
					initial: true,
				},
			];

		case "cloudflare-pages":
			return [
				{
					type: "text",
					name: "deployConfig.cloudflarePages.accountId",
					message: "🏛 Cloudflare Account ID:",
				},
				{
					type: "text",
					name: "deployConfig.cloudflarePages.projectName",
					message: "📦 Pages Project Name:",
				},
			];

		case "cloudflare-workers":
			return [
				{
					type: "text",
					name: "deployConfig.workers.accountId",
					message: "🏛 Cloudflare Account ID:",
				},
				{
					type: "text",
					name: "deployConfig.workers.route",
					message: "🌍 Worker Route (optional):",
					initial: "",
				},
			];

		case "docker":
			return [
				{
					type: "text",
					name: "deployConfig.docker.image",
					message: "🐳 Docker Image Name:",
					initial: "appinit/app",
				},
				{
					type: "text",
					name: "deployConfig.docker.registry",
					message: "📦 Docker Registry (optional):",
					initial: "",
				},
			];

		case "flyio":
			return [
				{
					type: "text",
					name: "deployConfig.flyio.appName",
					message: "🛫 Fly.io App Name:",
				},
				{
					type: "text",
					name: "deployConfig.flyio.region",
					message: "🌍 Preferred region:",
					initial: "iad",
				},
			];

		case "render":
			return [
				{
					type: "text",
					name: "deployConfig.render.serviceName",
					message: "🔧 Render Service Name:",
				},
				{
					type: "select",
					name: "deployConfig.render.plan",
					message: "💰 Render Plan:",
					choices: [
						{ label: "Free", value: "free" },
						{ label: "Starter", value: "starter" },
						{ label: "Pro", value: "pro" },
					],
					initial: "free",
				},
			];

		case "static":
			return [
				{
					type: "text",
					name: "deployConfig.static.outputDir",
					message: "📁 Export Directory:",
					initial: "dist",
				},
			];

		default:
			return [];
	}
}

// -------------------------------------------------------------
// deployPack — FINAL VERSION
// -------------------------------------------------------------
export const deployPack: PromptPack = {
	name: "deploy",
	priority: 75,

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const prev = ctx.config ?? {};

		const projectType = accum.type ?? flags.type;

		// --------------------------
		// Non-interactive mode
		// --------------------------
		if (flags["non-interactive"]) {
			return {
				deployTarget: flags.deployTarget ?? "none",
				deployConfig: flags.deployConfig ?? undefined,
			};
		}

		// Determine available hosting options
		let choices: ChoiceOption[];

		switch (projectType) {
			case "frontend":
				choices = FRONTEND_TARGETS;
				break;
			case "backend":
				choices = BACKEND_TARGETS;
				break;
			case "fullstack":
				choices = FULLSTACK_TARGETS;
				break;
			default:
				return { deployTarget: "none" };
		}

		// --------------------------
		// 1️⃣ Ask for deployment target
		// --------------------------
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "deployTarget",
					message: "🚀 Choose deployment target:",
					choices,
					initial: accum.deployTarget ?? "none",
				},
			],
			accum,
			ctx,
		);

		if (!base.deployTarget || base.deployTarget === "none") {
			return { deployTarget: "none" };
		}

		// --------------------------
		// 2️⃣ Ask provider-specific fields
		// --------------------------
		const extraQs = questionsForTarget(base.deployTarget);

		if (extraQs.length === 0) {
			return base;
		}

		const config = await askAnswers(extraQs, { ...accum, ...base }, ctx);

		return {
			...base,
			deployConfig: config.deployConfig,
		};
	},
};
