export interface FrontendOptions {
	framework?:
		| "react"
		| "next"
		| "vue"
		| "svelte"
		| "astro"
		| "qwik"
		| "solid"
		| "none";

	ui?: "tailwind" | "mui" | "shadcn" | "chakra" | "antd" | "bootstrap" | "none";

	routing?:
		| "app"
		| "pages"
		| "file-system"
		| "react-router"
		| "vue-router"
		| "custom"
		| "none";

	store?: "zustand" | "redux" | "jotai" | "recoil" | "pinia" | "none";
	forms?: "react-hook-form" | "formik" | "none";
	animation?: "framer-motion" | "gsap" | "none";
	validation?: "zod" | "yup" | "none";

	pwa?: boolean;
	i18n?: boolean;
	strictMode?: boolean;
	devServer?: boolean;
}
