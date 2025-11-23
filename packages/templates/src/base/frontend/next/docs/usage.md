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
