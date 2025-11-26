import { GenericMutationCtx } from "convex/server";
import { GenericId } from "convex/values";

import { AnalyticsDataModel } from "../../schema";

export async function selectById<TableName extends keyof AnalyticsDataModel>(
  context: GenericMutationCtx<AnalyticsDataModel>,
  table: TableName,
  id: GenericId<TableName>
): Promise<AnalyticsDataModel[TableName]["document"] | null> {
  return await context.db.get(id);
}
