# @appinit/github

Complete GitHub API + authentication integration for Appinit OS.
Designed for:

- Template fetching from private repos
- Repo creation
- Remote initialization
- Pushing commits
- Release creation
- PR automation
- Auth detection

````
# @appinit/github


Full GitHub integration package for Appinit OS.
Provides authentication, repo creation, releases, PR creation, and remote setup.


## Features
- Detect GitHub authentication (Token / gh CLI / SSH)
- Create GitHub repositories
- Set remote origin
- Push initial commits
- Create releases
- Create PRs
- GitHub API wrapper


## Usage
```ts
import { createGitHubRepo, setRemoteOrigin } from "@appinit/github";


const repo = await createGitHubRepo({ name: "my-app" });
await setRemoteOrigin(process.cwd(), repo.clone_url);
````

## Notes

- Requires Node 18+ (native fetch)
- Works with @appinit/git and @appinit/git-tools
