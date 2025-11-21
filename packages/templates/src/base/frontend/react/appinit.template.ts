// template/appinit.template.ts

export default {
   // --------------------------------------------------------
  // 1. FILE FILTERS: dynamically decide which files to include
  // --------------------------------------------------------
filters: {
    "**/*.ts": (ctx) => ctx.language === "typescript",
    "**/*.tsx": (ctx) => ctx.language === "typescript",
    "**/*.js":  (ctx) => ctx.language === "javascript",
    "**/*.jsx": (ctx) => ctx.language === "javascript",

    "src/styles/tailwind.css": (ctx) =>
      ctx.answers.projectType === "frontend" && ctx.answers.ui === "tailwind",

    "src/styles/mui.css": (ctx) =>
      ctx.answers.projectType === "frontend" && ctx.answers.ui === "mui",
  },

  // --------------------------------------------------------
  // 2. VARIABLE INJECTION (EJS, Mustache, or string replace)
  // --------------------------------------------------------
  variables: async (ctx) => ({
    projectName: ctx.projectName,
    projectNameUpper: ctx.projectName.toUpperCase(),
    isTS: ctx.language === "typescript",
    useTailwind:
      ctx.answers.projectType === "frontend" &&
      ctx.answers.ui === "tailwind",
    year: new Date().getFullYear(),
  }),

  // --------------------------------------------------------
  // 3. PACKAGE MERGE OVERRIDES (merged into final project)
  // --------------------------------------------------------
  package: {
    dependencies: {
      react: "^18.3.0",
      "react-dom": "^18.3.0",
    },
    devDependencies: {
      vite: "^5.0.0",
      "@vitejs/plugin-react": "^5.0.0",
      typescript: "^5.4.0",
    },
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    }
  },

  // --------------------------------------------------------
  // 4. FILE RENAMES (before writing)
  // --------------------------------------------------------
  rename: {
    "_gitignore": ".gitignore",
    ".env.example": ".env",
    "appinit.config.ts.ejs": "appinit.config.ts",
    "package.json__tmpl": "package.json",
    "README.md__tmpl": "README.md",
    "template.meta.json__tmpl": "template.meta.json",
    "tsconfig.json__tmpl": "tsconfig.json",
    "tsconfig.app.json__tmpl": "tsconfig.app.json",
    "tsconfig.node.json__tmpl": "tsconfig.node.json"
  },

  // --------------------------------------------------------
  // 5. BEFORE WRITE HOOK
  // --------------------------------------------------------
  async beforeWrite(ctx) {
    ctx.log.info("Running beforeWrite for React template…");

    if (ctx.answers.auth === "none") {
      ctx.files.delete("src/auth/*");
    }
  },

  // --------------------------------------------------------
  // 6. AFTER WRITE HOOK
  // --------------------------------------------------------
  async afterWrite(ctx) {
    ctx.log.info(`Template created: ${ctx.targetDir}`);

    if (ctx.answers.autoInstall && ctx.run && ctx.packageManager) {
      await ctx.run(ctx.packageManager, ["install"], {
        cwd: ctx.targetDir,
      });
    }
  },
};
