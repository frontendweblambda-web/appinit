# @appinit/core

The **AppInit OS Core Runtime** — shared foundational modules powering the AppInit CLI,
plugins, scaffolding engine, UX system, environment detection, and execution rules.

This package contains **platform logic**, not generic utilities.
For generic helpers, use [`@appinit/utils`](../utils).

---

## Features

- Environment detection (TTY, CI, Docker, platform)
- Interactive UI mode classification (`FULL`, `MINIMAL`, `NON_INTERACTIVE`)
- Theme + color system (Kleur-based) with palette switching
- Consistent branded logo + header printer for CLI apps
- Shared runtime logic for all AppInit packages

---

## Notable Design Rules

- No heavy dependencies
- No direct business logic or scaffolding templates
- No filesystem or network side effects — keep pure where possible
- Safe for use in Node >= 18 ESM-first environments
- Usable by `@appinit/cli`, `@appinit/create`, and plugin packages

---

## Folder Structure
