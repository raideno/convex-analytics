import { GenericMutationCtx } from "convex/server";

import { AnalyticsDataModel } from "../../schema";

export async function selectOne<
  TableName extends keyof AnalyticsDataModel,
  Schema extends AnalyticsDataModel[TableName]["document"],
  Field extends keyof Schema & string,
>(
  context: GenericMutationCtx<AnalyticsDataModel>,
  table: TableName,
  field: Field,
  value: Schema[Field]
): Promise<Schema | null> {
  return await context.db
    .query(table)
    .filter((q) => q.eq(q.field(field), value))
    .unique();
}
