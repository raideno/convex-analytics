import { Processor } from "@/types";

/**
 * TODO: improve by including allowing to pass in a custom formatting function for the body and title
 */
export type DiscordProcessorFactoryArgs = {
  webhookUrl: string;
  events: Array<string>;
  size: number;
  username?: string;
  avatarUrl?: string;
};
export const DiscordProcessorFactory = (
  args: DiscordProcessorFactoryArgs
): Processor => {
  return {
    size: args.size,
    events: args.events,
    handler: async (context, event) => {
      await fetch(args.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: args.username,
          avatar_url: args.avatarUrl,
          embeds: [
            {
              title: event.name,
              color: 5814783,
              fields: [
                {
                  name: "Distinct ID",
                  value: event.distinctId,
                  inline: true,
                },
                {
                  name: "Timestamp",
                  value: new Date(event._creationTime).toISOString(),
                  inline: true,
                },
                ...Object.entries(event.properties || {}).map(
                  ([key, value]) => ({
                    name: key,
                    value: String(value),
                    inline: true,
                  })
                ),
              ],
              timestamp: new Date(event._creationTime).toISOString(),
            },
          ],
        }),
      });
    },
  };
};
