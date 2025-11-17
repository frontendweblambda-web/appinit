import {
	text,
	select,
	confirm,
	multiselect,
	isCancel,
	cancel,
} from "@clack/prompts";

import type {
	PromptQuestion,
	ChoiceOption,
	PromptText,
	PromptSelect,
} from "@appinit/types";

function handleCancel(value: unknown) {
	if (isCancel(value)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}
}

// ------------------------------------
// TEXT
// ------------------------------------

export async function askText(q: PromptText): Promise<string> {
	const result = await text({
		message: q.message,
		initialValue: q.initial,
	});

	if (isCancel(result)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}

	return result;
}

// ------------------------------------
// SELECT
// ------------------------------------
export async function askSelect<Value = any>(
	q: PromptSelect<Value>,
	accum: Record<string, unknown> = {},
) {
	const rawOptions: ChoiceOption<Value>[] =
		typeof q.choices === "function"
			? await q.choices(accum)
			: (q.choices ?? []);

	const mapped = rawOptions.map((opt) => ({
		label: opt.label ?? opt.title ?? String(opt.value),
		value: opt.value as string,
		hint: opt.hint!,
	}));

	const result = await select({
		...q,
		options: mapped,
	});

	if (isCancel(result)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}

	return result;
}

// ------------------------------------
// CONFIRM / TOGGLE
// ------------------------------------
export async function askConfirm(
	q: Extract<PromptQuestion, { type: "confirm" | "toggle" }>,
) {
	const result = await confirm({
		...q,
		message: q.message,
	});

	handleCancel(result);
	return result as boolean;
}

// ------------------------------------
// MULTISELECT
// ------------------------------------
export async function askMulti<Value = any>(
	q: Extract<PromptQuestion, { type: "multiselect" }>,
	accum: Record<string, any> = {},
) {
	const rawOptions: ChoiceOption<Value>[] =
		typeof q.choices === "function"
			? await q.choices(accum)
			: (q.choices ?? []);

	const mapped = rawOptions.map((opt) => ({
		label: opt.label ?? opt.title ?? String(opt.value),
		value: opt.value,
		hint: opt.hint,
	}));

	const result = await multiselect({
		...q,
		options: mapped,
	});

	handleCancel(result);
	return result;
}
