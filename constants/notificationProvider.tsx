import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Platform, Alert } from "react-native";

interface Props {
   onTokenReceived?: (token: string) => void;
}

export default function NotificationSetup({ onTokenReceived }: Props) {
   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

   useEffect(() => {
      registerForPushNotificationsAsync().then((token) => {
         if (token) {
            setExpoPushToken(token);
            onTokenReceived?.(token);
         }
      });

      const subscription = Notifications.addNotificationReceivedListener(
         (notification) => {
            const title = notification.request.content.title ?? "Notification";
            const body = notification.request.content.body ?? "";
            console.log("Notification received:", notification);
            Alert.alert(title, body);
         }
      );

      return () => subscription.remove();
   }, []);

   return null;
}

async function registerForPushNotificationsAsync(): Promise<
   string | undefined
> {
   let token: string | undefined;

   const { status: existingStatus } = await Notifications.getPermissionsAsync();
   let finalStatus = existingStatus;

   if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
   }

   if (finalStatus !== "granted") {
      alert("Failed to get push token for push notifications!");
      return;
   }

   const tokenResponse = await Notifications.getExpoPushTokenAsync();
   token = tokenResponse.data;
   console.log("Expo Push Token:", token);

   if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
         name: "default",
         importance: Notifications.AndroidImportance.MAX,
         vibrationPattern: [0, 250, 250, 250],
         lightColor: "#FF231F7C",
      });
   }

   return token;
}
