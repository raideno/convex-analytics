type ProcessorShape<TEvents extends ReadonlyArray<string>> = {
  events: TEvents;
  handler: (context: any, events: Array<any>) => Promise<Array<string>>;
};

export type DiscordProcessorFactoryArgs<TEvents extends ReadonlyArray<string>> = {
  url: string;
  events: TEvents;
  username?: string;
  avatarUrl?: string;
};

export const DiscordProcessorFactory = <const TEvents extends ReadonlyArray<string>>(
  args: DiscordProcessorFactoryArgs<TEvents>
): ProcessorShape<TEvents> => {
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