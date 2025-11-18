// @appinit/core/rules/orm.rules.ts
import type { Database, ChoiceOption } from "@appinit/types";

export function determineOrmChoices(db: Database): ChoiceOption[] {
	switch (db) {
		case "mongo": // MongoDB (NoSQL) Options
			return [
				{
					label: "Mongoose",
					value: "mongoose",
					hint: "A popular **Object Data Modeling (ODM)** library for MongoDB, providing schema validation and easy object mapping.",
				},
				{
					label: "TypeORM",
					value: "typeorm",
					hint: "A versatile ORM that can be used with both SQL and NoSQL databases, including MongoDB. Supports TypeScript best.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use this if you prefer to interact with MongoDB using the native driver or another library.",
				},
			];
		case "none":
			return [{ label: "None", value: "none" }];
		default: // SQL (Relational) Database Options (Postgres, MySQL, SQLite, etc.)
			return [
				{
					label: "Prisma",
					value: "prisma",
					hint: "A modern, **type-safe ORM** with an intuitive schema definition. Uses a unique generator model for clean code and great developer experience.",
				},
				{
					label: "Drizzle ORM",
					value: "drizzle",
					hint: "A **lightweight and headless ORM** known for its performance and close integration with TypeScript type inference (no code generation needed).",
				},
				{
					label: "TypeORM",
					value: "typeorm",
					hint: "A full-featured, established ORM supporting Active Record and Data Mapper patterns. Works with many SQL databases.",
				},
				{
					label: "None",
					value: "none",
					hint: "Use this if you prefer raw SQL queries, a query builder, or another tool.",
				},
			];
	}
}
