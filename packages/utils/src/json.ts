// packages/@appinit/utils/json.ts

import { pathExists, readJson as readJsonRaw, writeFileUtf8 } from "./file";
import fs from "fs-extra";
import { isArray } from "./helpers";
import { JsonArray, JsonObject, JsonValue } from "@appinit/types";

/**
 * Safely read JSON, returning fallback if missing or invalid.
 */
export async function readJsonSafe<T = any>(
	filePath: string,
	fallback: T | null = null,
): Promise<T> {
	try {
		if (!(await pathExists(filePath))) return fallback as T;
		return (await readJsonRaw(filePath)) as T;
	} catch {
		return fallback as T;
	}
}

/**
 * Atomic JSON write using your existing writeFileUtf8() + fs.move().
 */
export async function writeJsonSafe(filePath: string, data: any, spaces = 2) {
	const tmpPath = filePath + ".tmp";

	// Write to temporary file
	await writeFileUtf8(tmpPath, JSON.stringify(data, null, spaces));

	// Move atomically
	await fs.move(tmpPath, filePath, { overwrite: true });
}

/**
 * Helper: check for plain object.
 */
export function isObject(v: unknown): v is Record<string, any> {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Deep merge two JSON objects.
 */
export function mergeJson(base: any, patch: any): JsonValue {
	// Array merge → union
	if (isArray(base) && isArray(patch)) {
		return Array.from(new Set([...base, ...patch])) as JsonArray;
	}

	// Object merge → recursive
	if (isObject(base) && isObject(patch)) {
		const out: JsonObject = { ...base };

		for (const key of Object.keys(patch)) {
			if (key in base) {
				out[key] = mergeJson(base[key], patch[key]);
			} else {
				out[key] = patch[key];
			}
		}

		return out;
	}

	// Primitive OR type mismatch → patch overrides base
	return patch;
}

/**
 * Merge JSON fragment into an existing file.
 */
export async function mergeJsonFile(filePath: string, patch: any) {
	const existing = await readJsonSafe(filePath, {});
	const merged = mergeJson(existing, patch);
	await writeJsonSafe(filePath, merged);
	return merged;
}

/**
 * Update JSON file using a function.
 */
export async function updateJson(
	filePath: string,
	modifier: (current: any) => any,
) {
	const existing = await readJsonSafe(filePath, {});
	const updated = modifier(existing);
	await writeJsonSafe(filePath, updated);
	return updated;
}
