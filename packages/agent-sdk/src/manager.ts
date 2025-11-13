// packages/agent-sdk/src/runner/manager.ts

import type { AppinitAgent } from "@appinit/types";
import { AgentRunner } from "./runner.js";

export class AgentManager {
	private agents = new Map<string, AppinitAgent>();

	register(agent: AppinitAgent) {
		this.agents.set(agent.id, agent);
	}

	get(id: string): AppinitAgent | undefined {
		return this.agents.get(id);
	}

	getRunner(id: string) {
		const agent = this.get(id);
		if (!agent) throw new Error(`Agent ${id} not found.`);
		return new AgentRunner(agent);
	}

	list() {
		return [...this.agents.values()];
	}
}
