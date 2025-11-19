#!/usr/bin/env node
/**
 * template-doctor-universal.mjs (Template Doctor v5)
 * Universal AppInit Template fixer — runs recursively across packages/templates
 *
 * Usage:
 *   node template-doctor-universal.mjs                     # run on packages/templates
 *   node template-doctor-universal.mjs <path>              # run on custom path
 *   node template-doctor-universal.mjs --dry-run
 *   node template-doctor-universal.mjs --backup
 *   node template-doctor-universal.mjs --yes
 *
 * Requirements:
 *   npm i fs-extra archiver minimist fast-glob
 *
 * WARNING:
 *   - This script moves and renames files. Use --dry-run to preview.
 *   - Use --backup to create a zip backup before changing anything.
 */

import fs from "fs-extra";
import path from "path";
import os from "os";
import minimist from "minimist";
import archiver from "archiver";
import fg from "fast-glob";

const argv = minimist(process.argv.slice(2), {
	boolean: ["dry-run", "backup", "yes"],
	alias: { d: "dry-run", b: "backup", y: "yes" },
});

const DRY = !!argv["dry-run"];
const BACKUP = !!argv["backup"];
const ASSUME_YES = !!argv["yes"];

const repoRoot = process.cwd();
const defaultRoot = path.join(repoRoot, "packages", "templates");
const rootTarget = path.resolve(argv._[0] || defaultRoot);

// Uploaded file for preview (user-provided). Local path available here:
const uploadedPreview =
	"file:///mnt/data/76f841bd-eb25-4c88-96b8-026ad23da301.png";

// Config: which extensions to treat as code (convert to __tmpl)
const CODE_EXTENSIONS = [
	".ts",
	".tsx",
	".js",
	".jsx",
	".css",
	".html",
	".json",
	".md",
];
// Asset extensions to keep as-is
const ASSET_EXTENSIONS = [
	".png",
	".jpg",
	".jpeg",
	".svg",
	".gif",
	".webp",
	".ico",
];

// Type detection heuristics + required files per type
const TEMPLATE_RULES = {
	"vite-react": {
		detect: (files) =>
			files.some((f) => /vite\.config\./i.test(f) || f.includes("index.html")),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			".env.example__tmpl",
			"tsconfig.json__tmpl",
			"appinit.config.ts__tmpl",
		],
		codeTargets: ["src", "public", "config"],
	},
	next: {
		detect: (files) =>
			files.some(
				(f) =>
					/next\.config\./i.test(f) ||
					f.includes("/pages/") ||
					f.includes("/app/"),
			),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			"next.config.js__tmpl",
			"tsconfig.json__tmpl",
			"appinit.config.ts__tmpl",
		],
		codeTargets: ["app", "pages", "public", "src"],
	},
	svelte: {
		detect: (files) => files.some((f) => /svelte\.config\./i.test(f)),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			"tsconfig.json__tmpl",
		],
		codeTargets: ["src", "public"],
	},
	vue: {
		detect: (files) =>
			files.some(
				(f) =>
					/vite\.config\./i.test(f) && files.some((x) => /\.vue$/i.test(x)),
			),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			"tsconfig.json__tmpl",
		],
		codeTargets: ["src", "public"],
	},
	express: {
		detect: (files) =>
			files.some(
				(f) =>
					/express/i.test(f) ||
					files.some((x) => /server|app|index\.(ts|js)$/i.test(x)),
			),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			"tsconfig.json__tmpl",
			"src/index.ts__tmpl",
		],
		codeTargets: ["src"],
	},
	fastify: {
		detect: (files) =>
			files.some(
				(f) =>
					/fastify/i.test(f) ||
					files.some((x) => /server|app|index\.(ts|js)$/i.test(x)),
			),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			"tsconfig.json__tmpl",
			"src/index.ts__tmpl",
		],
		codeTargets: ["src"],
	},
	nest: {
		detect: (files) =>
			files.some(
				(f) =>
					/nest/.test(f) ||
					files.some((x) => /main\.(ts|js)$/i.test(x) && x.includes("src")),
			),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			"tsconfig.json__tmpl",
		],
		codeTargets: ["src"],
	},
	library: {
		detect: (files) =>
			files.some(
				(f) =>
					/package\.json/i.test(f) &&
					files.some((x) => /src\/index\.(ts|js)/i.test(x)),
			),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			"tsconfig.json__tmpl",
			"src/index.ts__tmpl",
		],
		codeTargets: ["src"],
	},
	fullstack: {
		detect: (files) =>
			files.some(
				(f) =>
					f.includes("server") && (f.includes("vite") || f.includes("next")),
			),
		required: [
			"package.json__tmpl",
			"README.md__tmpl",
			".gitignore__tmpl",
			"tsconfig.json__tmpl",
		],
		codeTargets: ["src", "public", "app", "pages"],
	},
};

