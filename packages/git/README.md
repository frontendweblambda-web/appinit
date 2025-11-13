## README.md

````
# @appinit/git


Git integration module for Appinit CLI & Engine.
Supports optional Git initialization based on user choice.


## Features
- Detect if Git is installed
- Detect if inside an existing Git repo
- Create .gitignore with sensible defaults
- Initialize new Git repo
- Stage & commit all scaffolded files
- User can choose to skip Git entirely


## Usage
```ts
import { initializeGit } from "@appinit/git";


await initializeGit({
cwd: process.cwd(),
enable: true,
initialCommitMessage: "Initial scaffold",
});
````

## Notes

- ESM-only, Turborepo-compatible
- No external dependencies
- Used inside @appinit/engine and @appinit/cli
