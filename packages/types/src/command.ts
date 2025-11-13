// packages/cli/src/types.ts

export interface CommandMeta {
	name: string;
	description?: string;
	usage?: string;
	flags?: {
		[key: string]: {
			alias?: string;
			type: "string" | "boolean";
			description?: string;
			default?: any;
		};
	};
	hidden?: boolean;
}

export type CommandHandler = (
	args: string[],
	flags: Record<string, any>,
) => Promise<number | void> | number | void;

export interface CommandModule {
	meta: CommandMeta;
	action: CommandHandler;
}
