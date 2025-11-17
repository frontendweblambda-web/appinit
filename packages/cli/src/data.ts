const REQUIRED_BASE = ["projectName", "projectType", "language"] as const;

export const REQUIRED_BY_TYPE = {
	frontend: [...REQUIRED_BASE, "framework"] as const,
	backend: [...REQUIRED_BASE, "backend"] as const,
	fullstack: [...REQUIRED_BASE, "framework", "backend"] as const,
	library: [...REQUIRED_BASE] as const,
	cli: [...REQUIRED_BASE] as const,
};