// helper logging
const info = (...args) => console.log("\x1b[36m%s\x1b[0m", ...args);
const ok = (...args) => console.log("\x1b[32m%s\x1b[0m", ...args);
const warn = (...args) => console.log("\x1b[33m%s\x1b[0m", ...args);
const fatal = (...args) => console.error("\x1b[31m%s\x1b[0m", ...args);

// zip utility for backup
async function zipDir(srcDir, outPath) {
	await fs.ensureDir(path.dirname(outPath));
	const output = fs.createWriteStream(outPath);
	const archive = archiver("zip", { zlib: { level: 9 } });
	return new Promise((resolve, reject) => {
		output.on("close", () => resolve());
		archive.on("error", (e) => reject(e));
		archive.pipe(output);
		archive.directory(srcDir, false);
		archive.finalize();
	});
}

// walk: find all template packages: defined by presence of template.json or a template/ folder
async function findTemplatePackages(root) {
	const entries = await fg(["**/template.json", "**/template/"], {
		cwd: root,
		dot: true,
		onlyFiles: false,
		absolute: true,
	});
	const packages = new Set();
	for (const ent of entries) {
		// normalize to package root (parent of template.json or parent of template/)
		let pkgRoot = ent;
		if (ent.endsWith("template.json")) pkgRoot = path.dirname(ent);
		if (ent.endsWith("template")) pkgRoot = path.dirname(ent);
		packages.add(path.resolve(pkgRoot));
	}
	// fallback: if none found, treat immediate subfolders of root as packages
	if (packages.size === 0) {
		const subdirs = await fs.readdir(root);
		for (const s of subdirs) {
			const full = path.join(root, s);
			if ((await fs.stat(full)).isDirectory()) packages.add(full);
		}
	}
	return Array.from(packages);
}

function isAsset(file) {
	const ext = path.extname(file).toLowerCase();
	return ASSET_EXTENSIONS.includes(ext);
}

function isCodeFile(file) {
	const ext = path.extname(file).toLowerCase();
	return CODE_EXTENSIONS.includes(ext);
}

function basename(file) {
	return path.basename(file);
}

async function collectAllFiles(pkgRoot) {
	// gather all files under the package root (relative paths)
	const files = await fg(["**/*"], {
		cwd: pkgRoot,
		dot: true,
		onlyFiles: true,
		absolute: false,
	});
	return files;
}

// helper to ensure template dir exists
async function ensureTemplateDir(pkgRoot) {
	const t = path.join(pkgRoot, "template");
	if (!(await fs.pathExists(t))) {
		if (!DRY) await fs.ensureDir(t);
		ok(`[ensure] created template/ for ${pkgRoot}`);
	}
	return t;
}

