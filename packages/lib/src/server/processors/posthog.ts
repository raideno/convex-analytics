type ProcessorShape<TEvents extends ReadonlyArray<string>> = {
  events: TEvents;
  handler: (context: any, events: Array<any>) => Promise<Array<string>>;
};

export type PosthogProcessorFactoryArgs<TEvents extends ReadonlyArray<string>> = {
  key: string;
  host: string;
  events: TEvents;
};

export const PosthogProcessorFactory = <const TEvents extends ReadonlyArray<string>>(
  args: PosthogProcessorFactoryArgs<TEvents>
): ProcessorShape<TEvents> => {
  return {
    events: args.events,
    handler: async (_, events) => {
      try {
        await fetch(`${args.host}/batch/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: args.key,
            batch: events.map((event) => ({
              event: event.name,
              distinct_id: event.distinctId,
              properties: {
                ...event.properties,
              },
              timestamp: new Date(event._creationTime).toISOString(),
            })),
          }),
        });

        return events.map((e) => e._id);
      } catch (error) {
        return [];
      }
    },
  };
};