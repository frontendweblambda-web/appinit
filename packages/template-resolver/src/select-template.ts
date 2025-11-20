import { PromptResult } from "@appinit/types";

export function selectBaseTemplate(answers: PromptResult) {
	const { framework, backend, projectType } = answers;
	if (projectType === "frontend") {
		const map: Record<string, string> = {
			react: "appinit:react",
			"react-router": "appinit:react-router",
			next: "appinit:next",
			vue: "appinit:vue",
			svelte: "appinit:svelte",
			angular: "appinit:angular",
			astro: "appinit:astro",
			qwik: "appinit:qwik",
			solid: "appinit:solid",
			framer: "appinit:framer",
			none: "appinit:minimal",
		};

		if (framework && map[framework]) return map[framework];
	}

	if (projectType === "backend") {
		const map: Record<string, string> = {
			express: "appinit:express",
			fastify: "appinit:fastify",
			nestjs: "appinit:nest",
			hono: "appinit:hono",
			"cloudflare-worker": "appinit:cf-worker",
		};

		if (backend && map[backend]) return map[backend];
	}

	if (projectType === "fullstack") {
		const map: Record<string, string> = {
			next: "appinit:next-fullstack",
			framer: "appinit:framer-fullstack",
			nuxt: "appinit:nuxt-fullstack",
			svelte: "appinit:svelte-fullstack",
			astro: "appinit:astro-fullstack",
		};

		if (framework && map[framework]) return map[framework];
	}

	if (answers.projectType === "library") {
		return "appinit:library";
	}
	if (answers.projectType === "cli") {
		return "appinit:cli";
	}

	throw new Error(
		`No matching base template for answers: ${JSON.stringify(answers, null, 2)}`,
	);
}
