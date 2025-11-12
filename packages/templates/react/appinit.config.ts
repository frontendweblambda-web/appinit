import { defineConfig } from "@appinit/config";

export default defineConfig({
  id: "react/base",
  name: "React Base Template",
  version: "1.0.0",
  framework: "react",
  type: "base",
  description: "Minimal React + Vite + TypeScript starter",
  files: {
    root: "files"
  },
  compatibleWith: ["ui/tailwind", "ui/mui", "lint/eslint", "format/prettier"],
  hooks: {
    async onBeforeCopy(ctx) {
      console.log(`📁 Preparing React project: ${ctx.projectName}`);
    },
    async onAfterInstall(ctx) {
      console.log(`✅ React base template setup complete for ${ctx.projectName}`);
    }
  }
});