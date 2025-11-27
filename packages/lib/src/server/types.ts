import {
  AnyDataModel,
  GenericActionCtx,
  GenericMutationCtx,
} from "convex/server";

import { InferArgs, WithOptional } from "@/helpers";
import { Logger } from "@/logger";

import { AnalyticsDataModel } from "./schema";
import { StoreImplementation } from "./store";

/**
 * TODO: make it so tags can be a function that returns an array this way we have maximal flexibility.
 * TODO: make it so the size can be a function that returns a number based on the tag this way we have maximal flexibility.
 * TODO: add a retries mechanism. add max retries configuration as well.
 */
export type Processor = {
  events: Array<string>;
  handler: (
    context: GenericActionCtx<AnyDataModel>,
    events: Array<AnalyticsDataModel["analyticsEvents"]["document"]>
  ) => Promise<Array<string>>;
};

export type Execution = {
  blocking: boolean;
};

export interface InternalConfiguration {
  processors: Array<Processor>;
  processEveryK: number;
  execution: Execution;
  callback?: {
    unstable__afterChange?: (
      context: GenericMutationCtx<any>,
      args: InferArgs<(typeof StoreImplementation)["args"]>,
      returned: any
    ) => Promise<void>;
  };
}
export type InputConfiguration = WithOptional<
  InternalConfiguration,
  "execution"
>;

export interface InternalOptions {
  store: string;
  process: string;
  debug: boolean;
  logger: Logger;
  base: string;
}
export type InputOptions = WithOptional<
  InternalOptions,
  "store" | "process" | "debug" | "logger" | "base"
>;
