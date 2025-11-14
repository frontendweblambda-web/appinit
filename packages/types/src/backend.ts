/* ────────────────────────────────────────────────
   AppInit Backend Types
   Fully typed, framework-scoped, future-proof
────────────────────────────────────────────────── */

// -------------------------------------
// Backend runtime environments
// -------------------------------------
export type BackendRuntime = "node" | "bun" | "deno";

// -------------------------------------
// Backend frameworks
// -------------------------------------
export type BackendFramework =
	| "express"
	| "fastify"
	| "nestjs"
	| "hono"
	| "koa"
	| "elysia"
	| "none";

// -------------------------------------
// API Modes
// -------------------------------------
export type ApiStyle = "rest" | "graphql" | "trpc" | "none";

// -------------------------------------
// ORM choices per ecosystem
// -------------------------------------
export type JSOrm = "prisma" | "drizzle" | "mongoose" | "typeorm" | "none";
export type DenoOrm = "nessie" | "prisma" | "none";
export type BunOrm = "prisma" | "drizzle" | "none";

// -------------------------------------
// Database engines
// -------------------------------------
export type Database =
	| "postgres"
	| "mysql"
	| "sqlite"
	| "mongodb"
	| "planetscale"
	| "cockroach"
	| "redis"
	| "none";

// -------------------------------------
// Cache / KV
// -------------------------------------
export type Cache = "redis" | "valkey" | "upstash" | "memory" | "none";

// -------------------------------------
// Message queues / streaming
// -------------------------------------
export type MessageQueue = "kafka" | "rabbitmq" | "sqs" | "nats" | "none";

// -------------------------------------
// Serverless deployment targets
// -------------------------------------
export type ServerlessPlatform =
	| "vercel"
	| "netlify"
	| "cloudflare"
	| "aws-lambda"
	| "gcp-functions"
	| "none";

// -------------------------------------
// Backend Features flags
// -------------------------------------
export interface BackendFeatureFlags {
	docker?: boolean;
	swagger?: boolean;
	monitoring?: boolean; // Prometheus / OpenTelemetry
	logging?: boolean; // Pino/Winston
	rateLimit?: boolean;
	cors?: boolean;
}

// -------------------------------------
// BACKEND OPTIONS (union per runtime)
// -------------------------------------
export type BackendOptions =
	| {
			runtime: "node";
			backend: BackendFramework;
			api?: ApiStyle;

			orm?: JSOrm;
			database?: Database;
			cache?: Cache;
			queue?: MessageQueue;

			serverless?: ServerlessPlatform;
			features?: BackendFeatureFlags;

			devServer?: boolean;
			strictMode?: boolean;
	  }
	| {
			runtime: "bun";
			backend: BackendFramework;
			api?: ApiStyle;

			orm?: BunOrm;
			database?: Database;
			cache?: Cache;
			queue?: MessageQueue;

			serverless?: ServerlessPlatform;
			features?: BackendFeatureFlags;

			devServer?: boolean;
			strictMode?: boolean;
	  }
	| {
			runtime: "deno";
			backend: "hono" | "none";
			api?: ApiStyle;

			orm?: DenoOrm;
			database?: Database;
			cache?: Cache;
			queue?: MessageQueue;

			serverless?: ServerlessPlatform;
			features?: BackendFeatureFlags;

			devServer?: boolean;
			strictMode?: boolean;
	  }
	| {
			runtime: "node" | "bun" | "deno";
			backend: "none";
			api?: "none";

			orm?: "none";
			database?: "none";
			cache?: "none";
			queue?: "none";

			serverless?: "none";
			features?: BackendFeatureFlags;

			devServer?: boolean;
			strictMode?: boolean;
	  };
