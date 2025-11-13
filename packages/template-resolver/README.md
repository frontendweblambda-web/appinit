## README.md

````
# @appinit/template-resolver


The Template Resolver unifies fetching templates from many sources and extracts them into a temporary folder ready for the engine.


Supported sources:
- Local folder
- GitHub (public & private)
- npm package templates (via `npm pack`)
- URL tarballs (.tgz/.tar.gz)
- Appinit Registry (internal org)
- Appinit Marketplace


Usage:
```ts
import { resolveTemplate } from "@appinit/template-resolver";


const res = await resolveTemplate("market:next-saas");
console.log(res.tempDir, res.meta);
````

Notes:

- Marketplace & Registry require environment variables `APPINIT_MARKETPLACE_API` and `APPINIT_REGISTRY_API` respectively.
- Node 18+ is required (native fetch). For npm packages this uses `npm pack`.
- URL templates currently support .tgz archives and GitHub archive URLs.
- Local templates are copied into a temp directory and registered with @appinit/cleanup.
