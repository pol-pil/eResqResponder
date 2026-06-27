import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import Constants from "expo-constants";

const publishableKey =
   Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
   process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
   "";

const convexUrl =
   Constants.expoConfig?.extra?.EXPO_PUBLIC_CONVEX_URL ??
   process.env.EXPO_PUBLIC_CONVEX_URL ??
   "";

const convex = new ConvexReactClient(convexUrl, {
   unsavedChangesWarning: false,
});

export default function ClerkAndConvexProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
         <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
            <ClerkLoaded>{children}</ClerkLoaded>
         </ConvexProviderWithClerk>
      </ClerkProvider>
   );
}
