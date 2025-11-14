import mri from "mri";

export type CLICommand = {
	name: string;
	args: string[];
	flags: Record<string, any>;
};

export function parseFlags(argv: string[]): CLICommand {
	// argv expected like process.argv
	const args = argv.slice(2);
	const parsed = mri(args, {
		boolean: ["help", "non-interactive", "skip-install", "no-git"],
		alias: { t: "template", h: "help" },
	});

	const name = String(parsed._[0] ?? "help");
	const cmdArgs = parsed._.slice(1).map(String);

	return {
		name,
		args: cmdArgs,
		flags: parsed,
	};
}

// export function parseFlags(argv: string[]) {
// 	const args: string[] = [];
// 	const flags: Record<string, any> = {};

// 	for (let i = 0; i < argv.length; i++) {
// 		const a = argv[i];

// 		// --- positional argument ---
// 		if (!a.startsWith("-")) {
// 			args.push(a);
// 			continue;
// 		}

// 		// --- "--" => rest are args ---
// 		if (a === "--") {
// 			args.push(...argv.slice(i + 1));
// 			break;
// 		}

// 		// --- long flag with "=" e.g. --port=3000 ---
// 		if (a.startsWith("--") && a.includes("=")) {
// 			const [key, value] = a.slice(2).split("=");
// 			assignFlag(flags, key, value);
// 			continue;
// 		}

// 		// --- long flag e.g. --port 3000 or --dev ---
// 		if (a.startsWith("--")) {
// 			const key = a.slice(2);

// 			// boolean negation
// 			if (key.startsWith("no-")) {
// 				flags[key.slice(3)] = false;
// 				continue;
// 			}

// 			const next = argv[i + 1];
// 			if (!next || next.startsWith("-")) {
// 				flags[key] = true;
// 			} else {
// 				assignFlag(flags, key, next);
// 				i++;
// 			}
// 			continue;
// 		}

// 		// --- short flags cluster: -abc or -p 3000 ---
// 		if (a.startsWith("-")) {
// 			const shorts = a.slice(1);

// 			// -p 3000
// 			if (shorts.length === 1) {
// 				const key = shorts;
// 				const next = argv[i + 1];
// 				if (!next || next.startsWith("-")) {
// 					flags[key] = true;
// 				} else {
// 					assignFlag(flags, key, next);
// 					i++;
// 				}
// 				continue;
// 			}

// 			// -abc -> { a:true, b:true, c:true }
// 			for (const ch of shorts.split("")) {
// 				flags[ch] = true;
// 			}
// 		}
// 	}

// 	return { args, flags };
// }
// function assignFlag(obj: Record<string, any>, key: string, value: string) {
// 	// auto numbers
// 	const num = Number(value);
// 	const v = Number.isNaN(num) ? value : num;

// 	// multiple flags accumulate in array
// 	if (obj[key] !== undefined) {
// 		if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
// 		obj[key].push(v);
// 	} else obj[key] = v;
// }
