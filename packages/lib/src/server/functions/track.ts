import { AnalyticsDataModel } from "@/schema";
import { storeDispatchTyped } from "@/store";
import { Execution, InternalConfiguration, InternalOptions } from "@/types";
import {
  anyApi,
  AnyDataModel,
  GenericActionCtx,
  GenericMutationCtx,
} from "convex/server";

export type TrackArgs = {
  name: string;
  properties: any;
  distinctId: string;
};

export const TrackImplementation = (
  context: GenericActionCtx<AnyDataModel> | GenericMutationCtx<AnyDataModel>,
  args: TrackArgs,
  execution: Execution,
  configuration: InternalConfiguration,
  options: InternalOptions
) => {
  if ("runAction" in context) {
    return trackFromAction(context, args, execution, configuration, options);
  } else if ("runMutation" in context) {
    return trackFromMutation(context, args, execution, configuration, options);
  } else {
    throw new Error("Invalid context provided to track function.");
  }
};

const trackFromMutation = async (
  context: GenericMutationCtx<AnalyticsDataModel>,
  args: TrackArgs,
  execution: Execution,
  configuration: InternalConfiguration,
  options: InternalOptions
) => {
  if (execution.blocking) {
    await context.db.insert("analyticsEvents", {
      name: args.name,
      properties: args.properties,
      distinctId: args.distinctId,
      processedAt: null,
    });

    if (configuration.processEveryK === 1) {
      await context.scheduler.runAfter(
        0,
        `${options.base}:${options.process}` as unknown as typeof anyApi.analytics.process,
        {}
      );
    } else {
      const count = await incrementEventCounter(context);
      if (count >= configuration.processEveryK) {
        await context.scheduler.runAfter(
          0,
          `${options.base}:${options.process}` as unknown as typeof anyApi.analytics.process,
          {}
        );
      }
    }
  } else {
    await context.scheduler.runAfter(
      0,
      `${options.base}:${options.store}` as unknown as typeof anyApi.analytics.store,
      {
        operation: "createEventsAndCheckThreshold",
        args: {
          events: [
            {
              name: args.name,
              properties: args.properties,
              distinctId: args.distinctId,
            },
          ],
          processEveryK: configuration.processEveryK,
          processApi: `${options.base}:${options.process}`,
        },
      }
    );
  }
};

const trackFromAction = async (
  context: GenericActionCtx<AnyDataModel>,
  args: TrackArgs,
  execution: Execution,
  configuration: InternalConfiguration,
  options: InternalOptions
) => {
  if (execution.blocking) {
    await storeDispatchTyped(
      "createEventsAndCheckThreshold",
      {
        events: [
          {
            name: args.name,
            properties: args.properties,
            distinctId: args.distinctId,
          },
        ],
      },
      context,
      configuration,
      options
    );
  } else {
    await context.scheduler.runAfter(
      0,
      `${options.base}:${options.store}` as unknown as typeof anyApi.analytics.store,
      {
        operation: "createEventsAndCheckThreshold",
        args: {
          events: [
            {
              name: args.name,
              properties: args.properties,
              distinctId: args.distinctId,
            },
          ],
          processEveryK: configuration.processEveryK,
          processApi: `${options.base}:${options.process}`,
        },
      }
    );
  }
};

const incrementEventCounter = async (
  context: GenericMutationCtx<AnalyticsDataModel>
): Promise<number> => {
  const counter = await context.db.query("analyticsEventCounter").first();

  if (!counter) {
    await context.db.insert("analyticsEventCounter", {
      unprocessedCount: 1,
      lastProcessedAt: null,
    });
    return 1;
  }

  const newCount = counter.unprocessedCount + 1;
  await context.db.patch(counter._id, {
    unprocessedCount: newCount,
  });
  return newCount;
};
