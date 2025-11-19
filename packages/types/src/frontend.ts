/* ────────────────────────────────────────────────
   AppInit Framework + UI Types
   Fully strict, framework-scoped, and future-proof
────────────────────────────────────────────────── */

import { CommonFrontendOptions } from "./common";

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

// UI Kits: A universal union of all possibilities
export type TailwindUI = "tailwind";
export type MinimalUI = TailwindUI | "none";
export type ReactUI =
	| MinimalUI
	| "mui"
	| "shadcn"
	| "chakra"
	| "antd"
	| "bootstrap";
export type VueUI =
	| MinimalUI
	| "naiveui"
	| "vuetify"
	| "elementplus"
	| "radixvue";
export type AngularUI = MinimalUI | "material" | "primeng";
export type SvelteUI = MinimalUI | "skeleton";
export type UI = ReactUI | VueUI | AngularUI | SvelteUI; // The final universal UI type

export type ReactBasedRouting = "react-router" | "custom" | "none";
export type NextBasedRouting = "app" | "pages" | "custom" | "none";
export type VueBasedRouting = "vue-router" | "custom" | "none";
export type FileSystemRouting = "file-system" | "custom" | "none";
export type Routing =
	| "app"
	| "pages"
	| "file-system"
	| "react-router"
	| "vue-router"
	| "custom"
	| "none";
export type ReactStore = "zustand" | "redux" | "jotai" | "recoil" | "none";
export type VueStore = "pinia" | "none";
export type NoStore = "none";

export type ReactBasedForms = "react-hook-form" | "formik" | "none";
export type VueBasedForms =
	| "vee-validate"
	| "vuelidate"
	| "formkit"
	| "vueform"
	| "none";

// Angular-based forms
export type AngularBasedForms =
	| "reactive-forms"
	| "template-driven-forms"
	| "ngx-formly"
	| "none";
// Svelte-based forms
export type SvelteBasedForms =
	| "svelte-forms-lib"
	| "felte"
	| "svelte-use-form"
	| "none";
export type ReactBasedAnimation = "framer-motion" | "gsap" | "none";

export type CommonAnimation = "gsap" | "none";
// -------------------------------------
// FRONTEND OPTIONS
// Full discriminated union
// -------------------------------------

export type ReactOptions = CommonFrontendOptions & {
	framework: "react" | "react-router";
	ui?: ReactUI;
	routing?: ReactBasedRouting;
	store?: ReactStore;
	forms?: ReactBasedForms;
	animation?: ReactBasedAnimation;
};

export type NextOptions = CommonFrontendOptions & {
	framework: "next" | "framer" | "nuxt"; // Framer often sits on top of Next.js setup
	ui?: ReactUI;
	routing?: NextBasedRouting; // Explicit Next.js routing
	store?: ReactStore;
	forms?: ReactBasedForms;
	animation?: ReactBasedAnimation;
};

export type VueOptions = CommonFrontendOptions & {
	framework: "vue";
	ui?: VueUI;
	routing?: VueBasedRouting;
	store?: VueStore;
	forms?: VueBasedForms;
	animation?: CommonAnimation;
};

export type AngularOptions = CommonFrontendOptions & {
	framework: "angular";
	ui?: AngularUI;
	routing?: FileSystemRouting;
	store?: NoStore;
	forms?: AngularBasedForms;
	animation?: CommonAnimation;
};

export type SvelteOptions = CommonFrontendOptions & {
	framework: "svelte";
	ui?: SvelteUI;
	routing?: FileSystemRouting;
	store?: NoStore;
	forms?: SvelteBasedForms;
	animation?: CommonAnimation;
};

export type MinimalOptions = CommonFrontendOptions & {
	framework: "solid" | "qwik" | "astro" | "none";
	ui?: MinimalUI;
	routing?: "file-system" | "custom" | "none";
	store?: NoStore;
	forms?: "none";
	animation?: "none" | "gsap";
};
export type FrontendOptions =
	| NextOptions
	| ReactOptions
	| VueOptions
	| AngularOptions
	| SvelteOptions
	| MinimalOptions;
