import { DiscordProcessorFactory } from "@raideno/convex-analytics/processors/discord";
import { InputConfiguration } from "@raideno/convex-analytics/server";
import { Processor } from "@raideno/convex-analytics/processors";

export default {
  processors: [
    DiscordProcessorFactory({
      url: "https://discord.com/api/webhooks/1443520379363528744/ALgVzYHekpDklF3p8xzdxGFJ2JxBETutAAbis8RdG3wDAMXawlINm9b0d15PzzKyHHGe",
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
