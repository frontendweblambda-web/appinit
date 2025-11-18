// @appinit/core/defaults/get-default-infra.ts
export function getDefaultInfra({
	projectType,
	framework,
}: {
	projectType: string;
	framework: string;
}) {
	// ❌ None needed for these
	if (["library", "cli"].includes(projectType)) {
		return {
			logging: "none",
			monitoring: false,
			analytics: false,
			featureFlags: false,
		};
	}

	// 🌐 Frontend project defaults
	if (projectType === "frontend") {
		return {
			logging: "none",
			monitoring: false,
			analytics: false, // often set manually
			featureFlags: false,
		};
	}

	// 🧠 Backend / Fullstack defaults
	switch (framework) {
		case "nest":
			return {
				logging: "pino",
				monitoring: true,
				analytics: false,
				featureFlags: false,
			};

		case "express":
		case "fastify":
			return {
				logging: "pino",
				monitoring: false,
				analytics: false,
				featureFlags: false,
			};

		case "hono":
			return {
				logging: "none",
				monitoring: false,
				analytics: false,
				featureFlags: false,
			};

		default:
			return {
				logging: "pino",
				monitoring: false,
				analytics: false,
				featureFlags: false,
			};
	}
}
