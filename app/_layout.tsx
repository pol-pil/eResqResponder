import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import InitialLayout from "@/components/initialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import { SplashScreen } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import NotificationSetup from "@/constants/notificationProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

 const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <PaperProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} onLayout={onLayoutRootView}>
          <NotificationSetup />
          <InitialLayout />
        </SafeAreaView>
        </PaperProvider>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
