// template/variables/defaults.ts

export const defaults = {
  projectName: "my-app",
  projectType: "frontend",     // frontend | backend | fullstack
  framework: "next",          // react | next | vue | svelte | ...
  language: "ts",              // ts | js
  ui: "tailwind",              // tailwind | shadcn | none

  // Feature groups
  features: {
    example: true,             // React demo component (React only)
  },

  // AI Feature
  ai: {
    enabled: false,
    model: "gpt-5",
    autoGenerateComponents: false,
  },

  // Deploy configuration
  deploy: {
    provider: "",              // vercel | netlify | aws | docker
    region: "",
  },

  // Enable AppInit upgrades/sync
  upgrades: {
    enabled: true,
  },
};
