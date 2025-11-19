// template/appinit.template.ts
import {TemplateContext} from '@appinit/types'
import {getPackageManager, isFrontend,isFullstack} from '@appinit/core'
export default {
   // --------------------------------------------------------
  // 1. FILE FILTERS: dynamically decide which files to include
  // --------------------------------------------------------
  filters: {
    "**/*.ts": (ctx:TemplateContext) => ctx.answers.language === "typescript",
    "**/*.tsx": (ctx:TemplateContext) => ctx.answers.language === "typescript",
    "**/*.js":  (ctx:TemplateContext) => ctx.answers.language === "javascript",
    "**/*.jsx": (ctx:TemplateContext) => ctx.answers.language === "javascript",

    // Example: UI-based filtering
    "src/styles/tailwind.css": (ctx:TemplateContext) =>isFrontend(ctx.answers)?ctx.answers.ui === "tailwind":"",
    "src/styles/mui.css":      (ctx:TemplateContext) =>isFrontend(ctx.answers)?ctx.answers.ui === "mui":"",
  },

  // --------------------------------------------------------
  // 2. VARIABLE INJECTION (EJS, Mustache, or string replace)
  // --------------------------------------------------------
  variables: async (ctx: TemplateContext) => ({
    projectName: ctx.projectName,
    projectNameUpper: ctx.projectName.toUpperCase(),
    isTS: ctx.language === "typescript",
    useTailwind: isFrontend(ctx.answers) || isFullstack(ctx.answers)?"tailwind":"",
    year: new Date().getFullYear(),
  }),

  // --------------------------------------------------------
  // 3. PACKAGE MERGE OVERRIDES (merged into final project)
  // --------------------------------------------------------
  package: {
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
    devDependencies: {
      vite: "^5.0.0",
      "@vitejs/plugin-react": "^5.0.0",
    },
  },

  // --------------------------------------------------------
  // 4. FILE RENAMES (before writing)
  // --------------------------------------------------------
  rename: {
    "_gitignore": ".gitignore",
    "_env": ".env",
    "_eslint.config.cjs": "eslint.config.cjs",
  },

  // --------------------------------------------------------
  // 5. BEFORE WRITE HOOK
  // --------------------------------------------------------
  async beforeWrite(ctx: TemplateContext) {
    ctx.log.info("Running beforeWrite for React template…");

    // Example: delete files dynamically
    if (ctx.answers.auth === "none") {
      ctx.files.delete("src/auth/*");
    }
  },

  // --------------------------------------------------------
  // 6. AFTER WRITE HOOK
  // --------------------------------------------------------
  async afterWrite(ctx: TemplateContext) {
    ctx.log.info(`Template created: ${ctx.targetDir}`);
    const pm = await getPackageManager()
    // Example: install dependencies automatically
    if (ctx.answers.autoInstall) {
      await pm.install(["install"]);
    }
  },
};