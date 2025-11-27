import { Processor } from "@/types";

export type DiscordProcessorFactoryArgs = {
  url: string;
  events: Array<string>;
  username?: string;
  avatarUrl?: string;
};

export const DiscordProcessorFactory = (
  args: DiscordProcessorFactoryArgs
): Processor => {
  return {
    events: args.events,
    handler: async (context, events) => {
      for (const event of events) {
        await fetch(args.url, {
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
      }

      return events.map((e) => e._id);
    },
  };
};
