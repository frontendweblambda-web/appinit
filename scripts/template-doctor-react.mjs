#!/usr/bin/env node
/**
 * Template Doctor React – FIXED VERSION
 * Guarantees: no missing required template files
 */

import fs from "fs-extra";
import path from "path";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2), {
	boolean: ["dry-run", "yes"],
	alias: { d: "dry-run", y: "yes" },
});

const DRY = !!argv["dry-run"];
const ASSUME_YES = !!argv.yes;

const repoRoot = process.cwd();
const target = path.join(
	repoRoot,
	"packages",
	"templates",
	"src",
	"base",
	"frontend",
	"react",
);
const templateDir = path.join(target, "template");

const requiredFiles = [
	"package.json__tmpl",
	"README.md__tmpl",
	".gitignore__tmpl",
	".env.example__tmpl",
	"appinit.config.ts__tmpl",
	"template.meta.json__tmpl",
	"tsconfig.json__tmpl",
	"tsconfig.app.json__tmpl",
	"tsconfig.node.json__tmpl",
];

const protectedFiles = ["appinit.template.ts"];

const renameMap = {
	"package.json_tmpl": "package.json__tmpl",
	"README.md_tmpl": "README.md__tmpl",
	".gitignore_tmpl": ".gitignore__tmpl",
	".env.example_tmpl": ".env.example__tmpl",
	"appinit.config.ts_tmpl": "appinit.config.ts__tmpl",
	"template.meta.json_tmpl": "template.meta.json__tmpl",
	"tsconfig.json_tmpl": "tsconfig.json__tmpl",
	"tsconfig.app.json_tmpl": "tsconfig.app.json__tmpl",
	"tsconfig.node.json_tmpl": "tsconfig.node.json__tmpl",
};

function ok(...x) {
	console.log("\x1b[32m%s\x1b[0m", ...x);
}
function warn(...x) {
	console.log("\x1b[33m%s\x1b[0m", ...x);
}
function info(...x) {
	console.log("\x1b[36m%s\x1b[0m", ...x);
}

async function ensureTemplateDir() {
	await fs.ensureDir(templateDir);
}

async function renameWrongFiles(dir) {
	const items = await fs.readdir(dir);

	for (const file of items) {
		const full = path.join(dir, file);

		if (protectedFiles.includes(file)) continue;

		const stat = await fs.stat(full);
		if (stat.isDirectory()) {
			await renameWrongFiles(full);
			continue;
		}

		// explicit rename table
		if (renameMap[file]) {
			const newFull = path.join(dir, renameMap[file]);
			if (!DRY) await fs.move(full, newFull, { overwrite: true });
			ok(`Renamed: ${file} → ${renameMap[file]}`);
			continue;
		}

		// auto rename *_tmpl → __tmpl
		if (file.endsWith("_tmpl")) {
			const newName = file.replace("_tmpl", "__tmpl");
			const newFull = path.join(dir, newName);
			if (!DRY) await fs.move(full, newFull, { overwrite: true });
			ok(`Auto-renamed: ${file} → ${newName}`);
		}
	}
}

function generateContent(name) {
	if (name === "package.json__tmpl")
		return `{"name":"<%= projectName %>","version":"0.0.1"}`;

	if (name === "README.md__tmpl") return `# <%= projectName %>`;

	if (name === ".gitignore__tmpl") return `node_modules\ndist\n.env`;

	if (name === ".env.example__tmpl")
		return `VITE_API_URL=http://localhost:3000`;

	if (name === "appinit.config.ts__tmpl")
		return `export default { name:"<%= projectName %>" };`;

	if (name === "template.meta.json__tmpl") return `{"createdBy":"appinit"}`;

	if (name.startsWith("tsconfig"))
		return `{"compilerOptions":{ "target":"ES2020" }}`;

	return "";
}

async function ensureRequiredFiles() {
	for (const req of requiredFiles) {
		const full = path.join(templateDir, req);
		if (!(await fs.pathExists(full))) {
			warn(`Missing: ${req} → creating...`);
			if (!DRY) {
				await fs.ensureDir(path.dirname(full));
				await fs.writeFile(full, generateContent(req));
			}
			ok(`Created: ${req}`);
		}
	}
}

async function validate() {
	const missing = [];

	for (const req of requiredFiles) {
		if (!(await fs.pathExists(path.join(templateDir, req)))) {
			missing.push(req);
		}
	}

	const result = { ok: missing.length === 0, missing };
	const out = path.join(target, "template-doctor-report.json");
	await fs.writeFile(out, JSON.stringify(result, null, 2), "utf8");
	return result;
}

async function run() {
	info("Running Template Doctor React – Fixed Version");

	await ensureTemplateDir();
	await renameWrongFiles(templateDir);
	await ensureRequiredFiles();

	const report = await validate();

	if (report.ok) ok("Template validated: OK 🎉");
	else warn("Template still missing:", report.missing);
}

run();
