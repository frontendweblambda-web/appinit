import { ChoiceOption } from "@appinit/types";

export const PROJECT_TYPES: ChoiceOption<string>[] = [
	{
		label: "Frontend Application",
		value: "frontend",
		hint: "**A pure client-side application (SPA).** Good for UIs, dashboards, and static sites that consume an existing external API.",
	},
	{
		label: "Backend API",
		value: "backend",
		hint: "A **server-only project** dedicated to data, business logic, and API endpoints (e.g., using Node.js, Python, or Go).",
	},
	{
		label: "Fullstack (UI + API)",
		value: "fullstack",
		hint: "**The modern monolith.** A single project containing both the user interface and the API/server logic (e.g., Next.js, SvelteKit).",
	},
	{
		label: "Library / SDK",
		value: "library",
		hint: "A **reusable package** of code meant to be published to NPM and used by other applications (e.g., component library, utility functions).",
	},
	{
		label: "CLI Tool",
		value: "cli",
		hint: "A **command-line application** that runs in the terminal. Excellent for automation, deployment, or scaffold generation.",
	},
];
