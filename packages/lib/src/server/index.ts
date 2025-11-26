import {
  anyApi,
  AnyDataModel,
  Crons,
  GenericActionCtx,
  GenericMutationCtx,
  internalActionGeneric,
  internalMutationGeneric,
} from "convex/server";

import { normalizeConfiguration, normalizeOptions } from "./helpers";
import { StoreImplementation } from "./store";

import type { InputConfiguration, InputOptions } from "./types";

import { TrackImplementation } from "./functions/track";
import { ProcessImplementation } from "./processors";

export { analyticsTables } from "./schema";

export { Logger } from "./logger";

export { InputConfiguration };

export const internalConvexAnalytics = (
  configuration_: InputConfiguration,
  options_: InputOptions
) => {
  const ConvexAnalyticsConfiguration = normalizeConfiguration(configuration_);
  const ConvexAnalyticsOptions = normalizeOptions(options_);

  /**
   * TODO: tag validation will be done in configuration by passing processors through a function
   */
  return {
    addCronJobs: (
      crons: Crons,
      interval?: Parameters<Crons["interval"]>[1]
    ) => {
      crons.interval(
        "convex-analytics-process-events",
        interval || { minutes: 1 },
        `${ConvexAnalyticsOptions.base}:${ConvexAnalyticsOptions.process}` as unknown as typeof anyApi.analytics.process
      );
    },
    analytics: {
      /**
       * Tracks an event using the provided context.
       * @param context the context, can be either an action or mutation context.
       * @param args the arguments for the track function.
       * @param blocking whether this call is blocking or not, when set to false the event will be scheduled to not block the current execution. Defaults to false.
       * @param process whether this call is blocking or not, when set to false the event will be scheduled to not block the current execution. Defaults to false.
       * @returns void
       */
      track: (
        context:
          | GenericActionCtx<AnyDataModel>
          | GenericMutationCtx<AnyDataModel>,
        args: Parameters<typeof TrackImplementation>[1],
        execution?: {
          blocking?: boolean;
          process?: boolean;
        }
      ) =>
        TrackImplementation(
          context,
          args,
          {
            ...execution,
            blocking:
              execution?.blocking ??
              ConvexAnalyticsConfiguration.execution.blocking,
          },
          ConvexAnalyticsConfiguration,
          ConvexAnalyticsOptions
        ),
    },
    store: internalMutationGeneric({
      args: StoreImplementation.args,
      handler: async (context, args) =>
        StoreImplementation.handler(
          context,
          args,
          ConvexAnalyticsConfiguration,
          ConvexAnalyticsOptions
        ),
    }),
    process: internalActionGeneric({
      args: ProcessImplementation.args,
      handler: async (context, args) =>
        ProcessImplementation.handler(
          context,
          args,
          ConvexAnalyticsConfiguration,
          ConvexAnalyticsOptions
        ),
    }),
  };
};
