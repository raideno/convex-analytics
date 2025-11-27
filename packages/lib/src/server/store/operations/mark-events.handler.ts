import { v } from "convex/values";

import { defineMutationImplementation } from "@/helpers";

export const MarkEventsImplementation = defineMutationImplementation({
  args: {
    eventIds: v.array(v.id("analyticsEvents")),
  },
  name: "markEvents",
  handler: async (context, args, configuration, options) => {
    const now = Date.now();

    for (const eventId of args.eventIds) {
      await context.db.patch(eventId, {
        processedAt: now,
      });
    }
  },
});
