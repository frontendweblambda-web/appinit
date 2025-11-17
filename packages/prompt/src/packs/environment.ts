import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, ChoiceOption } from "@appinit/types";

export const environmentPack: PromptPack = {
	name: "environment",
	priority: 30,

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const nonInteractive = flags.nonInteractive;
		if (nonInteractive) {
			return {
				packageManager: flags.packageManager ?? accum.packageManager ?? "pnpm",
				workspace: flags.workspace ?? accum.workspace ?? "single",
			};
		}

		const res = await askAnswers(
			[
				{
					type: "select",
					name: "packageManager",
					message: "📦 Package manager:",
					choices: PACKAGE_MANAGER,
					initial: flags.packageManager ?? accum.packageManager ?? "pnpm",
				},
				{
					type: "select",
					name: "workspace",
					message: "🧩 Workspace type:",
					choices: PROJECT_STRUCTURE,
					initial: flags.workspace ?? accum.workspace ?? "single",
				},
			],
			accum,
			ctx,
		);

		return res;
	},
};

const PACKAGE_MANAGER: ChoiceOption<string>[] = [
	{
		label: "npm",
		value: "npm",
		hint: "The **default and most widely-adopted** package manager for Node.js. Great for simplicity and maximum package compatibility.",
	},
	{
		label: "pnpm",
		value: "pnpm",
		hint: "Focuses on **disk-space efficiency and speed** using content-addressable storage (hard links). Excellent for monorepos.",
	},
	{
		label: "yarn",
		value: "yarn",
		hint: "Known for **speed, reliability, and monorepo support** (workspaces). Yarn 2+ introduced the Plug'n'Play (PnP) architecture.",
	},
	{
		label: "bun",
		value: "bun",
		hint: "A **blazingly fast** all-in-one JavaScript runtime, bundler, and package manager. Best for performance-critical or new projects.",
	},
];

const PROJECT_STRUCTURE: ChoiceOption<string>[] = [
	{
		label: "Single project",
		value: "single",
		hint: "A **traditional project structure** where all code lives in one package. Simple and easy to manage for small-to-medium applications.",
	},
	{
		label: "Turborepo (monorepo)",
		value: "turborepo",
		hint: "A fast, lightweight build system by Vercel for monorepos. Focuses on **caching and remote computation**.",
	},
	{
		label: "Nx (monorepo)",
		value: "nx",
		hint: "A **powerful, full-featured monorepo toolkit** that uses a deep graph to understand project dependencies for faster builds and better tooling.",
	},
	{
		label: "Lerna (monorepo)",
		value: "lerna",
		hint: "A classic tool to manage JavaScript monorepos. Best for **publishing multiple packages** from a single repository.",
	},
];
