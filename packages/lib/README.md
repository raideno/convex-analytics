# Convex Analytics

Convex agnostic analytics package. Compatible with posthog, discord webhooks, mail alerts, etc.

```bash
npm install @raideno/convex-analytics
```

`convex/schema.ts`
```ts
import { analyticsTables } from "@raideno/convex-analytics/server";
import { defineSchema } from "convex/server";

export default defineSchema({
  ...analyticsTables,
  /*
   * Your app tables...
   */
});
```

`convex/analytics.ts`
```ts
import { internalConvexAnalytics } from "@raideno/convex-analytics/server";
import { DiscordProcessorFactory } from "@raideno/convex-analytics/processors/discord";
import { PosthogProcessorFactory } from "@raideno/convex-analytics/processors/posthog";

import configuration from "./analytics.config";

export const { store, analytics, process } = internalConvexAnalytics({
    processors: [
        /*
         * Will only capture events named "demo_perform_action".
         */
        DiscordProcessorFactory({
            url: process.env.DISCORD_WEBHOOK_URL!,
            events: ["demo_perform_action"],
        }),
        /*
         * Will capture all events.
         */
        PosthogProcessorFactory({
            key: process.env.POSTHOG_KEY!,
            host: "https://us.i.posthog.com",
            events: ["*"],
        }),
    ],
    processEveryK: 1,
});
```

`convex/actions.ts`
```ts
/*
 * Imports
 */

import { analytics } from "./analytics"

export const perform = action({
  args: {
    value: v.optional(v.string()),
  },
  handler: async (context, args) => {
    /*
     * ...
     */

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

    /*
     * ...
     */
  },
});
```

You can also provide custom processors by implementing the `Processor` interface from `@raideno/convex-analytics/processors`.
```ts
export const { store, analytics, process } = internalConvexAnalytics({
    processors: [
        {
            events: ["*"],
            /*
             * Receives an action context and a batch of events of up to `processEveryK`.
             * Must return the list of processed event IDs.
             */
            handler: async (context, events) => {
                console.log(
                    "[events]:",
                    events.map((e) => e.name)
                );
                return events.map((e) => e._id);
            },
        } as Processor,
    ],
    processEveryK: 1,
});
```

An example app can be found in the [demo package](./packages/demo/README.md).