// move misplaced root-level template-like files into template/
async function moveRootTemplateFiles(pkgRoot, templateDir, report) {
	const candidates = await fg(["*_tmpl", "*_tmpl/**"], {
		cwd: pkgRoot,
		dot: true,
		onlyFiles: true,
		absolute: false,
	});
	for (const rel of candidates) {
		const from = path.join(pkgRoot, rel);
		const newName = rel.replace(/_tmpl/g, "__tmpl");
		const to = path.join(templateDir, newName);
		// never move engine files (appinit.template.ts, template.json, template.logic.ts, variables, hooks, docs)
		const skipPatterns = [
			"template.json",
			"template.logic.ts",
			"appinit.template.ts",
			"variables/",
			"hooks/",
			"docs/",
		];
		if (skipPatterns.some((p) => rel.startsWith(p))) continue;
		report.actions.push({
			type: "move",
			from: path.relative(repoRoot, from),
			to: path.relative(repoRoot, to),
		});
		if (!DRY) {
			await fs.ensureDir(path.dirname(to));
			await fs.move(from, to, { overwrite: true });
		}
	}
}

// rename any *_tmpl => __tmpl inside template dir
async function renameUnderTemplate(templateDir, report) {
	const all = await fg(["**/*_tmpl"], {
		cwd: templateDir,
		dot: true,
		onlyFiles: true,
		absolute: false,
	});
	for (const rel of all) {
		const src = path.join(templateDir, rel);
		const dest = path.join(templateDir, rel.replace(/_tmpl/g, "__tmpl"));
		report.actions.push({
			type: "rename",
			from: path.relative(repoRoot, src),
			to: path.relative(repoRoot, dest),
		});
		if (!DRY) {
			await fs.move(src, dest, { overwrite: true });
		}
	}
}

// convert code files under codeTargets into __tmpl (if they are not assets), but skip protected engine files
async function convertCodeFilesToTmpl(templateDir, codeTargets, report) {
	for (const target of codeTargets) {
		const dir = path.join(templateDir, target);
		if (!(await fs.pathExists(dir))) continue;
		const files = await fg(["**/*"], {
			cwd: dir,
			dot: true,
			onlyFiles: true,
			absolute: false,
		});
		for (const rel of files) {
			const full = path.join(dir, rel);
			const ext = path.extname(rel).toLowerCase();
			if (isAsset(rel)) continue; // keep static assets
			// never convert appinit.template.ts or anything in variables/hooks/docs etc.
			if (
				[
					"appinit.template.ts",
					"appinit.config.ts",
					"template.meta.json",
				].includes(path.basename(rel))
			)
				continue;
			// convert only code-type files
			if (isCodeFile(rel) || rel.endsWith("_tmpl") || rel.endsWith("__tmpl")) {
				// if already __tmpl, skip
				if (rel.endsWith("__tmpl")) continue;
				const newRel = rel.replace(/_tmpl$/g, "__tmpl");
				const src = path.join(dir, rel);
				const dest = path.join(dir, newRel);
				report.actions.push({
					type: "convert",
					from: path.relative(repoRoot, src),
					to: path.relative(repoRoot, dest),
				});
				if (!DRY) {
					await fs.move(src, dest, { overwrite: true });
				}
			}
		}
	}
}

// small typo fixes for commonly misspelled files inside template
async function fixCommonTypos(templateDir, report) {
	const typoMap = {
		"vite.confg.ts__tmpl": "vite.config.ts__tmpl",
		"vite.confg.ts_tmpl": "vite.config.ts__tmpl",
		"vite.confg.ts": "vite.config.ts__tmpl",
	};
	for (const [srcName, destName] of Object.entries(typoMap)) {
		const found = await fg([`**/${srcName}`], {
			cwd: templateDir,
			dot: true,
			onlyFiles: true,
			absolute: false,
		});
		for (const rel of found) {
			const src = path.join(templateDir, rel);
			const dest = path.join(templateDir, path.dirname(rel), destName);
			report.actions.push({
				type: "fix-typo",
				from: path.relative(repoRoot, src),
				to: path.relative(repoRoot, dest),
			});
			if (!DRY) {
				await fs.move(src, dest, { overwrite: true });
			}
		}
	}
}

