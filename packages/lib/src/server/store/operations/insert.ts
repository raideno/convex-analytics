import { GenericMutationCtx, WithoutSystemFields } from "convex/server";
import { GenericId } from "convex/values";

import { AnalyticsDataModel } from "../../schema";

export async function insert<TableName extends keyof AnalyticsDataModel>(
  context: GenericMutationCtx<AnalyticsDataModel>,
  table: TableName,
  data: WithoutSystemFields<AnalyticsDataModel[TableName]["document"]>
): Promise<GenericId<TableName>> {
  return await context.db.insert(table, data);
}
