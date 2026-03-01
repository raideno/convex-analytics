import { getAuthUserId } from "@convex-dev/auth/server";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { analytics } from "./analytics";

export const perform = action({
  args: {
    value: v.optional(v.string()),
  },
  handler: async (context, args) => {
    const userId = await getAuthUserId(context);

    if (!userId) throw new Error("Unauthorized");

    await analytics.track(
      context,
      {
        name: "users:performed_action",
        distinctId: userId,
        properties: {
          value: args.value || "no_value",
        },
      }
    );
  },
});
