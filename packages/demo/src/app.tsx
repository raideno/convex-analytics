import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Link,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";

import { AuthForm } from "./components/forms/auth-form";
import { UserForm } from "./components/forms/user-form";
import { ActionForm } from "./components/forms/action-form";
import { api } from "@/convex/api";

export default function App() {
  const user = useQuery(api.profile.me);

  if (user === undefined)
    return (
      <div>
        <div>Loading...</div>
      </div>
    );

  console.log("user:", user);

  return (
    <main>
      <Box mb={"8"}>
        <Heading size={"7"}>Convex Analytics Integration Demo</Heading>
        <Text>
          Visit documentation at{" "}
          <Link
            href="https://github.com/raideno/convex-analytics"
            target="_blank"
          >
            https://github.com/raideno/convex-analytics
          </Link>
          .
        </Text>
      </Box>
      <Box mb={"8"}>
        <Card>
          <Flex direction={"column"} gap={"2"}>
            <Link
              href="https://github.com/raideno/convex-analytics/tree/main/packages/demo"
              target="_blank"
            >
              <Button variant="classic" className="!w-full">
                Code
              </Button>
            </Link>
            <Link
              href="https://github.com/raideno/convex-analytics"
              target="_blank"
            >
              <Button variant="classic" className="!w-full">
                Documentation
              </Button>
            </Link>
            <Link
              href="https://github.com/raideno/convex-analytics"
              target="_blank"
            >
              <Button variant="classic" className="!w-full">
                Github
              </Button>
            </Link>
          </Flex>
        </Card>
      </Box>
      <Unauthenticated>
        <AuthForm />
      </Unauthenticated>
      <AuthLoading>
        <Box>
          <Skeleton style={{ width: "100%", height: "256px" }} />
        </Box>
      </AuthLoading>
      <Authenticated>
        <Flex direction={"column"} gap="6">
          <UserForm />
          <ActionForm />
        </Flex>
      </Authenticated>
    </main>
  );
}
