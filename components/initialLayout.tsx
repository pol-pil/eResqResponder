import { useAuth, useUser } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const segments = useSegments();
  const router = useRouter();

  const dbUser = useQuery(api.users.getByClerkId, {
    clerkId: user?.id ?? "",
  });

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthScreen = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthScreen) {
      if (dbUser?.role === "Resident") {
        router.replace("/(wait)/waiting-approval");
      } else if (dbUser?.role === "Responder") {
        router.replace("/(tabs)");
      }
    }
  }, [isLoaded, isSignedIn, segments, dbUser]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}