import "dotenv/config"; // Still load for CLI if needed
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // No engine/datasource here
   
});
