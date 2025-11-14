import {
	text,
	select,
	confirm,
	multiselect,
	isCancel,
	cancel,
} from "@clack/prompts";

export async function askText(message: string, initial?: string) {
	const value = await text({ message, initialValue: initial });

	if (isCancel(value)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}
	return value;
}

export async function askSelect(message: string, options: any[]) {
	const value = await select({
		message,
		options: options.map((x) => ({
			label: x.title ?? x.label,
			value: x.value,
		})),
	});

	if (isCancel(value)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}
	return value;
}

export async function askConfirm(message: string, initial = true) {
	const value = await confirm({ message, initialValue: initial });

	if (isCancel(value)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}
	return value as boolean;
}

export async function askMulti(message: string, options: any[]) {
	const value = await multiselect({
		message,
		options: options.map((x) => ({
			label: x.title ?? x.label,
			value: x.value,
		})),
	});

	if (isCancel(value)) {
		cancel("Operation cancelled.");
		process.exit(1);
	}

	return value as any[];
}
