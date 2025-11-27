import { defineMutationImplementation } from "@/helpers";

export const IncrementCounterImplementation = defineMutationImplementation({
  args: {},
  name: "incrementCounter",
  handler: async (context) => {
    const counter = await context.db.query("analyticsEventCounter").first();

    if (!counter) {
      await context.db.insert("analyticsEventCounter", {
        unprocessedCount: 1,
        lastProcessedAt: null,
      });
      return 1;
    }

    const newCount = counter.unprocessedCount + 1;
    await context.db.patch(counter._id, {
      unprocessedCount: newCount,
    });
    return newCount;
  },
});
