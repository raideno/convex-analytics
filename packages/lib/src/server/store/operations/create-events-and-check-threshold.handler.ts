import { defineMutationImplementation } from "@/helpers";
import { anyApi } from "convex/server";
import { v } from "convex/values";

export const CreateEventsAndCheckThreshold = defineMutationImplementation({
  args: {
    events: v.array(
      v.object({
        name: v.string(),
        properties: v.any(),
        distinctId: v.string(),
      })
    ),
  },
  name: "createEventsAndCheckThreshold",
  handler: async (context, args, configuration, options) => {
    const processApi =
      `${options.base}:${options.process}` as unknown as typeof anyApi.analytics.process;

    await Promise.all(
      args.events.map((event) =>
        context.db.insert("analyticsEvents", {
          name: event.name,
          properties: event.properties,
          distinctId: event.distinctId,
          processedAt: null,
        })
      )
    );

    if (configuration.processEveryK === 1) {
      await context.scheduler.runAfter(
        0,
        processApi as unknown as typeof anyApi.analytics.process,
        {}
      );
    } else {
      const counter = await context.db.query("analyticsEventCounter").first();

      if (!counter) {
        await context.db.insert("analyticsEventCounter", {
          unprocessedCount: args.events.length,
          lastProcessedAt: null,
        });

        if (args.events.length >= configuration.processEveryK) {
          await context.scheduler.runAfter(
            0,
            processApi as unknown as typeof anyApi.analytics.process,
            {}
          );
        }
      } else {
        const newCount = counter.unprocessedCount + args.events.length;
        await context.db.patch(counter._id, {
          unprocessedCount: newCount,
        });

        if (newCount >= configuration.processEveryK) {
          await context.scheduler.runAfter(
            0,
            processApi as unknown as typeof anyApi.analytics.process,
            {}
          );
        }
      }
    }

    return;
  },
});
