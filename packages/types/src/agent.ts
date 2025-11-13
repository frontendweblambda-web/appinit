// packages/types/src/agent.ts
// Shared agent types for Appinit OS

export interface AgentContext {
	cwd: string;
	projectName: string;
	logger: Console;
	metadata?: Record<string, unknown>;
}

export interface AgentInput {
	task: string;
	data?: Record<string, unknown>;
}

export interface AgentOutput {
	success: boolean;
	message?: string;
	data?: unknown;
}

export interface AppinitAgent {
	id: string;
	name?: string;
	version?: string;
	description?: string;

	run(input: AgentInput, ctx: AgentContext): Promise<AgentOutput> | AgentOutput;
}
export interface AgentAction {
	type: string;
	success: boolean;
	message?: string;
	data?: unknown;
}
