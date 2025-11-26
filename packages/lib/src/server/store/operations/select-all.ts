import { GenericMutationCtx } from "convex/server";

import { AnalyticsDataModel } from "@/schema";

export async function selectAll<TableName extends keyof AnalyticsDataModel>(
  context: GenericMutationCtx<AnalyticsDataModel>,
  table: TableName
): Promise<AnalyticsDataModel[TableName]["document"][]> {
  return await context.db.query(table).collect();
}
