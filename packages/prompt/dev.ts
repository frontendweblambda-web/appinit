#!/usr/bin/env ts-node
import { runPromptEngine } from "./src/engine";
import { createPromptContext } from "./src/context";

(async () => {
	const ctx = createPromptContext(
		{}, // flags
		{}, // config
		"", // templateName
		null, // templateMeta
	);

	const answers = await runPromptEngine(ctx);

	console.log("\n\nFINAL ANSWERS:");
	console.log(JSON.stringify(answers, null, 2));
})();
