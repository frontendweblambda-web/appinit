import { appStyle, theme } from "../theme/index"; // assume this is your color helper

export function printFooter(ctx: string) {
	const term = process.stdout.columns || 80;
	const line = "─".repeat(Math.min(term, 60));

	console.log("");
	console.log(theme.success(line));
	console.log(theme.success("✨ Project created successfully!"));
	console.log("");

	// ► Next steps (follow Vercel / Expo convention)
	console.log(appStyle.bold("Next steps:"));
	console.log(`  ${theme.primary("cd " + ctx)}`);
	console.log(`  ${theme.primary("npm install")}`);
	console.log(`  ${theme.primary("npm run dev")}`);
	console.log("");

	console.log(
		theme.dim("💡 Tip: Run `npm run build` to produce a production build."),
	);
	console.log(theme.success(line));
	console.log("");
}
