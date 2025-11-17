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
export const FRONTEND_FRAMEWORK_CHOICES = [
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

export function getUIChoices(framework: string) {
	switch (framework) {
		case "react":
		case "next":
		case "react-router":
			return [
				{
					label: "Tailwind CSS",
					value: "tailwind",
					hint: "The **most popular utility-first CSS framework.** Highly flexible and fast for custom designs.",
				},
				{
					label: "Shadcn/ui",
					value: "shadcn",
					hint: "A set of customizable components built with Radix and Tailwind. Designed for copying and pasting into your project.",
				},
				{
					label: "MUI (Material UI)",
					value: "mui",
					hint: "A comprehensive React component library implementing Google's **Material Design** principles.",
				},
				{
					label: "Chakra UI",
					value: "chakra",
					hint: "A simple, modular, and accessible component library that supports theming and dark mode out-of-the-box.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use custom CSS, CSS Modules, or another styling solution.",
				},
			];
		case "vue":
			return [
				{
					label: "Tailwind CSS",
					value: "tailwind",
					hint: "The **most popular utility-first CSS framework.** Highly flexible and fast for custom designs.",
				},
				{
					label: "Vuetify",
					value: "vuetify",
					hint: "A complete UI framework implementing **Material Design** specifically for Vue.js.",
				},
				{
					label: "Quasar",
					value: "quasar",
					hint: "A high-performance framework that allows you to build different types of apps (SPA, SSR, Mobile, Desktop) from one codebase.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use custom CSS or plain HTML/CSS.",
				},
			];
		case "angular":
			return [
				{
					label: "Angular Material",
					value: "angular-material",
					hint: "The **official UI component library** implementing Material Design, tightly integrated with the Angular ecosystem.",
				},
				{
					label: "Tailwind CSS",
					value: "tailwind",
					hint: "Use Tailwind for utility-first styling with Angular's built-in component styling.",
				},
				{
					label: "Bootstrap",
					value: "bootstrap",
					hint: "A classic, feature-rich CSS framework for responsive layouts.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use custom CSS or plain HTML/CSS.",
				},
			];
		case "svelte":
			return [
				{
					label: "Tailwind CSS",
					value: "tailwind",
					hint: "Utility-first CSS is highly popular in the Svelte ecosystem for lightweight styling.",
				},
				{
					label: "Svelte UI",
					value: "svelte-ui",
					hint: "A collection of modern, accessible, and themeable UI components for Svelte.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use custom CSS with Svelte's excellent scoped styling capabilities.",
				},
			];
		case "solid":
		case "qwik":
		case "astro":
			return [
				{
					label: "Tailwind CSS",
					value: "tailwind",
					hint: "The preferred styling method for these frameworks due to its performance and zero-runtime nature.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use custom CSS or vanilla styling approaches.",
				},
			];
		case "framer":
			return [
				{
					label: "Framer Styles",
					value: "framer-styles",
					hint: "Rely on Framer Motion's built-in styling system, optimized for smooth transitions and animation.",
				},
				{ label: "None", value: "none", hint: "Custom styles only." },
			];
		default:
			return [{ label: "None", value: "none", hint: "Pure HTML and CSS." }];
	}
}

export function getFormChoices(framework: string) {
	switch (framework) {
		case "react":
		case "next":
		case "react-router":
			return [
				{
					label: "React Hook Form",
					value: "react-hook-form",
					hint: "**Recommended.** High performance due to minimal re-renders, leverages HTML standards, and is schema-friendly.",
				},
				{
					label: "Formik",
					value: "formik",
					hint: "**Widely adopted.** A comprehensive, configuration-heavy library for full form lifecycle management.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use local component state (useState) and controlled components for simple forms.",
				},
			];
		case "vue":
			return [
				{
					label: "VeeValidate",
					value: "vee-validate",
					hint: "**Official-like.** Template and Composition API support with a focus on validation schemas (e.g., Yup, Zod).",
				},
				{
					label: "FormKit",
					value: "formkit",
					hint: "**Developer Experience.** Schema-driven form generation, comprehensive validation, and excellent accessibility features.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use Vue's built-in reactivity and basic v-model bindings for simple forms.",
				},
			];
		case "angular":
			return [
				{
					label: "Reactive Forms",
					value: "reactive-forms",
					hint: "**Recommended.** Explicit, model-driven approach using RxJS, best for complex, dynamic, and large-scale forms.",
				},
				{
					label: "Template-Driven Forms",
					value: "template-driven-forms",
					hint: "Simpler, two-way data binding approach, suitable for basic forms with minimal custom logic.",
				},
				{
					label: "Ngx-Formly",
					value: "ngx-formly",
					hint: "A powerful extension to Reactive Forms that helps dynamically generate forms from a JSON configuration.",
				},
				{
					label: "None",
					value: "none",
					hint: "Form handling is fundamental in Angular; using the built-in solutions is strongly recommended.",
				},
			];
		case "svelte":
			return [
				{
					label: "Felte",
					value: "felte",
					hint: "**Modern and Lightweight.** Framework-agnostic (but Svelte-first) form library with stores for field values and validation state.",
				},
				{
					label: "Svelte Forms Lib",
					value: "svelte-forms-lib",
					hint: "A simple, Svelte-focused utility wrapper around controlled inputs.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use Svelte's `bind:value` and simple reactive statements (`$:`) for form handling.",
				},
			];
		case "solid":
			return [
				{
					label: "Solid Forms",
					value: "solid-forms",
					hint: "A dedicated library leveraging Solid's fine-grained reactivity for high-performance form management.",
				},
				{
					label: "None",
					value: "none",
					hint: "Solid's signals are highly efficient for basic form state management without a library.",
				},
			];
		default:
			return [
				{
					label: "None",
					value: "none",
					hint: "Use standard HTML form inputs and vanilla JavaScript/TypeScript event handlers.",
				},
			];
	}
}

export const FULLSTACK_META_FRAMEWORKS = [
	{
		label: "Next.js",
		value: "next",
		hint: "**The leading React full-stack framework.** Excellent for server-side rendering (SSR), static site generation (SSG), and API routes.",
	},
	{
		label: "Remix",
		value: "react-router",
		hint: "**Full-stack React framework built on web standards.** Focuses on route-level data fetching and seamless integration with React Router.",
	},
	{
		label: "SvelteKit",
		value: "svelte",
		hint: "**The full-stack Svelte framework.** Extremely fast, uses a compiler approach, and offers flexible adapters for deployment.",
	},
	{
		label: "Nuxt (Vue)",
		value: "vue",
		hint: "**The full-stack Vue framework.** Rich feature set including file-system routing, auto-imports, and powerful module ecosystem.",
	},
];
