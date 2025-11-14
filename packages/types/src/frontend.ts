/* ────────────────────────────────────────────────
   AppInit Framework + UI Types
   Fully strict, framework-scoped, and future-proof
────────────────────────────────────────────────── */

// -------------------------------------
// Frameworks
// -------------------------------------
export type Framework =
	| "react"
	| "next"
	| "vue"
	| "svelte"
	| "angular"
	| "solid"
	| "qwik"
	| "astro"
	| "framer"
	| "react-router"
	| "none";

// -------------------------------------
// UI libraries per framework
// -------------------------------------
export type ReactUI =
	| "tailwind"
	| "mui"
	| "shadcn"
	| "chakra"
	| "antd"
	| "bootstrap"
	| "none";

export type VueUI =
	| "tailwind"
	| "naiveui"
	| "vuetify"
	| "elementplus"
	| "radixvue"
	| "none";

export type AngularUI = "tailwind" | "material" | "primeng" | "none";

export type SvelteUI = "tailwind" | "skeleton" | "none";

export type MinimalUI = "tailwind" | "none";

// -------------------------------------
// Routing per framework
// -------------------------------------
export type Routing =
	| "app"
	| "pages"
	| "file-system"
	| "react-router"
	| "vue-router"
	| "custom"
	| "none";

// -------------------------------------
// Store per framework
// -------------------------------------
export type ReactStore = "zustand" | "redux" | "jotai" | "recoil" | "none";

export type VueStore = "pinia" | "none";

export type NoStore = "none";

// -------------------------------------
// Shared lib categories
// -------------------------------------
export type Forms = "react-hook-form" | "formik" | "none";
export type Animation = "framer-motion" | "gsap" | "none";
export type Validation = "zod" | "yup" | "none";

// -------------------------------------
// Dynamic UI map for CLI prompts
// -------------------------------------
export const UI_BY_FRAMEWORK = {
	react: [
		"tailwind",
		"mui",
		"shadcn",
		"chakra",
		"antd",
		"bootstrap",
		"none",
	] as const,
	next: ["tailwind", "mui", "shadcn", "chakra", "antd", "none"] as const,
	"react-router": ["tailwind", "mui", "shadcn", "antd", "none"] as const,
	framer: ["tailwind"] as const,

	vue: [
		"tailwind",
		"naiveui",
		"vuetify",
		"elementplus",
		"radixvue",
		"none",
	] as const,

	angular: ["tailwind", "material", "primeng", "none"] as const,

	svelte: ["tailwind", "skeleton", "none"] as const,

	solid: ["tailwind", "none"] as const,
	qwik: ["tailwind", "none"] as const,
	astro: ["tailwind", "none"] as const,

	none: ["none"] as const,
};

// -------------------------------------
// FRONTEND OPTIONS
// Full discriminated union
// -------------------------------------
export type FrontendOptions =
	| {
			framework: "react" | "next" | "react-router" | "framer";
			ui?: ReactUI;
			routing?: "app" | "pages" | "react-router" | "custom" | "none";
			store?: ReactStore;
			forms?: Forms;
			animation?: Animation;
			validation?: Validation;

			pwa?: boolean;
			i18n?: boolean;
			strictMode?: boolean;
			devServer?: boolean;
	  }
	| {
			framework: "vue";
			ui?: VueUI;
			routing?: "vue-router" | "custom" | "none";
			store?: VueStore;
			forms?: "none";
			animation?: "gsap" | "none";
			validation?: Validation;

			pwa?: boolean;
			i18n?: boolean;
			strictMode?: boolean;
			devServer?: boolean;
	  }
	| {
			framework: "angular";
			ui?: AngularUI;
			routing?: "file-system" | "custom" | "none";
			store?: NoStore;
			forms?: "none";
			animation?: "gsap" | "none";
			validation?: Validation;

			pwa?: boolean;
			i18n?: boolean;
			strictMode?: boolean;
			devServer?: boolean;
	  }
	| {
			framework: "svelte";
			ui?: SvelteUI;
			routing?: "file-system" | "custom" | "none";
			store?: NoStore;
			forms?: "none";
			animation?: "gsap" | "none";
			validation?: Validation;

			pwa?: boolean;
			i18n?: boolean;
			strictMode?: boolean;
			devServer?: boolean;
	  }
	| {
			framework: "solid" | "qwik" | "astro" | "none";
			ui?: MinimalUI;
			routing?: "file-system" | "custom" | "none";
			store?: NoStore;
			forms?: "none";
			animation?: "none" | "gsap";
			validation?: Validation;

			pwa?: boolean;
			i18n?: boolean;
			strictMode?: boolean;
			devServer?: boolean;
	  };
