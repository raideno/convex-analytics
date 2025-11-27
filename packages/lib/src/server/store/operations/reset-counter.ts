import { defineMutationImplementation } from "@/helpers";

export const ResetCounterImplementation = defineMutationImplementation({
  args: {},
  name: "resetCounter",
  handler: async (context) => {
    const counter = await context.db.query("analyticsEventCounter").first();

    if (counter) {
      await context.db.patch(counter._id, {
        unprocessedCount: 0,
        lastProcessedAt: Date.now(),
      });
    }
  },
});
