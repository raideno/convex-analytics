import { Processor } from "@/types";

export type PosthogProcessorFactoryArgs = {
  key: string;
  host: string;
  events: Array<string>;
};
export const PosthogProcessorFactory = (
  args: PosthogProcessorFactoryArgs
): Processor => {
  return {
    events: args.events,
    handler: async (_, events) => {
      await fetch(`${args.host}/batch/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"phc_dfwoZU5kkU9T7R7hOdUbbrX9P70FPndypLt2Ym8NrR3"}`,
        },
        body: JSON.stringify(
          events.map((event) => ({
            event: event.name,
            distinct_id: event.distinctId,
            properties: {
              ...event.properties,
            },
            timestamp: new Date(event._creationTime).toISOString(),
          }))
        ),
      });

      return events.map((e) => e._id);
    },
  };
};
