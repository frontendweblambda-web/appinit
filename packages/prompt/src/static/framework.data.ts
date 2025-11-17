// ===============================================
// Helpers
// ===============================================
export function getRoutingChoices(framework: string) {
	switch (framework) {
		case "next":
			return [
				{
					label: "App Router",
					value: "app",
					hint: "**Recommended for new Next.js projects.** Uses React Server Components (RSC) and nested layouts for highly performant routing.",
				},
				{
					label: "Pages Router",
					value: "pages",
					hint: "The **original Next.js router.** Uses the `pages` directory and traditional client/server patterns (good for legacy projects).",
				},
			];
		case "vue":
			return [
				{
					label: "Vue Router",
					value: "vue-router",
					hint: "The **official, deeply integrated** routing library for Vue.js applications.",
				},
			];
		case "react":
		case "react-router": // For frameworks that use React Router directly (e.g., Remix)
			return [
				{
					label: "React Router",
					value: "react-router",
					hint: "**The standard for React SPAs.** Declarative routing with features like nested routes, loaders, and actions.",
				},
				{
					label: "Manual/None",
					value: "none",
					hint: "Use context or conditional rendering for basic navigation within a small application.",
				},
			];
		case "angular":
			return [
				{
					label: "Angular Router",
					value: "angular-router",
					hint: "**The built-in routing solution.** Highly configurable, handles lazy loading and route guards efficiently.",
				},
			];
		case "svelte":
			return [
				{
					label: "File-System Router",
					value: "file-system",
					hint: "Used by **SvelteKit**. Routes are defined by the folder structure in the `src/routes` directory.",
				},
			];
		case "solid":
			return [
				{
					label: "Solid Router",
					value: "solid-router",
					hint: "A high-performance router designed specifically for SolidJS's fine-grained reactivity.",
				},
			];
		case "qwik":
		case "astro":
			return [
				{
					label: "File-System Router",
					value: "file-system",
					hint: "Uses the folder structure to define routes (e.g., **QwikCity** and **Astro**'s built-in routing).",
				},
			];
		case "framer": // Framer Motion is an animation library, not a framework
		case "none":
			return [
				{
					label: "None/Manual",
					value: "none",
					hint: "No dedicated router is needed. Use simple links and conditional UI rendering.",
				},
			];
		default:
			return [
				{
					label: "File-System Router",
					value: "file-system",
					hint: "A default option for frameworks that use convention-based routing.",
				},
			];
	}
}
export function getStoreChoices(framework: string) {
	switch (framework) {
		case "vue":
			return [
				{
					label: "Pinia",
					value: "pinia",
					hint: "**The new official Vue store.** Simple, type-safe, and modular.",
				},
				{
					label: "Vuex",
					value: "vuex",
					hint: "The **classic, official Vue store.** More verbose but still widely used in established projects.",
				},
				{
					label: "None",
					value: "none",
					hint: "For small apps, use Vue's built-in reactivity/Composition API.",
				},
			];
		case "react":
		case "next":
			return [
				{
					label: "Zustand",
					value: "zustand",
					hint: "**Client State.** Simple, scalable, and hook-based for global UI state (e.g., theme, user info).",
				},
				{
					label: "TanStack Query",
					value: "tanstack-query",
					hint: "**Server State.** Essential for fetching, caching, synchronizing, and updating server data (e.g., API calls).",
				},
				{
					label: "Redux",
					value: "redux",
					hint: "The **classic, predictable state container.** Best for large, complex applications (often with Redux Toolkit).",
				},
				{
					label: "Jotai",
					value: "jotai",
					hint: "A **primitive, atomic approach** to state management. Great for high performance and complex derived state.",
				},
				{
					label: "None",
					value: "none",
					hint: "For small apps, use React's built-in context and hooks.",
				},
			];
		case "angular":
			return [
				{
					label: "NgRx",
					value: "ngrx",
					hint: "An **RxJS-powered reactive state management** solution following the Redux pattern. Best for large apps.",
				},
				{
					label: "Signals",
					value: "signals",
					hint: "**Angular's built-in reactivity primitive.** Excellent for local and component state management.",
				},
				{
					label: "None",
					value: "none",
					hint: "For basic apps, use services and subjects for shared state.",
				},
			];
		case "svelte":
			return [
				{
					label: "Stores",
					value: "stores",
					hint: "**Svelte's native state management.** Simple and efficient using writable, readable, and derived stores.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use local component state for very simple requirements.",
				},
			];
		case "solid":
			return [
				{
					label: "Solid Signals",
					value: "signals",
					hint: "**Solid's native reactivity primitive.** The highly efficient default way to manage all state.",
				},
				{
					label: "None",
					value: "none",
					hint: "Solid's signals are usually enough for any size application.",
				},
			];
		case "qwik":
		case "astro":
		case "framer":
		case "none":
		default:
			return [
				{
					label: "None",
					value: "none",
					hint: "Use the framework's built-in reactivity or local component state.",
				},
			];
	}
}
export const FRAMEWORK_CHOICES = [
	{
		label: "React",
		value: "react",
		hint: "**The most popular library.** Component-based UI with a huge ecosystem (often paired with Vite or Next.js).",
	},
	{
		label: "Next.js",
		value: "next",
		hint: "**Production-ready full-stack React framework.** Excellent for SSR, routing, and APIs.",
	},
	{
		label: "Vue",
		value: "vue",
		hint: "**Progressive and approachable framework.** Fully-featured with great official libraries (Vue Router, Pinia).",
	},
	{
		label: "Svelte",
		value: "svelte",
		hint: "**The compiler.** No virtual DOM. Generates highly optimized vanilla JS for faster runtime performance.",
	},
	{
		label: "Angular",
		value: "angular",
		hint: "**Opinionated, full-featured framework.** Best for large-scale enterprise applications with built-in tooling.",
	},
	{
		label: "SolidJS",
		value: "solid",
		hint: "**Fine-grained reactivity.** High performance using compiled JSX and actual DOM nodes, no Virtual DOM.",
	},
	{
		label: "Qwik",
		value: "qwik",
		hint: "Focuses on **Resumability** to achieve near-instant loading times by lazy loading and resuming application state.",
	},
	{
		label: "Astro",
		value: "astro",
		hint: "An **all-in-one framework** for building fast, content-focused websites using 'Islands of Interactivity'.",
	},
	{
		label: "Framer Motion",
		value: "framer",
		hint: "Used primarily for **animation and interactive design.** Not a general-purpose framework, but a powerful animation library.",
	},
	{
		label: "React Router",
		value: "react-router",
		hint: "A declarative routing library for React (often associated with **Remix** full-stack framework).",
	},
	{
		label: "None",
		value: "none",
		hint: "**Vanilla JavaScript/TypeScript.** No framework or library required.",
	},
];
