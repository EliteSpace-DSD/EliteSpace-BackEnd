# Database Overview

The database is a PostgreSQL instance hosted on Supabase. There is also a storage bucket initialized in Supabase for the project.

There is a production and a development database.

## Initialization

The database connection is initialized in the `index.ts` file and requires a variable called `DATABASE_URL` set in the `.env` file, which corresponds to the connection string from Supabase.

## Object-Relational Mapping (ORM)

The ORM tool used to interact with the database is Drizzle. It is a TypeScript-based tool that provides a way to interact with the database in a way that is relational and SQL-like queries. This can help make it easier to interact with the database in the code environment while having an interface that is similar to SQL.
Documentation can be found [here](https://orm.drizzle.team/docs/overview).

## Migrations

Migrations are handled with Drizzle Kit. Documentation can be found [here](https://orm.drizzle.team/docs/drizzle-kit).

There are 3 commands that can be used to manage the database:

- `db:generate`: This runs the command `npx drizzle-kit generate` to generate a new migration. This is used to create a new migration when a new model is added or when changes are made to the existing models.

- `db:migrate`: Runs the command `npx drizzle-kit migrate` to apply migrations. This command applies the latest migration to the database, updating the tables to the latest state.

- `db:drop`: Runs the command `npx drizzle-kit drop` to delete the selected migration.

## Schema

The tables are defined in the `schema.ts` file. The schema defines the tables and fields for each table, as well as the relationships between all tables.

The schema file also contains inferred types for each table. For example, the `tenants` table has a type called `TenantInsertType`, used to provide inferred type info for the shape of the data expected when inserting a new tenant. And a a second type called `TenantSelectType`, used to provide inferredtype info for the shape of the data returned from the database.

## Models

The models folder contains methods for interacting with the database tables, for example, CRUD operations. Each table is referred to as a model, and functions for each table are defined in the respective model file.