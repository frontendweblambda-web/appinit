export function createQueue(concurrency = 4) {
	const tasks: Array<() => Promise<any>> = [];
	let running = 0;

	async function runNext() {
		if (running >= concurrency || tasks.length === 0) return;
		const t = tasks.shift()!;
		running++;
		try {
			await t();
		} finally {
			running--;
			runNext();
		}
	}

	return {
		push: (fn: () => Promise<any>) => {
			tasks.push(fn);
			runNext();
		},
		idle: () =>
			new Promise<void>((resolve) => {
				const i = setInterval(() => {
					if (running === 0 && tasks.length === 0) {
						clearInterval(i);
						resolve();
					}
				}, 50);
			}),
	};
}
