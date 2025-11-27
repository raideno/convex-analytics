import { defineMutationImplementation } from "@/helpers";
import { v } from "convex/values";

export const CreateEventsImplementation = defineMutationImplementation({
  args: {
    events: v.array(
      v.object({
        name: v.string(),
        properties: v.any(),
        distinctId: v.string(),
      })
    ),
  },
  name: "createEvents",
  handler: async (context, args, configuration, options) => {
    for (const event of args.events) {
      await context.db.insert("analyticsEvents", {
        name: event.name,
        properties: event.properties,
        distinctId: event.distinctId,
        processedAt: null,
      });
    }
  },
});
