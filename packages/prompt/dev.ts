#!/usr/bin/env ts-node
import { runPromptEngine } from "./src/engine";

(async () => {
	// const ctx = createPromptContext(
	// 	{}, // flags
	// 	{}, // config
	// 	"", // templateName
	// 	null, // templateMeta
	// );

	// const answers = await runPromptEngine({ cliName: "ABC" });

	console.log("\n\nFINAL ANSWERS:");
	console.log(JSON.stringify({}, null, 2));
})();
