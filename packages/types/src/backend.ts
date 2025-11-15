/* ────────────────────────────────────────────────
   AppInit Backend Types
   Fully typed, framework-scoped, future-proof
────────────────────────────────────────────────── */
type BackendRuntime = "node" | "bun" | "deno" | "edge";
type BackendFramework =
	| "express"
	| "fastify"
	| "nestjs"
	| "hono"
	| "koa"
	| "elysia"
	| "none";
type ApiStyle = "rest" | "graphql" | "trpc" | "none";
type Database =
	| "postgres"
	| "mysql"
	| "sqlite"
	| "mongodb"
	| "planetscale"
	| "cockroach"
	| "redis"
	| "none";
type Cache = "redis" | "valkey" | "upstash" | "memory" | "none";
type MessageQueue = "kafka" | "rabbitmq" | "sqs" | "nats" | "none";
type ServerlessPlatform =
	| "vercel"
	| "netlify"
	| "cloudflare"
	| "aws-lambda"
	| "gcp-functions"
	| "none";

// ORMs (Runtime Specific - CRUCIAL FOR SYNC)
type NodeOrm = "prisma" | "drizzle" | "mongoose" | "typeorm" | "none";
type DenoOrm = "nessie" | "prisma" | "none";
type BunOrm = "prisma" | "drizzle" | "none";

export interface BackendFeatureFlags {
	docker?: boolean;
	swagger?: boolean;
	monitoring?: boolean; // Prometheus / OpenTelemetry
	logging?: boolean; // Pino/Winston
	rateLimit?: boolean;
	cors?: boolean;
}
interface CommonBackendOptions {
	api?: ApiStyle;
	database?: Database;
	cache?: Cache;
	queue?: MessageQueue;
	serverless?: ServerlessPlatform;
	features?: BackendFeatureFlags;
	devServer?: boolean;
	strictMode?: boolean;
}

export type NodeRuntimeOptions = CommonBackendOptions & {
	runtime: "node";
	backend: BackendFramework;
	orm?: NodeOrm;
};

export type BunRuntimeOptions = CommonBackendOptions & {
	runtime: "bun";
	backend: BackendFramework;
	orm?: BunOrm;
};

export type DenoRuntimeOptions = CommonBackendOptions & {
	runtime: "deno";
	backend: "hono" | "none";
	orm?: DenoOrm;
};

export type NoBackendRuntimeOptions = CommonBackendOptions & {
	runtime: BackendRuntime;
	backend: "none";
	api?: "none";
	orm?: "none";
	database?: "none";
	cache?: "none";
	queue?: "none";
	serverless?: "none";
};
// -------------------------------------
// BACKEND OPTIONS (union per runtime)
// -------------------------------------
export type BackendOptions =
	| NodeRuntimeOptions
	| BunRuntimeOptions
	| DenoRuntimeOptions
	| NoBackendRuntimeOptions;
