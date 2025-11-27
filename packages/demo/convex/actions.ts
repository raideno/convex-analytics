import { getAuthUserId } from "@convex-dev/auth/server";
import { AnyDataModel, GenericActionCtx } from "convex/server";

import { action } from "./_generated/server";
import { analytics } from "./analytics";
import { v } from "convex/values";

export const perform = action({
  args: {
    value: v.optional(v.string()),
  },
  handler: async (context, args) => {
    const userId = await getAuthUserId(context);

    if (!userId) throw new Error("Unauthorized");

    await analytics.track(
      context as unknown as GenericActionCtx<AnyDataModel>,
      {
        name: "demo_perform_action",
        distinctId: userId,
        properties: {
          value: args.value || "no_value",
        },
      }
    );
  },
});
