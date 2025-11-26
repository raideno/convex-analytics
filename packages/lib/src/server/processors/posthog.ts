import { Processor } from "@/types";

export type PosthogProcessorFactoryArgs = {
  key: string;
  host: string;
  events: Array<string>;
  size: number;
};
export const PosthogProcessorFactory = (
  args: PosthogProcessorFactoryArgs
): Processor => {
  return {
    size: args.size,
    events: args.events,
    handler: async (context, event) => {
      await fetch("https://eu.i.posthog.com/capture/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"phc_dfwoZU5kkU9T7R7hOdUbbrX9P70FPndypLt2Ym8NrR3"}`,
        },
        body: JSON.stringify({
          api_key: args.key,
          event: event.name,
          distinct_id: event.distinctId,
          properties: {
            ...event.properties,
          },
          timestamp: new Date(event._creationTime).toISOString(),
        }),
      });
    },
  };
};
