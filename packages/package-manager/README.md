## @appinit/package-manager

```
# @appinit/utils


Lightweight utilities shared across the Appinit monorepo.


## Notes
- This package is intentionally small and dependency-free.
- `loadConfig` supports ESM `.mjs` and `.js` config files via dynamic `import()`.
If you want TypeScript config files (`appinit.config.ts`), ensure they are compiled or
use a custom loader (e.g. `ts-node/register` or `esbuild-register`) before import.


## Next steps
- Add unit tests (Vitest) for all modules.
- Add rollup configuration for bundling and cjs/esm outputs.
```

---

That's everything for the initial implementation. You can copy these files directly into `packages/utils/src` and run `pnpm -w build` (or your monorepo build command) after adding a rollup config.

If you'd like, I can now:

- generate `rollup.config.mjs` and build scripts, or
- add unit tests (Vitest) for all modules, or
- implement TypeScript-config loader using `esbuild-register` (adds a small dep).

Tell me which to do next and I'll iterate.
