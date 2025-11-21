// parseFlags.test.js
import assert from "node:assert/strict";
import test from "node:test";
import { parseFlags } from "../core/parse-flags";

test("parses simple boolean flags", () => {
	const { flags } = parseFlags(["node", "cli", "--verbose"]);
	assert.equal(flags.verbose, true);
});

test("parses simple string flags", () => {
	const { flags } = parseFlags(["node", "cli", "--project-name", "test"]);
	assert.equal(flags.projectName, "test");
});

test("ignores unknown flags", () => {
	const { flags } = parseFlags(["node", "cli", "--unknown", "x"]);
	assert.equal(flags.noConsole, undefined);
});

// -----------------------------
// DEFAULTS
// -----------------------------
test("applies defaults", () => {
	const { flags } = parseFlags(["node", "cli"]);
	assert.equal(flags.install, true);
	assert.equal(flags.git, false);
	assert.equal(flags.skipInstall, false);
});

// -----------------------------
// ALIASES
// -----------------------------
test("short alias", () => {
	const { flags } = parseFlags(["node", "cli", "-h"]);
	assert.equal(flags.help, true);
});

test("long alias", () => {
	const { flags } = parseFlags(["node", "cli", "--non-interactive"]);
	assert.equal(flags.nonInteractive, true);
});

// -----------------------------
// NORMALIZE MAP
// -----------------------------
test("normalize map: ai-enhance", () => {
	const { flags } = parseFlags(["node", "cli", "--ai-enhance"]);
	assert.equal(flags.aiEnhance, true);
});

// -----------------------------
// NEGATION FLAGS
// -----------------------------
test("negated boolean flag", () => {
	const { flags } = parseFlags(["node", "cli", "--no-git"]);
	assert.equal(flags.git, false);
});

test("negation overrides positive", () => {
	const { flags } = parseFlags(["node", "cli", "--git", "--no-git"]);
	assert.equal(flags.git, false);
});

// -----------------------------
// CAMELCASE RESTORATION
// -----------------------------
test("kebab to camel", () => {
	const { flags } = parseFlags(["node", "cli", "--project-name", "demo"]);
	assert.equal(flags.projectName, "demo");
});

// -----------------------------
// MULTI-FLAGS
// -----------------------------
test("multi flag: multiple values", () => {
	const { flags } = parseFlags([
		"node",
		"cli",
		"--modules",
		"a",
		"--modules",
		"b",
	]);
	assert.deepEqual(flags.modules, ["a", "b"]);
});

test("multi flag: no empty entries", () => {
	const { flags } = parseFlags(["node", "cli", "--modules"]);
	assert.deepEqual(flags.modules, []);
});

// -----------------------------
// POSITIONAL
// -----------------------------
test("command name", () => {
	const cmd = parseFlags(["node", "cli", "create"]);
	assert.equal(cmd.name, "create");
});

test("positional args", () => {
	const cmd = parseFlags(["node", "cli", "create", "my-app"]);
	assert.equal(cmd.name, "create");
	assert.equal(cmd.args.at(-1), "my-app");
});
