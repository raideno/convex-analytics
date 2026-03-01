import { defineProcessor } from "@raideno/convex-analytics/processors";
import { DiscordProcessorFactory } from "@raideno/convex-analytics/processors/discord";
import { internalConvexAnalytics } from "@raideno/convex-analytics/server";
import { DataModelFromSchemaDefinition } from "convex/server";

import schema from "./schema";

export const { store, analytics, consume } = internalConvexAnalytics({
  processors: [
    DiscordProcessorFactory({
      url: process.env.DISCORD_WEBHOOK_URL!,
      events: ["users:*"],
    }),
    defineProcessor<DataModelFromSchemaDefinition<typeof schema>>()({
      events: ["test"],
      handler: async (context, events) => {
        console.log("[events]:", events.map((e) => e.name));
        return events.map((e) => e._id);
      },
    }),
  ],
  processEveryK: 1,
});