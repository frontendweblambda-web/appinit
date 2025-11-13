## README (usage)

````md
# @appinit/prompt

Shared prompt engine for AppInit OS.

Usage (CLI):

```ts
import { createPromptContext, runPromptEngine } from "@appinit/prompt";

const ctx = createPromptContext(processFlags(), loadConfig(), "react");
const answers = await runPromptEngine(ctx);
```
````

Packs are pure functions and can be replaced or extended by plugins or templates.

```


---


## Final notes


- This implementation uses `prompts` v2 and TypeScript. It's dependency-minimal.
- The package exposes a stable `runPromptEngine(ctx)` API and helper `ask()` wrapper.
- Marketplace templates may inject additional prompt packs or override the pipeline entirely by calling `runPromptEngine(ctx, customPacks)` or by passing templateMeta in the context.


---


*End of drop-in implementation blueprint.*
```
