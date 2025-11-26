import { defineActionImplementation } from "@/helpers";
import { AnalyticsDataModel } from "@/schema";
import { AnyDataModel, GenericActionCtx } from "convex/server";
import { v } from "convex/values";

export const ProcessImplementation = defineActionImplementation({
  args: {
    eventIds: v.union(v.null(), v.array(v.id("events"))),
  },
  name: "convex-analytics-processor-implementation",
  handler: async (context, args, configuration, options) => {
    /**
     * TODO: create a special case in store function to fetch Ids.
     * TODO: create a special case in store function to mark events as processed.
     */
    const eventIds = args.eventIds || [];

    /**
     * TODO: create a special case in store function to fetch events by ids.
     */
    const events: Array<AnalyticsDataModel["events"]["document"]> = [];

    /**
     * 1- go over processors defined in configuration.
     * 2- for each processor, get compatible events based on regex matching.
     * 3- pass them to the processor to handle.
     * 4- call in blocking or scheduled mode depending on the configuration.
     */

    for (const processor of configuration.processors) {
      // Filter events that match this processor's event patterns
      const compatible = events.filter((event) => {
        return processor.events.some((pattern) => {
          // Convert pattern to regex (supporting wildcards like "page_*")
          const regexPattern = pattern
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape special regex chars
            .replace(/\\\*/g, ".*"); // Convert * to .* for wildcard matching

          const regex = new RegExp(`^${regexPattern}$`);
          return regex.test(event.name);
        });
      });

      if (compatible.length === 0) continue;

      // Call the processor handler with the batch
      // Using await to handle in blocking mode (adjust based on your needs)
      /**
       * TODO:
       * retries are sort of automatically handled, if a failure ever happens,
       * the action will just fail, the events wont be marked as processed and the next run
       * they'll be picked up again.
       */
      // TODO: retries are sort of automatically handled, if a failure happens
      //
      try {
        // TODO: this shouldn't block too much, consider making it non-blocking based on configuration
        await processor.handler(
          context as unknown as GenericActionCtx<AnyDataModel>,
          batch
        );

        // Mark events in this batch as processed
        // TODO: Implement the actual marking logic via store function
        const processedIds = batch.map((e) => e._id);
        // await storeDispatchTyped(...) // mark as processed
      } catch (error) {
        // Log error and continue with next batch
        //   options.logger.error(`Processor failed for batch`, {
        //     error,
        //     processor: processor.events,
        //   });
        // TODO: Implement retry logic here based on configuration
      }
    }
  },
});
