#!/usr/bin/env tsx
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

// Workspace structure
const packages = [
  "cli",
  "engine",
  "ui",
  "plugin-react",
  "plugin-next",
  "plugin-vue",
];
const apps = ["foundry", "hub", "docs", "forge-ai"];

const root = process.cwd();

async function run() {
  console.log(chalk.magentaBright("\n⚒️ Bootstrapping Forge monorepo...\n"));

  // Ensure base folders exist
  await fs.ensureDir(path.join(root, "packages"));
  await fs.ensureDir(path.join(root, "apps"));
  await fs.ensureDir(path.join(root, "scripts"));

  // Initialize packages
  for (const pkg of packages) {
    const pkgDir = path.join(root, "packages", pkg);
    const pkgJsonPath = path.join(pkgDir, "package.json");

    await fs.ensureDir(pkgDir);
    console.log(chalk.cyan(`📦 Setting up @forge/${pkg}...`));

    if (!(await fs.pathExists(pkgJsonPath))) {
      await execa("npm", ["init", "-y", "--scope=@forge", "--prefix", pkgDir]);
      const pkgJson = await fs.readJson(pkgJsonPath);

      pkgJson.name = `@forge/${pkg}`;
      pkgJson.version = "1.0.0";
      pkgJson.main = "dist/index.js";
      pkgJson.type = "module";
      pkgJson.publishConfig = { access: "public" };
      pkgJson.scripts = {
        build: "tsc -p .",
        dev: "tsx src/index.ts",
      };

      await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });

      await fs.outputFile(
        path.join(pkgDir, "src/index.ts"),
        `export const ${pkg.replace(
          /[-]/g,
          "_"
        )} = () => console.log("@forge/${pkg} ready");\n`
      );

      await fs.outputFile(
        path.join(pkgDir, "tsconfig.json"),
        JSON.stringify(
          {
            extends: "../../tsconfig.base.json",
            include: ["src"],
            compilerOptions: {
              outDir: "dist",
              rootDir: "src",
              declaration: true,
            },
          },
          null,
          2
        )
      );

      console.log(chalk.green(`✅ Created @forge/${pkg}`));
    } else {
      console.log(chalk.yellow(`⚙️ Skipped ${pkg}, already exists.`));
    }
  }

  // Initialize apps
  for (const app of apps) {
    const appDir = path.join(root, "apps", app);
    const pkgJsonPath = path.join(appDir, "package.json");

    await fs.ensureDir(appDir);
    console.log(chalk.cyan(`🧩 Setting up app ${app}...`));

    if (!(await fs.pathExists(pkgJsonPath))) {
      await execa("npm", ["init", "-y", "--prefix", appDir]);
      const pkgJson = await fs.readJson(pkgJsonPath);

      pkgJson.name = app;
      pkgJson.private = true;
      pkgJson.type = "module";
      pkgJson.scripts = {
        dev: "next dev",
        build: "next build",
        start: "next start",
      };

      await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
      console.log(chalk.green(`✅ Created app ${app}`));
    } else {
      console.log(chalk.yellow(`⚙️ Skipped ${app}, already exists.`));
    }
  }

  // Create base tsconfig.base.json if missing
  const baseTsConfig = path.join(root, "tsconfig.base.json");
  if (!(await fs.pathExists(baseTsConfig))) {
    await fs.writeJson(
      baseTsConfig,
      {
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          lib: ["ES2022", "DOM"],
          strict: true,
          skipLibCheck: true,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true,
          noEmit: true,
          types: ["node"],
          paths: {
            "@forge/*": ["packages/*/src"],
          },
        },
      },
      { spaces: 2 }
    );
    console.log(chalk.green("✅ Created tsconfig.base.json"));
  }

  // Create turbo.json if missing
  const turboConfig = path.join(root, "turbo.json");
  if (!(await fs.pathExists(turboConfig))) {
    await fs.writeJson(
      turboConfig,
      {
        $schema: "https://turbo.build/schema.json",
        pipeline: {
          build: {
            dependsOn: ["^build"],
            outputs: ["dist/**", "build/**"],
          },
          lint: {},
          dev: { cache: false },
          test: {},
        },
      },
      { spaces: 2 }
    );
    console.log(chalk.green("✅ Created turbo.json"));
  }

  console.log(chalk.greenBright("\n🎉 Forge workspace is ready!\n"));
  console.log(chalk.white("Next steps:"));
  console.log(chalk.cyan("  1️⃣ npm install"));
  console.log(chalk.cyan("  2️⃣ npm run build"));
  console.log(chalk.cyan("  3️⃣ npx turbo run dev\n"));
}

run().catch((err) => {
  console.error(chalk.red("❌ Bootstrap failed:"), err);
  process.exit(1);
});
