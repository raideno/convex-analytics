import { GenericActionCtx, GenericMutationCtx } from "convex/server";
import { Infer, v, Validator } from "convex/values";

import { Logger } from "@/logger";
import { AnalyticsDataModel } from "@/schema";
import {
  InputConfiguration,
  InputOptions,
  InternalConfiguration,
  InternalOptions,
} from "@/types";

export const DEFAULT_EXECUTION_BLOCKING = false;

export const normalizeConfiguration = (
  config: InputConfiguration
): InternalConfiguration => {
  return {
    ...config,
    execution: {
      blocking: config.execution?.blocking ?? DEFAULT_EXECUTION_BLOCKING,
    },
    processEveryK: config.processEveryK,
    processors: config.processors,
  };
};

export const normalizeOptions = (
  options: Partial<InputOptions>
): InternalOptions => {
  return {
    ...options,
    store: options.store || "store",
    process: options.process || "process",
    debug: options.debug || false,
    logger: options.logger || new Logger(options.debug || false),
    base: options.base || "analytics",
  };
};

export const defineActionImplementation = <S extends ArgSchema, R>(spec: {
  args: S;
  name: string;
  handler: (
    context: GenericActionCtx<AnalyticsDataModel>,
    args: InferArgs<S>,
    configuration: InternalConfiguration,
    options: InternalOptions
  ) => R;
}) => spec;

export const defineMutationImplementation = <S extends ArgSchema, R>(spec: {
  args: S;
  name: string;
  handler: (
    context: GenericMutationCtx<AnalyticsDataModel>,
    args: InferArgs<S>,
    configuration: InternalConfiguration,
    options: InternalOptions
  ) => R;
}) => spec;

export const nullablestring = () => v.union(v.string(), v.null());
export const nullableboolean = () => v.union(v.boolean(), v.null());
export const nullablenumber = () => v.union(v.number(), v.null());
export const metadata = () =>
  v.record(v.string(), v.union(v.string(), v.number(), v.null()));
export const optionalnullableobject = <T extends ArgSchema>(object: T) =>
  v.optional(v.union(v.object(object), v.null()));
export const optionalany = () => v.optional(v.any());

export type WithOptional<T, K extends keyof T = never> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type ArgSchema = Record<
  string,
  Validator<any, "optional" | "required", any>
>;

export type InferArgs<S extends ArgSchema> = {
  [K in keyof S as S[K] extends Validator<any, "required", any>
    ? K
    : never]: Infer<S[K]>;
} & {
  [K in keyof S as S[K] extends Validator<any, "optional", any>
    ? K
    : never]?: Infer<S[K]>;
};
