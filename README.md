# Convex Analytics Package

Compatible with bare convex or any other analytics platform such as posthog or other.

You just get a handler to a with posthog, etc.

Include with it an extension, open source that sends data through the api when, you dm someone while being on coldemailing mode. Coldmeailing but for twitter, reddit, discord dms, etc.

--- --- ---

Syncing and calling processors will be done in an outside loop using cron jobs. One will eventually run each minute (or customized) and will check if it needs to run any processors, if it needs then it'll just run them in batches by scheduling them and then going back to sleep.

TODO: since afterFinish action can be and can delete the records, for now we won't support having processors handling the same tags, otherwise it'll be at your own risks and you can observe weird behaviours, checks will be made at runtime to print a warning in case this is done.
So you either use a '*' tag to match them all or you use specific tags with no duplicates.

But this is annoying, we should allow duplicates, because what if you when receiving a payment you want to both receive a notification per email, discord or whatever but also track the event using posthog ?

A potential solution would be to disentangle the processing from the thing performed after to the processed events, this way we can just execute all the processors and once they're done we execute the cleanup functions, they receive the tags and stuff and do whatever they want.
 
--- --- ---

Since we aren't providing typing for the content and the tags, we'll provide helper types to make it easy to make everything type safe.

--- --- ---

// TODO: optional function to be passed in to handle what to do after sync
// TODO: some prebuilt functions are available such as delete after sync, keep etc.
afterSync: any;
