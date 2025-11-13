export interface DeployProvider {
	id: string;
	name: string;

	/**
	 * Execute the deploy command.
	 */
	deploy(projectPath: string, options?: Record<string, any>): Promise<void>;

	/**
	 * Optional provider validation before deploy.
	 */
	validate?(projectPath: string): Promise<void> | void;
}

export interface DeployContext {
	cwd: string;
	projectName: string;
	target: string;
	logger: Console;
	options?: Record<string, any>;
}
