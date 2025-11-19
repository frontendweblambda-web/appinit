import logger from "../logger";
let isVerbose = false;
/**
 * Wraps async steps with error handling and time measurement.
 */
export async function runStep(
	title: string,
	fn: () => Promise<void> | void,
): Promise<void> {
	const start = Date.now();
	logger.step(title);
	try {
		await fn();
		const ms = Date.now() - start;
		logger.info(`${title} (in ${ms}ms)`);
	} catch (err: any) {
		logger.error(`${title} failed: ${err.message}`);
		if (isVerbose) console.error(err);
		process.exit(1);
	}
}
