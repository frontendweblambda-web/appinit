import { ChoiceOption } from "@appinit/types";

export const languageChoices: ChoiceOption<"typescript" | "javascript">[] = [
	{
		label: "JavaScript",
		value: "javascript",
		hint: "The fundamental web language (**dynamically typed**). Recommended for smaller projects or quick scripting due to its simplicity and flexibility.",
	},
	{
		label: "TypeScript",
		value: "typescript",
		hint: "A superset of JavaScript that adds **static typing**. Recommended for large-scale applications to catch errors early during development (compile-time).",
	},
];
