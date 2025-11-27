import { defineMutationImplementation } from "@/helpers";

export const FetchUnprocessedEventsImplementation =
  defineMutationImplementation({
    args: {},
    name: "fetchUnprocessedEvents",
    handler: async (context, args, configuration, options) => {
      return context.db
        .query("analyticsEvents")
        .withIndex("byProcessedAt", (q) => q.eq("processedAt", null))
        .collect();
    },
  });
