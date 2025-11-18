import pkg from "../../package.json" assert { type: "json" };
export function printVersion() {
	console.log((pkg.version || process.env.APPINIT_VERSION) ?? "0.0.0");
}
