import { ChoiceOption } from "@appinit/types";

export const licenseChoices: ChoiceOption<
	"MIT" | "Apache-2.0" | "GPL-3.0" | "Unlicense" | "Other"
>[] = [
	{
		label: "MIT",
		value: "MIT",
		hint: "A short, permissive license with conditions only requiring preservation of copyright and license notices. Great for maximum compatibility.",
	},
	{
		label: "Apache-2.0",
		value: "Apache-2.0",
		hint: "A permissive license similar to MIT, but providing an express grant of patent rights from contributors to users.",
	},
	{
		label: "GPL-3.0",
		value: "GPL-3.0",
		hint: "A strong copyleft license. If you modify or redistribute code under this license, you must also release your source code under GPL-3.0.",
	},
	{
		label: "Unlicense",
		value: "Unlicense",
		hint: "Dedicates the work to the public domain, offering the fewest restrictions possible.",
	},
	{
		label: "Other",
		value: "Other",
		hint: "Choose this if your license is not listed above and you will provide details later.",
	},
];
