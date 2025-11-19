import { Answers } from "@appinit/types";

export function selectBaseTemplate(answers: Answers) {
	if (answers.projectType === "frontend") {
		switch (answers.framework) {
			case "react":
				return "appinit:react";
			case "vue":
				return "appinit:vue";
			case "next":
				return "appinit:next";
			case "svelte":
				return "appinit:svelte";
		}
	}

	if (answers.projectType === "backend") {
		switch (answers.backend) {
			case "express":
				return "appinit:express";
			case "fastify":
				return "appinit:fastify";
			case "nestjs":
				return "appinit:nest";
		}
	}

	if (answers.projectType === "fullstack") {
		switch (answers.framework) {
			case "framer":
				return "appinit:framer";
			case "nuxt":
				return "appinit:nuxt";
			case "next":
				return "appinit:next";
		}
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