// detect template type by reading template.json or heuristics
async function detectTemplateType(pkgRoot, fileList) {
	// if there is template.json and it has type, use it
	try {
		const tjson = path.join(pkgRoot, "template.json");
		if (await fs.pathExists(tjson)) {
			const content = await fs.readJson(tjson);
			if (content && content.type) return content.type;
		}
	} catch (e) {
		// ignore parse errors
	}

	// fallback heuristics: gather normalized file list
	const norm = fileList.map((f) => f.toLowerCase());
	for (const [type, rule] of Object.entries(TEMPLATE_RULES)) {
		if (rule.detect(norm)) return type;
	}

	// default fallback
	return "unknown";
}

// generate sensible default content for required files
function makeDefaultContent(name) {
	if (name === "template.json") {
		return JSON.stringify(
			{
				name: "unnamed-template",
				description: "Auto-generated template.json",
				type: "unknown",
				files: "./template",
			},
			null,
			2,
		);
	}
	if (name === "package.json__tmpl") {
		return JSON.stringify(
			{
				name: "<%= projectName %>",
				version: "0.0.1",
				private: true,
				scripts: {},
			},
			null,
			2,
		);
	}
	if (name === "README.md__tmpl")
		return "# <%= projectName %>\nGenerated by AppInit";
	if (name === ".gitignore__tmpl") return "node_modules\ndist\n.env\n";
	if (name === ".env.example__tmpl")
		return "VITE_API_URL=http://localhost:3000\n";
	if (name === "appinit.config.ts__tmpl")
		return `export default { name: "<%= projectName %>" };\n`;
	if (name === "template.meta.json__tmpl")
		return JSON.stringify({ createdBy: "appinit" }, null, 2);
	if (
		name.endsWith(".js__tmpl") ||
		name.endsWith(".ts__tmpl") ||
		name.endsWith(".json__tmpl")
	)
		return "{}";
	return "";
}

// ensure required files for type exist (create if missing)
async function ensureRequiredForType(templateDir, type, report) {
	const rules = TEMPLATE_RULES[type] || null;
	const required = [];

	// base required files always included
	required.push("package.json__tmpl", "README.md__tmpl", ".gitignore__tmpl");

	if (rules && Array.isArray(rules.required)) {
		required.push(...rules.required.filter((r) => !required.includes(r)));
	} else {
		// fallback minimal set
		required.push("tsconfig.json__tmpl", "appinit.config.ts__tmpl");
	}

	for (const rel of required) {
		const full = path.join(templateDir, rel);
		if (!(await fs.pathExists(full))) {
			report.actions.push({
				type: "create",
				file: path.relative(repoRoot, full),
			});
			if (!DRY) {
				await fs.ensureDir(path.dirname(full));
				await fs.writeFile(full, makeDefaultContent(rel), "utf8");
			}
		}
	}
}

// final validation for one package
async function validatePackage(pkgRoot, templateDir, type) {
	const report = { ok: true, issues: [], missing: [] };

	// check root invariants
	for (const need of ["template.json", "template"]) {
		const p = path.join(pkgRoot, need);
		if (!(await fs.pathExists(p))) {
			report.ok = false;
			report.issues.push(`Missing ${need}`);
		}
	}

	// check required files
	const rules = TEMPLATE_RULES[type] || null;
	const required = [
		"package.json__tmpl",
		"README.md__tmpl",
		".gitignore__tmpl",
	];
	if (rules && rules.required)
		required.push(...rules.required.filter((r) => !required.includes(r)));
	for (const r of required) {
		if (!(await fs.pathExists(path.join(templateDir, r)))) {
			report.ok = false;
			report.missing.push(r);
		}
	}
	return report;
}

