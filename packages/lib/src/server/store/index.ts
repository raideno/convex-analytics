import { AnyDataModel, GenericActionCtx } from "convex/server";
import { v } from "convex/values";

import { defineMutationImplementation, InferArgs } from "@/helpers";

import { InternalConfiguration, InternalOptions } from "../types";

import { CreateEventsAndCheckThreshold } from "./operations/create-events-and-check-threshold.handler";
import { CreateEventsImplementation } from "./operations/create-events.handler";
import { FetchUnprocessedEventsImplementation } from "./operations/fetch-unprocessed-events.handler";
import { IncrementCounterImplementation } from "./operations/increment-counter.handler";
import { MarkEventsImplementation } from "./operations/mark-events.handler";
import { ResetCounterImplementation } from "./operations/reset-counter";

const OPERATIONS = [
  CreateEventsImplementation,
  FetchUnprocessedEventsImplementation,
  MarkEventsImplementation,
  IncrementCounterImplementation,
  ResetCounterImplementation,
  CreateEventsAndCheckThreshold,
];

export const StoreImplementation = defineMutationImplementation({
  name: "store",
  args: {
    operation: v.string(),
    args: v.any(),
  },
  handler: async (context, args, configuration, options) => {
    const operation = OPERATIONS.find((op) => op.name === args.operation);

    if (!operation) throw new Error(`Unknown operation "${args.operation}"`);

    return operation.handler(context, args.args, configuration, options);
  },
});

type MutationImplementations = {
  createEvents: typeof CreateEventsImplementation;
  fetchUnprocessedEvents: typeof FetchUnprocessedEventsImplementation;
  markEvents: typeof MarkEventsImplementation;
  incrementCounter: typeof IncrementCounterImplementation;
  resetCounter: typeof ResetCounterImplementation;
  createEventsAndCheckThreshold: typeof CreateEventsAndCheckThreshold;
};

type MutationArgs<T extends keyof MutationImplementations> = InferArgs<
  MutationImplementations[T]["args"]
>;

type MutationReturnType<T extends keyof MutationImplementations> = Awaited<
  ReturnType<MutationImplementations[T]["handler"]>
>;

export async function storeDispatchTyped<
  T extends keyof MutationImplementations,
>(
  operationName: T,
  args: MutationArgs<T>,
  context: GenericActionCtx<AnyDataModel>,
  _: InternalConfiguration,
  options: InternalOptions
): Promise<MutationReturnType<T>> {
  return await context.runMutation(`${options.base}:${options.store}` as any, {
    operation: operationName,
    args,
  });
}
