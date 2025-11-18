import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";
import { getDefaultInfra } from "../utils/get-default-infra";

export const infraPack: PromptPack = {
	name: "infra",
	priority: 70, // after backend + before deploy

	condition: (_, accum) => {
		// Skip for pure tooling projects
		return !["library", "cli"].includes(accum.projectType ?? "");
	},

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const nonInteractive = flags.nonInteractive === true;

		const defaults = getDefaultInfra({
			projectType: accum.projectType!,
			framework: accum.framework!,
		});

		// ----------------------
		// NON-INTERACTIVE MODE
		// ----------------------
		if (nonInteractive) {
			return {
				analytics: flags.analytics ?? accum.analytics ?? false,
				monitoring: flags.monitoring ?? accum.monitoring ?? defaults.monitoring,
				logging: flags.logging ?? accum.logging ?? defaults.logging,
				featureFlags:
					flags.featureFlags ?? accum.featureFlags ?? defaults.featureFlags,
			};
		}

		// ----------------------
		// INTERACTIVE MODE
		// ----------------------

		return askAnswers(
			[
				{
					type: "select",
					name: "logging",
					message: "📝 Logging provider:",
					choices: [
						{ label: "Pino (Fast JS logger)", value: "pino" },
						{ label: "Winston (enterprise)", value: "winston" },
						{ label: "None", value: "none" },
					],
					initial: flags.logging ?? accum.logging ?? defaults.logging,
				},
				{
					type: "confirm",
					name: "monitoring",
					message: "📡 Enable monitoring (Sentry / OTel)?",
					initial: flags.monitoring ?? accum.monitoring ?? defaults.monitoring,
				},
				{
					type: "confirm",
					name: "analytics",
					message: "📈 Add analytics?",
					initial: flags.analytics ?? accum.analytics ?? defaults.analytics,
				},
				{
					type: "confirm",
					name: "featureFlags",
					message: "🚩 Include feature flagging (LaunchDarkly / Unleash)?",
					initial: flags.featureFlags ?? accum.featureFlags ?? false,
				},
			],
			accum,
			ctx,
		);
	},
};