// process single package
async function processPackage(pkgRoot) {
	const pkgReport = {
		package: path.relative(repoRoot, pkgRoot),
		actions: [],
		type: null,
		validationBefore: null,
		validationAfter: null,
	};

	// collect files
	const files = await collectAllFiles(pkgRoot);

	// pre-validate
	const templateDir = path.join(pkgRoot, "template");
	pkgReport.validationBefore = {
		hasTemplateDir: await fs.pathExists(templateDir),
		filesCount: files.length,
	};

	if (BACKUP && !DRY) {
		const out = path.join(
			os.tmpdir(),
			`template-backup-${path.basename(pkgRoot)}-${Date.now()}.zip`,
		);
		pkgReport.backup = out;
		await zipDir(pkgRoot, out);
	}

	// ensure template/
	await ensureTemplateDir(pkgRoot);

	// move root _tmpl files into template/
	await moveRootTemplateFiles(pkgRoot, templateDir, pkgReport);

	// rename inside template: *_tmpl -> __tmpl
	await renameUnderTemplate(templateDir, pkgReport);

	// fix common typos
	await fixCommonTypos(templateDir, pkgReport);

	// detect type (after moves)
	const filesAfter = await collectAllFiles(pkgRoot);
	const type = await detectTemplateType(pkgRoot, filesAfter);
	pkgReport.type = type;

	// determine codeTargets
	const codeTargets = (TEMPLATE_RULES[type] &&
		TEMPLATE_RULES[type].codeTargets) || [
		"src",
		"public",
		"config",
		"app",
		"pages",
	];

	// convert code files to __tmpl where appropriate
	await convertCodeFilesToTmpl(templateDir, codeTargets, pkgReport);

	// ensure required files for that type exist
	await ensureRequiredForType(templateDir, type, pkgReport);

	// final validation
	pkgReport.validationAfter = await validatePackage(pkgRoot, templateDir, type);

	// write per-package report
	const outReport = path.join(pkgRoot, "template-doctor-report.json");
	if (!DRY)
		await fs.writeFile(outReport, JSON.stringify(pkgReport, null, 2), "utf8");

	return pkgReport;
}

// main
async function main() {
	info("Template Doctor v5 — Universal (recursive) starting");
	info("Root target:", rootTarget);
	info("DRY:", DRY, "BACKUP:", BACKUP);

	if (!(await fs.pathExists(rootTarget))) {
		fatal("Root target not found:", rootTarget);
		process.exit(1);
	}

	const pkgRoots = await findTemplatePackages(rootTarget);
	info("Found packages:", pkgRoots.length);

	const globalReport = {
		scanned: pkgRoots.length,
		packages: [],
		timestamp: new Date().toISOString(),
		previewFile: uploadedPreview,
	};

	// confirm unless --yes or dry
	if (!ASSUME_YES && !DRY) {
		// prompt
		const { question } = await import("readline/promises");
		const rl = await import("node:process");
		// minimal prompt (avoid complicated prompts)
		const ans = await question(
			"Proceed and modify files across all templates? (y/N) ",
		);
		if (!/^y(es)?$/i.test(ans)) {
			info("Aborted by user.");
			process.exit(0);
		}
	}

	for (const pkgRoot of pkgRoots) {
		try {
			const r = await processPackage(pkgRoot);
			globalReport.packages.push(r);
			if (r.validationAfter && r.validationAfter.ok)
				ok(`[OK] ${r.package} (${r.type})`);
			else
				warn(
					`[ISSUES] ${r.package} (${r.type}) ->`,
					r.validationAfter.missing || r.validationAfter.issues,
				);
		} catch (e) {
			fatal("Error processing", pkgRoot, e.stack || e);
		}
	}

	const out = path.join(rootTarget, "template-doctor-universal-report.json");
	if (!DRY)
		await fs.writeFile(out, JSON.stringify(globalReport, null, 2), "utf8");
	info("Global report saved:", out);
	info("Preview uploaded file path (local):", uploadedPreview);
	ok("Done.");
}

main().catch((e) => {
	fatal("Fatal:", e.stack || e);
	process.exit(1);
});
