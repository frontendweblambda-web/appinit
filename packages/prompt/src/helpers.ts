import {
	text,
	select,
	confirm,
	multiselect,
	isCancel,
	cancel,
} from "@clack/prompts";

import type { PromptQuestion, ChoiceOption } from "@appinit/types";

function handleCancel(value: unknown) {
	if (isCancel(value)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}
}

// ------------------------------------
// TEXT
// ------------------------------------
export async function askText(q: PromptQuestion) {
	const result = await text({
		message: q.message,
		initialValue: q.initial,
	});

	handleCancel(result);
	return result;
}

// ------------------------------------
// SELECT
// ------------------------------------
export async function askSelect(q: PromptQuestion, accum: Record<string, any>) {
	const rawOptions: ChoiceOption[] =
		typeof q.choices === "function"
			? await q.choices(accum)
			: (q.choices ?? []);

	const mapped = rawOptions.map((opt: ChoiceOption) => ({
		label: opt.label ?? opt.title ?? String(opt.value),
		value: opt.value,
	}));

	const result = await select({
		message: q.message,
		options: mapped,
		initialValue: q.initial,
	});

	handleCancel(result);
	return result;
}

// ------------------------------------
// CONFIRM
// ------------------------------------
export async function askConfirm(q: PromptQuestion) {
	const result = await confirm({
		message: q.message,
		initialValue: !!q.initial,
	});

	handleCancel(result);
	return result;
}

// ------------------------------------
// MULTISELECT
// ------------------------------------
export async function askMulti(q: PromptQuestion, accum: Record<string, any>) {
	const rawOptions: ChoiceOption[] =
		typeof q.choices === "function"
			? await q.choices(accum)
			: (q.choices ?? []);

	const mapped = rawOptions.map((opt: ChoiceOption) => ({
		label: opt.label ?? opt.title ?? String(opt.value),
		value: opt.value,
	}));

	const result = await multiselect({
		message: q.message,
		options: mapped,
		initialValues: q.initial,
	});

	handleCancel(result);
	return result as any[];
}
