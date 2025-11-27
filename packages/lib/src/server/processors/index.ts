import { AnyDataModel, GenericActionCtx } from "convex/server";
import { GenericId } from "convex/values";

import { defineActionImplementation } from "@/helpers";
import { storeDispatchTyped } from "@/store";

import type { Processor } from "@/types";

export { Processor };

export const ProcessImplementation = defineActionImplementation({
  args: {},
  name: "convex-analytics-processor-implementation",
  handler: async (context, args, configuration, options) => {
    const events = await storeDispatchTyped(
      "fetchUnprocessedEvents",
      {},
      context as unknown as GenericActionCtx<AnyDataModel>,
      configuration,
      options
    );

    const processedIds = [];

    for (const processor of configuration.processors) {
      const compatible = events.filter((event) => {
        return processor.events.some((pattern) => {
          return new RegExp(
            `^${pattern
              .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
              .replace(/\\\*/g, ".*")}$`
          ).test(event.name);
        });
      });

      if (compatible.length === 0) continue;

      try {
        const processedEventIds = await processor.handler(
          context as unknown as GenericActionCtx<AnyDataModel>,
          compatible
        );

        processedIds.push(...processedEventIds);
      } catch (error) {
        console.error(
          `Error processing events with processor for events [${processor.events.join(
            ", "
          )}]:`,
          error
        );
      }
    }

    await storeDispatchTyped(
      "markEvents",
      {
        eventIds: Array.from(new Set(processedIds)) as Array<
          GenericId<"analyticsEvents">
        >,
      },
      context as unknown as GenericActionCtx<AnyDataModel>,
      configuration,
      options
    );
  },
});
