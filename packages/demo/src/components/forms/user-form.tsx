import { useAuthActions } from "@convex-dev/auth/react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { useQuery } from "convex/react";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";

export const UserForm = () => {
  const auth = useAuthActions();

  const profile = useQuery(api.profile.me);

  const handleSignout = async () => {
    try {
      await auth.signOut();
      toast.info("Signed out.");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  if (!profile)
    return (
      <>
        <Skeleton style={{ width: "100%", height: "102px" }} />
      </>
    );

  const username = (profile.email || "unknown@unknown.com").split("@")[0];

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Box>
          <Heading size={"6"}>Welcome {username}!</Heading>
          <Text>You are signed in with the email: {profile.email}</Text>
        </Box>
        <Box>
          <Button
            className="w-full!"
            color="red"
            variant="outline"
            onClick={handleSignout}
          >
            Signout
          </Button>
        </Box>
      </Flex>
    </Card>
  );
};
