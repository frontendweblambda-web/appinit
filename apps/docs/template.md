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
