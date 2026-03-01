import {
  GenericActionCtx,
  GenericMutationCtx,
  internalActionGeneric,
  internalMutationGeneric,
} from "convex/server";

import { normalizeConfiguration, normalizeOptions } from "./helpers";
import { StoreImplementation } from "./store";

import type {
  ExtractEventNames,
  InputConfiguration,
  InputOptions,
  Processor,
} from "./types";

import { TrackImplementation } from "./functions/track";
import { ConsumeImplementation } from "./processors";

export { Logger } from "./logger";
export { analyticsTables } from "./schema";
export { InputConfiguration };

export const internalConvexAnalytics =
  <const TProcessors extends ReadonlyArray<Processor<any, any>>>(
    configuration_: Omit<InputConfiguration, "processors"> & { processors: TProcessors },
    options_?: InputOptions
  ) => {
    const ConvexAnalyticsConfiguration = normalizeConfiguration(configuration_);
    const ConvexAnalyticsOptions = normalizeOptions(options_ || {});

    // TProcessors is inferred directly from the literal array, before any widening,
    // so ExtractEventNames yields the exact event name string union.
    type ValidEventNames = ExtractEventNames<TProcessors>;

    return {
      analytics: {
        /**
         * Tracks an event using the provided context.
         * @param context the context, can be either an action or mutation context.
         * @param args the arguments for the track function.
         * @param execution optional execution overrides.
         * @returns void
         */
        track: (
          context: GenericActionCtx<any> | GenericMutationCtx<any>,
          args: {
            name: ValidEventNames;
            properties: any;
            distinctId: string;
          },
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
      consume: internalActionGeneric({
        args: ConsumeImplementation.args,
        handler: async (context, args) =>
          ConsumeImplementation.handler(
            context,
            args,
            ConvexAnalyticsConfiguration,
            ConvexAnalyticsOptions
          ),
      }),
    };
  };