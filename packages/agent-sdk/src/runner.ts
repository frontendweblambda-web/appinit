// packages/agent-sdk/src/runner/runner.ts

import type {
	AppinitAgent,
	AgentInput,
	AgentOutput,
	AgentContext,
} from "@appinit/types";

export class AgentRunner {
	constructor(private agent: AppinitAgent) {}

	async run(input: AgentInput, ctx: AgentContext): Promise<AgentOutput> {
		try {
			const result = await this.agent.run(input, ctx);
			return {
				success: true,
				...result,
			};
		} catch (err: any) {
			ctx.logger.error(err);
			return {
				success: false,
				message: err?.message ?? "Unknown error",
			};
		}
	}
}
