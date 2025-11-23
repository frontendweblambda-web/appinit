# AppInit Template System — Final Specification & Architecture (ATS v1.0+)

Version: 1.0.0
module: @appinit/templates
Scope: Complete authoritative standard for AppInit Templates, Packs, Plugins, Marketplace Items, Template Resolution System, Template Doctor, Performance System, and Metadata Cache.

## 🎯 **1. Overview**

## Vision

##

**Version 1.0 — Production Specification**

**AppInit Template Standard (ATS)**

that defines how every template, pack, plugin, marketplace item, resolver, and scaffold must be structured inside AppInit OS.

This is the _core specification_ your entire ecosystem will depend on.

This includes:

- template folder structure
- file conventions
- metadata schema
- dynamic variable system
- feature pack structure
- template layering rules
- merging rules
- versioning
- publishing
- marketplace compatibility
- JavaScript/TypeScript support
- UI packs
- backend packs
- plugin hooks
- conditional logic
- schema validation
- update & migration rules

Everything standardized.

---

The system is designed to enable:

- extensibility
- marketplace monetization
- composable architecture
- JavaScript/TypeScript
- frontend/backend frameworks
- AI code generation
- versioning and upgrades

---

# 📁 **2. Folder Structure Standard**

Every template must follow:

```
my-template/
│
├── template/               # All scaffold files (required)
│   ├── ...                 # Folder structure of final project
│   └── ...                 # Supports templating, renaming, filtering
│
├── appinit.template.ts     # Template logic module (optional but recommended)
├── appinit.config.ts       # Template metadata & configuration (optional)
│
├── variables/
│   ├── default.ts          # Default computed variables (optional)
│   ├── schema.ts           # Validation rules for variables/answers (optional)
│   └── transform.ts        # Transform variables before injection (optional)
│
├── hooks/
│   ├── before.ts           # Runs BEFORE writing files to disk (optional)
│   └── after.ts            # Runs AFTER dependencies installed (optional)
│
├── template.json           # Basic template metadata (optional)
├── registry.json           # Marketplace metadata (optional)
│
└── docs/
    └── usage.md            # Instructions shown to users (optional)

```

### ✔ Meaning of each file:

### **2.1 `template.meta.json` (REQUIRED)**

Defines template identity, version, compatibility.

```json
{
	"name": "react/typescript",
	"title": "React + TypeScript",
	"description": "Production grade React TS starter",
	"version": "1.0.0",
	"framework": "react",
	"language": "ts",
	"features": ["vite", "react", "typescript"],
	"tags": ["frontend", "react", "vite"],
	"author": "AppInit",
	"license": "MIT"
}
```

---

### **2.2 `template/` (REQUIRED)**

Contains the **actual project files**.

- these are plain `.ts`, `.jsx`, `.tsx` ,`.css` and `.scss` files
- no EJS required for base templates
- EJS allowed for packs

---

### **2.3 `package.json.fragment` (OPTIONAL)**

Merges into final `package.json`.

#### Example:

```json
{
	"dependencies": {
		"react-router-dom": "^6.20.0"
	},
	"devDependencies": {
		"@types/react-router-dom": "^6.0.0"
	}
}
```

---

### **2.4 `appinit.template.js` (OPTIONAL)**

Allows conditional logic, filters, variables, dynamic behavior.

#### Example:

```js
export default {
  variables(ctx) {
    return {
      ext: ctx.answers.language === "TypeScript" ? "tsx" : "jsx"
    };
  },

  filters: {
    "src/**/*.tsx": ctx => ctx.answers.language === "TypeScript",
    "src/**/*.jsx": ctx => ctx.answers.language === "JavaScript"
  },

  package: {
    dependencies: { axios: "^1.6.0" }
  },

  hooks: {
    before(ctx) { ... },
    after(ctx) { ... }
  }
}
```

---

### **2.5 `hooks/` (OPTIONAL)**

Automation before & after scaffold.

```
before.js — run before writing files
after.js — run after project creation
```

---

### **2.6 `assets/` (OPTIONAL)**

For marketplace UI:

- preview.png
- cover.jpg
- thumbnail.svg

---

# 🧩 **3. Template Categories**

There are **5 template types**:

---

## ⭐ 3.1 **Base Templates** (framework + language)

Required official templates:

```
react
vue
next
express
fastify
svelte
etc
```

Base templates = pure files.

---

## ⭐ 3.2 **Feature Packs (composable layers)**

Extend any base template:

```
ui/tailwind
ui/shadcn
testing/vitest
testing/jest
linting/eslint
formatting/prettier
auth/clerk
auth/custom
routing/react-router
state/zustand
ci/github
analytics/posthog
monitoring/sentry
```

Feature packs MUST:

- contain only the files for that feature
- never duplicate base template files
- use `package.json.fragment`
- use filters to enable/disable files

---

## ⭐ 3.3 **Plugins**

Plugins run code; not file templates.

Examples:

