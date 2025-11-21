import type { ChoiceOption, PromptPack } from "@appinit/types";
import { askAnswers } from "../prompt";

const architectureChoices: ChoiceOption<
	"clean" | "mvc" | "mvvm" | "modular" | "none"
>[] = [
	{
		label: "Clean Architecture",
		value: "clean",
		hint: "A layered, dependency-inversion structure emphasizing separation of concerns and testability. **Business rules are isolated** from frameworks and UI.",
	},
	{
		label: "MVC",
		value: "mvc",
		hint: "**Model–View–Controller**. Separates data management (Model), user interface (View), and logic that handles input (Controller). Common in traditional web backends.",
	},
	{
		label: "MVVM",
		value: "mvvm",
		hint: "**Model–View–ViewModel**. An enhancement of MVC, often used in modern UIs. The ViewModel mediates between the View and the Model, handling UI state and presentation logic.",
	},
	{
		label: "Modular / Feature-based",
		value: "modular",
		hint: "Organizes code around **user-facing features or domains** (e.g., `src/cart`, `src/user`). Excellent for large teams and high scalability.",
	},
	{
		label: "None",
		value: "none",
		hint: "Choose this for **small scripts or prototypes**. Code will be structured organically without an enforced pattern.",
	},
];

export const architecturePack: PromptPack = {
	name: "architecture",
	priority: 30, // runs after languagePack & before frontend/backend packs

	// Run only for code-based apps
	condition: (_, accum) => {
		const supported = ["frontend", "backend", "fullstack"];
		return supported.includes(accum.projectType ?? "");
	},

	async handler(config, ctx, accum) {
		const interactive = config.interactive;

		// Non-interactive mode
		if (!interactive) {
			return {
				architecture: "none",
			};
		}

		// Interactive mode
		const answers = await askAnswers(
			[
				{
					type: "select",
					name: "architecture",
					message: "🧩 Choose application architecture:",
					choices: architectureChoices,
					initial: accum.architecture ?? "none",
				},
			],
			accum,
			ctx,
		);

		return answers;
	},
};
