import { ChoiceOption } from "@appinit/types";

export const editorChoices: ChoiceOption<
	"vscode" | "sublime" | "webstorm" | "cursor" | "none"
>[] = [
	{
		label: "VS Code",
		value: "vscode",
		hint: "The most popular, **free, open-source** code editor from Microsoft. Highly extensible with a massive ecosystem of plugins and integrated Git support.",
	},
	{
		label: "Sublime",
		value: "sublime",
		hint: "A **fast, lightweight, and commercial** text editor known for its exceptional speed and powerful features like 'Goto Anything' and multiple selections.",
	},
	{
		label: "WebStorm",
		value: "webstorm",
		hint: "A **paid, full-featured IDE** from JetBrains, offering superior debugging, refactoring, and project intelligence, especially for large JavaScript/TypeScript projects.",
	},
	{
		label: "Cursor",
		value: "cursor",
		hint: "A relatively new, **AI-first code editor** built on the VS Code engine, focusing on features like AI-powered chat, code generation, and debugging.",
	},
	{
		label: "None",
		value: "none",
		hint: "Choose this if you prefer to set up your editor/IDE configuration manually.",
	},
];

export const testingToolChoices: ChoiceOption<
	"vitest" | "jest" | "playwright" | "cypress" | "storybook" | "none"
>[] = [
	{
		label: "Vitest",
		value: "vitest",
		hint: "A **Unit & Integration** test framework known for its speed, built on the fast **Vite** bundler. Often preferred for modern, build-tool-based projects.",
	},
	{
		label: "Jest",
		value: "jest",
		hint: "A powerful and widely adopted **Unit & Integration** test runner from Meta (Facebook). Includes built-in mocking, assertion libraries, and coverage reports.",
	},
	{
		label: "Playwright (e2e)",
		value: "playwright",
		hint: "A reliable **End-to-End (E2E)** testing framework from Microsoft that supports testing across all major browsers (Chromium, Firefox, WebKit) and device emulation.",
	},
	{
		label: "Cypress (e2e)",
		value: "cypress",
		hint: "A developer-friendly **End-to-End (E2E)** testing tool that runs tests directly in the browser, offering real-time reloads and debugging.",
	},
	{
		label: "Storybook (visual)",
		value: "storybook",
		hint: "A tool for **UI component development and documentation**. Excellent for **visual regression testing** and ensuring components look correct across various states.",
	},
	{
		label: "None",
		value: "none",
		hint: "Choose this if you prefer to set up your testing environment manually later.",
	},
];

export const lintingToolChoices: ChoiceOption<"eslint" | "biome" | "none">[] = [
	{
		label: "ESLint",
		value: "eslint",
		hint: "The established **linting** standard for JavaScript/TypeScript. Highly configurable and extensible via plugins, but often requires separate tools for formatting (like Prettier).",
	},
	{
		label: "Biome",
		value: "biome",
		hint: "A new, **all-in-one tool** for formatting and linting written in Rust for **extreme speed**. Aims to replace multiple tools with a single, fast binary.",
	},
	{
		label: "None",
		value: "none",
		hint: "Choose this if you prefer to enforce code style manually or use your editor's built-in formatting features.",
	},
];

export const formatterChoices: ChoiceOption<"prettier" | "rome" | "none">[] = [
	{
		label: "Prettier",
		value: "prettier",
		hint: "The established, opinionated **code formatter** used to enforce consistent style across your entire codebase. Highly effective and widely adopted.",
	},
	{
		label: "Rome",
		value: "rome",
		hint: "⚠️ **Deprecated**. Rome was an attempt at an all-in-one toolchain (formatter, linter, bundler), but its development has ceased and its successor is **Biome**.",
	},
	{
		label: "None",
		value: "none",
		hint: "Choose this if you prefer to rely on built-in editor formatting or plan to use a combined tool like Biome instead.",
	},
];