- AI generator
- Post-install automation
- Git initializer
- Component generator
- API client generator
- DB migration generator

Plugins contain:

```
plugin.meta.json
appinit.plugin.js
hooks/
```

---

## ⭐ 3.4 **Marketplace Templates**

Creators package templates like:

```
marketplace/john/next-saas
marketplace/arya/react-dashboard-pro
marketplace/studio/ecommerce-kit
```

Marketplace templates must follow ATS folders.

---

## ⭐ 3.5 **Inline Templates**

Defined in:

```
appinit.config.ts
```

Example:

```ts
export default {
	template: {
		files: {
			"src/hello.ts": "console.log('Hello!')",
		},
		package: {
			dependencies: { lodash: "^4.17.0" },
		},
	},
};
```

---

# 🔄 **4. Template Resolution Rules**

AppInit CLI resolves templates in priority order:

### 1️⃣ Inline template

### 2️⃣ Local path template

### 3️⃣ Workspace template

### 4️⃣ Feature packs

### 5️⃣ Marketplace template

### 6️⃣ Git templates

### 7️⃣ Registry template

### 8️⃣ Default base templates

Generated result:

```
final template = merge(base, layers, packs, inline)
```

---

# 🔀 **5. Template Merge Rules**

### ✔ File merge:

- first template lays foundation
- later templates overwrite
- conflicts resolved by strategy:
  - ask
  - skip
  - overwrite
  - merge

### ✔ JSON merge:

deep merge objects
merge arrays by unique keys

### ✔ Code merge (optional):

use codemods for JSX/TSX merges

---

# 📦 **6. JavaScript/TypeScript Standard**

AppInit supports both:

```
language: JavaScript
language: TypeScript
```

Base templates exist separately.

Feature packs use:

```
variables(ctx).ext = jsx | tsx
filters to remove wrong extension files
```

Shadcn packs automatically convert TSX → JSX.

---

# ♻ **7. Versioning Standard**

### Every template has:

```
version
minAppInitVersion
compatibility
migrationGuide
```

Users can upgrade templates with:

```
appinit template upgrade
```

Using patch files.

---

# 🏬 **8. Publishing Standard (Marketplace)**

Creators publish templates via:

```
appinit publish template
appinit publish pack
appinit publish plugin
```

Includes:

- metadata
- preview assets
- version
- license
- author

Templates are validated against ATS before publishing.

---

# 🤖 **9. AI Integration Standard**

Every template optionally supports:

- AI-based code generation
- AI code rewrite
- AI file merge
- AI suggest packs based on project type

AI helpers use:

```
appinit.ai.js
```

---

# 🔐 **10. Security Requirements**

- sandbox hooks
- no remote code execution
- no absolute paths
- signing marketplace packages
- verifying template integrity
- template isolation

---

# 🎉 **AppInit Template Standard (ATS) v1.0 — Completed**

This is your official foundation.
This is the specification your entire OS + marketplace will follow.

---

Below is the **final, formal, frozen** **ATS 1.0 — AppInit Template Folder Structure Specification**, written exactly like a real industry standard/specification document.

This version **includes enterprise-level considerations**, **security constraints**, **DX clarity**, **compliance structure**, **validation rules**, and **scalability guarantees** so it’s ready to present to:

- **Google**,
- **Microsoft**,
- **AWS**,
- **Vercel**,
- **VC technical due diligence**,
- **Fortune 500 engineering leadership**, and
- **open-source contributors**.

This is a **canonical**, locked, version-controlled specification.

---

# 📘 **AppInit Template Specification (ATS) — Version 1.0**

**Status:** Final (Frozen)
**Scope:** Template-only (Plugins, Packs, CLI, Marketplace defined in related specs)

---

# 1. Purpose

The AppInit Template Specification (ATS) defines a **uniform, predictable, safe, and scalable** directory structure and ruleset for all AppInit templates.

This specification ensures:

- consistent DX for template authors
- safe and deterministic scaffolding for end-users
- scalable marketplace integration
- enterprise-grade security boundaries
- predictable upgrade & sync behavior
- compatibility across future ATS versions

---

# 2. Overview

An AppInit template is a **self-contained, versioned blueprint** for generating the initial structure of an application. Templates are:

- deterministic
- declarative
- validated
- upgradeable
- sandboxed
- marketplace-ready

Templates do **not** install dependencies, modify system state, or perform external I/O beyond what the Template Engine permits.

Plugins handle post-scaffolding automation; templates define initial output only.

---

# 3. High-Level Structure

Every AppInit template **MUST** contain a top-level folder named:

```
template/
```

Inside it, the following structure is defined:

```
template/
│
├── appinit.template.ts            (REQUIRED)
├── appinit.template.json          (REQUIRED)
├── template.meta.json             (REQUIRED)
│
├── base/                           (REQUIRED)
│   ├── ...__tmpl                   (dynamic files)
│   └── ...                         (static files)
│
├── variables/                      (OPTIONAL but RECOMMENDED)
│   ├── defaults.ts
│   ├── schema.ts
│   └── transform.ts
│
├── hooks/                          (OPTIONAL)
│   ├── before.ts
│   └── after.ts
│
├── packs/                          (OPTIONAL)
│
└── snippets/                       (OPTIONAL)

```

