import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useAction } from "convex/react";
import React from "react";

import { api } from "@/convex/api";
import { toast } from "sonner";

export const ActionForm = () => {
  const action = useAction(api.actions.perform);

  const [value, setValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePerformAction = async () => {
    try {
      setLoading(true);

      await action({ value: value });

      toast.success("Action performed and tracked!");
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("Failed to perform action.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Box>
          <Heading>Perform Tracked Action</Heading>
          <Text>Perform an action that is tracked in Analytics</Text>
        </Box>
        <Box>
          <TextField.Root
            size="3"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Action Value"
          />
          <Button
            loading={loading}
            className="w-full! mt-4!"
            onClick={handlePerformAction}
            variant="classic"
          >
            Perform Action
          </Button>
        </Box>
      </Flex>
    </Card>
  );
};
