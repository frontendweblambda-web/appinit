export type BackendOptions = {
	backendFramework?:
		| "express"
		| "fastify"
		| "nestjs"
		| "hono"
		| "koa"
		| "adonis"
		| "none";
	apiStyle?: "rest" | "graphql" | "trpc" | "rpc" | "none";
	database?: "none" | "postgresql" | "mysql" | "mongo" | "sqlite" | "supabase";
	orm?: "prisma" | "drizzle" | "typeorm" | "mongoose" | "none";
	caching?: "none" | "redis" | "memory" | "edge" | "api-cache";
	containerization?: "docker" | "podman" | "none";
	serverless?: boolean;
};
