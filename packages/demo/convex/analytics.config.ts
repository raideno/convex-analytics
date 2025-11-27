import { DiscordProcessorFactory } from "@raideno/convex-analytics/processors/discord";
import { InputConfiguration } from "@raideno/convex-analytics/server";
import { Processor } from "@raideno/convex-analytics/processors";

export default {
  processors: [
    DiscordProcessorFactory({
      url: process.env.DISCORD_WEBHOOK_URL!,
      events: ["*"],
    }),
    {
      events: ["*"],
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
} as InputConfiguration;
