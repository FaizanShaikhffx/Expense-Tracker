import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.ts",
  dialect: "postgresql",
  // driver: "pglite",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL
  }
});
