import {
  DataModelFromSchemaDefinition,
  defineSchema,
  defineTable,
} from "convex/server";
import { v } from "convex/values";

export const analyticsTables = {
  events: defineTable({
    name: v.string(),
    properties: v.any(),
    distinctId: v.string(),
    processedAt: v.union(v.null(), v.number()),
  })
    .index("byName", ["name"])
    .index("byProcessedAt", ["processedAt"]),
};

const analyticsSchema = defineSchema(analyticsTables);

export type AnalyticsDataModel = DataModelFromSchemaDefinition<
  typeof analyticsSchema
>;
