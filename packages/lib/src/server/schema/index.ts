import {
  DataModelFromSchemaDefinition,
  defineSchema,
  defineTable,
} from "convex/server";
import { v } from "convex/values";

export const analyticsTables = {
  analyticsEvents: defineTable({
    name: v.string(),
    properties: v.any(),
    distinctId: v.string(),
    processedAt: v.union(v.null(), v.number()),
  })
    .index("byName", ["name"])
    .index("byDistinctId", ["distinctId"])
    .index("byProcessedAt", ["processedAt"]),
  analyticsEventCounter: defineTable({
    unprocessedCount: v.number(),
    lastProcessedAt: v.union(v.null(), v.number()),
  }),
};
const analyticsSchema = defineSchema(analyticsTables);

export type AnalyticsDataModel = DataModelFromSchemaDefinition<
  typeof analyticsSchema
>;
