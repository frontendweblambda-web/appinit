## README.md

````
# @appinit/git-tools


Advanced Git utilities for Appinit developers.
These tools solve common real-world developer problems post-scaffolding.


## Features
- Undo last commit (soft/hard)
- Reset to a specific commit
- Revert a commit safely
- Drop entire commit history
- Clean working tree (remove local changes)
- List commit history (hash, message, author, date)


## Example Usage
```ts
import { undoLastCommit, listCommits } from "@appinit/git-tools";


await undoLastCommit({ cwd: process.cwd() });
const commits = await listCommits(process.cwd());
console.log(commits);
````

## Notes

- Designed for CLI commands like:
- `appinit git undo`
- `appinit git reset <hash>`
- `appinit git clean`
- ESM only
- Turborepo compatible
- Works with @appinit/git and @appinit/engine
