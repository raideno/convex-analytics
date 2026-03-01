import {
  AnyDataModel,
  GenericActionCtx,
  GenericMutationCtx
} from "convex/server";

import { InferArgs, WithOptional } from "@/helpers";
import { Logger } from "@/logger";

import { AnalyticsDataModel } from "./schema";
import { StoreImplementation } from "./store";

// Processor is now generic over both DataModel AND the event names tuple
// so literal event names are preserved through the type system
export type Processor<
  DataModel extends AnyDataModel = any,
  TEvents extends ReadonlyArray<string> = ReadonlyArray<string>
> = {
  events: TEvents;
  handler: (
    context: GenericActionCtx<DataModel>,
    events: Array<AnalyticsDataModel["analyticsEvents"]["document"]>
  ) => Promise<Array<string>>;
};

export type Execution = {
  blocking: boolean;
};

export interface InternalConfiguration {
  processors: ReadonlyArray<Processor<any, any>>;
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

// Helper to expand a single string literal with a wildcard pattern
type ExpandWildcard<T extends string> = T extends `${infer Prefix}*${infer Suffix}`
  ? T | `${Prefix}${string}${Suffix}` | (Suffix extends "" ? (Prefix extends `${infer P}:` ? P : never) : never)
  : T;

// Map over union of string literals to expand each one
type ExpandWildcards<T extends string> = T extends any ? ExpandWildcard<T> : never;

// Extracts the union of all literal event name strings across all processors
// Works because const generic preserves the readonly tuple with literal TEvents
// Now supports wildcard expansion for type safety on track calls
export type ExtractEventNames<
  T extends ReadonlyArray<Processor<any, any>>
> = ExpandWildcards<T[number]["events"][number]>;

export type TypedTrackArgs<
  TProcessors extends ReadonlyArray<Processor<any, any>>
> = {
  name: ExtractEventNames<TProcessors>;
  properties: any;
  distinctId: string;
};