This structure is now **frozen** as ATS 1.0.

---

# 4. Required Files (Hard Requirements)

## 4.1 `appinit.template.ts`

Defines the template’s behavior.

### Must include:

- `id`
- `version`
- `filters` (optional)
- `variables` (optional)
- `hooks` (optional)
- `inject` (optional)
- `resolvers` (optional)

### Enterprise Constraint:

This file runs inside a **sandboxed execution environment** with restricted API access.

---

## 4.2 `appinit.template.json`

Marketplace-facing metadata.

### Must include:

- `name`
- `title`
- `version` (semver)
- `description`
- `tags`
- `appinitSpec`: `"1.0"`
- `compatibility` (node + cli version ranges)

### Enterprise Constraint:

Used for validation, indexing, and template compatibility analysis.

---

## 4.3 `template.meta.json`

File mapping + rename rules.

### Must include:

- `root`: always `"base"` in ATS 1.0
- `ignore`: array of globs
- `rename`: mapping of filenames

---

## 4.4 `base/`

Contains final project output before plugin involvement.

Rules:

- `__tmpl` suffix = dynamic template file
- static assets = raw copy
- no files outside `base/` are rendered into project

---

# 5. Optional Folders

## 5.1 `variables/`

For structured variable pipelines.

Not required, but strongly recommended for:

- enterprise templates
- marketplace templates
- templates with more than 3 parameters

---

## 5.2 `hooks/`

Templates may include lightweight hooks:

- `before.ts`
- `after.ts`

### Strict limitations (enterprise-ready):

Hooks **MUST NOT:**

- access raw filesystem
- spawn processes
- make network requests
- mutate user environment
- install packages
- modify files directly
- access system env except explicitly allowed fields

**Hooks must be pure and deterministic.**

---

## 5.3 `packs/`

Template-owned mini-features for reuse **inside the template only**.

These are _not_ global AppInit plugins.

---

## 5.4 `snippets/`

Reusable text/code blocks for injection or template reuse.

---

# 6. Security & Sandbox Model (Enterprise Required)

To satisfy corporate requirements:

- All template code runs inside a **safe, limited VM**.
- Engine exposes only controlled APIs.
- Direct Node.js APIs (`fs`, `net`, `child_process`) are **blocked**.
- `ctx.fs` is a virtual file system abstraction—safe and scoped.
- Network operations are disallowed.
- Infinite loops/timeouts guarded.

This protects organizations from:

- malicious templates
- accidental destructive hooks
- supply-chain attacks
- RCE vulnerabilities

---

# 7. Upgrade & Sync Compatibility

ATS 1.0 requires:

- Every `__tmpl` file is tracked as template-owned.
- Static files are tracked by hash.
- Template version stored in project metadata.
- Sync and upgrade operations re-apply template logic predictably.

This allows:

- `appinit sync`
- `appinit upgrade`

to function consistently across all templates.

---

# 8. Versioning & Forward Compatibility

Every template must declare:

```json
"appinitSpec": "1.0"
```

Rules:

- ATS 1.0 templates are guaranteed forward compatible with CLI 1.x.
- ATS 2.0 templates will not break ATS 1.0 support — the engine supports version routing.
- Template authors may include migration hints for future ATS versions.

---

# 9. Enterprise Extensions (Built Into ATS 1.0)

This template structure accommodates:

### ✔ Internal Enterprise Templates

Companies can host private templates with:

- compliance
- security reviews
- restricted packs
- internal-only metadata

### ✔ Multi-template Repos

Not required in ATS 1.0, but supported via:

```
templates/<name>/template/
```

### ✔ Template Testing

Not required in ATS 1.0, but recommended:

```
template/tests/*
```

Big companies appreciate:

- unit tests for schema
- dry-run tests
- snapshot tests for base folder

---

# 10. Marketplace Compliance Requirements

Templates must:

- adhere to folder structure
- include valid metadata
- pass static verification
- include no disallowed code in hooks
- pass sandboxed execution test
- contain valid semantic versioning
- pass dependency + license scans

This ensures a safe ecosystem.

---

# 11. Why This Spec Is Acquisition-Ready

### ✔ Clear, strict, minimal

Corporates love predictability.

### ✔ Extensible without breaking compatibility

Future ATS versions can grow horizontally (plugins, packs, multi-template repos).

### ✔ Security built in

Sandboxing, no raw FS access, no arbitrary exec.

### ✔ Strong governance

Metadata validation, versioning, compatibility rules.

### ✔ Marketplace-friendly

Structured metadata + verification pipeline.

### ✔ Enterprise-friendly

Internal templates, auditability, compliance-ready.

This structure is something **Google, AWS, Meta, Vercel, or Stripe** would consider “clean, formal, and maintainable”.
