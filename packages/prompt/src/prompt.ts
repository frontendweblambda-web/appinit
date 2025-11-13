import { logger } from "@appinit/utils";
import type { Answers } from "@appinit/types";
import prompts, { PromptObject } from "prompts";

// Global defaults
const defaultPromptOptions = {
	onCancel: () => {
		logger.error("Prompt cancelled by user.");
		throw new Error("Prompt cancelled");
	},
};

// --------------------------------------------------------
// ask(): base wrapper
// --------------------------------------------------------
export async function ask<T extends Record<string, any> = Record<string, any>>(
	questions: PromptObject | PromptObject[],
	opts: Record<string, any> = {},
): Promise<T> {
	try {
		const response = await prompts(questions as any, {
			...defaultPromptOptions,
			...opts,
		});

		return response as T;
	} catch (err) {
		if ((err as Error).message === "Prompt cancelled") {
			throw err;
		}
		logger.error("Prompt error:", (err as Error).message);
		throw err;
	}
}

// --------------------------------------------------------
// askAnswers(): ALWAYS returns Partial<Answers>
// --------------------------------------------------------
export async function askAnswers(
	questions: PromptObject | PromptObject[],
	initial: Partial<Answers> = {},
): Promise<Partial<Answers>> {
	const result = await ask<Record<string, any>>(questions);

	// Safe merging (TS guaranteed Partial<Answers>)
	return {
		...initial,
		...(result as Partial<Answers>),
	};
}

// --------------------------------------------------------
// Typed helper questions
// --------------------------------------------------------
export async function askText<K extends keyof Answers>(
	key: K,
	message: string,
	initial?: Answers[K],
): Promise<Pick<Answers, K>> {
	const r = await ask<{ value: Answers[K] }>({
		type: "text",
		name: "value",
		message,
		initial: initial as any,
	});

	// TS-safe: forces field to match Answers[K]
	return { [key]: r.value } as Pick<Answers, K>;
}

export async function askToggle<K extends keyof Answers>(
	key: K,
	message: string,
	initial?: boolean,
): Promise<Pick<Answers, K>> {
	const r = await ask<{ value: boolean }>({
		type: "toggle",
		name: "value",
		message,
		active: "yes",
		inactive: "no",
		initial,
	});

	// Cast is safe because you control Answers[K] types
	return { [key]: r.value as Answers[K] } as Pick<Answers, K>;
}

export async function askSelect<K extends keyof Answers, T extends Answers[K]>(
	key: K,
	message: string,
	choices: { title: string; value: T }[],
	initialIndex = 0,
): Promise<Pick<Answers, K>> {
	const r = await ask<{ value: T }>({
		type: "select",
		name: "value",
		message,
		choices,
		initial: initialIndex,
	});

	return { [key]: r.value } as unknown as Pick<Answers, K>;
}
