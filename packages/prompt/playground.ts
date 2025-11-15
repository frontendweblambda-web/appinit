import { metaPack, runPromptEngine } from "./src";

async function main() {
	const ctx = {
		command: "init",
		cwd: process.cwd(),
		flags: {},
		runtime: "cli",
		hooks: {
			beforePrompt(ctx, accum) {
				console.log("beforePrompt", accum);
			},
			afterPrompt(ctx, result) {
				console.log("afterPrompt", result);
			},
		},
	};

	const packs = [
		metaPack,
		// add more packs here
	];

	const out = await runPromptEngine(ctx, packs);

	console.log("\n\n=== FINAL ANSWERS ===");
	console.log(out.answers);

	console.log("\n\n=== TEMPLATE RESOLVED ===");
	console.log(out.template);
}

main();
