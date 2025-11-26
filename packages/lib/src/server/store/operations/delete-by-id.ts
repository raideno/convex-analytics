import { GenericMutationCtx } from "convex/server";

import { AnalyticsDataModel } from "../../schema";

export async function deleteById<
  TableName extends keyof AnalyticsDataModel,
  Schema extends AnalyticsDataModel[TableName]["document"],
>(
  context: GenericMutationCtx<AnalyticsDataModel>,
  table: TableName,
  idField: keyof Schema & string,
  idValue: Schema[typeof idField]
): Promise<boolean> {
  const existing = await context.db
    .query(table)
    .filter((q) => q.eq(q.field(idField), idValue))
    .unique();

  if (existing) {
    await context.db.delete(existing._id);
    return true;
  }
  return false;
}
