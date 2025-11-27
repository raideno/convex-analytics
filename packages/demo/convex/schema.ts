import { authTables } from "@convex-dev/auth/server";
import { analyticsTables } from "@raideno/convex-analytics/server";
import { defineSchema } from "convex/server";

export default defineSchema({
  ...analyticsTables,
  ...authTables,
});
