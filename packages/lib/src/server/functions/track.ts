import { storeDispatchTyped } from "@/store";
import { Execution, InternalConfiguration, InternalOptions } from "@/types";
import {
  anyApi,
  AnyDataModel,
  GenericActionCtx,
  GenericMutationCtx,
} from "convex/server";

export type TrackArgs = {
  tag: string;
  content: any;
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

const trackFromMutation = (
  context: GenericMutationCtx<AnyDataModel>,
  args: TrackArgs,
  execution: Execution,
  _: InternalConfiguration,
  options: InternalOptions
) => {
  if (execution.blocking) {
    return context.db.insert("events", {
      tag: args.tag,
      content: args.content,
      processedAt: null,
    });
  } else {
    return context.scheduler.runAfter(
      0,
      `${options.base}:${options.store}` as unknown as typeof anyApi.analytics.store,
      {
        table: "events",
        operation: "insert",
        data: {
          tag: args.tag,
          content: args.content,
          processedAt: null,
        },
      }
    );
  }
};

const trackFromAction = (
  context: GenericActionCtx<AnyDataModel>,
  args: TrackArgs,
  execution: Execution,
  configuration: InternalConfiguration,
  options: InternalOptions
) => {
  if (execution.blocking)
    return storeDispatchTyped(
      {
        table: "events",
        operation: "insert",
        data: {
          tag: args.tag,
          content: args.content,
          processedAt: null,
        },
      },
      context,
      configuration,
      options
    );
  else
    return context.scheduler.runAfter(
      0,
      `${options.base}:${options.store}` as unknown as typeof anyApi.analytics.store,
      {
        table: "events",
        operation: "insert",
        data: {
          tag: args.tag,
          content: args.content,
          processedAt: null,
        },
      }
    );
};
