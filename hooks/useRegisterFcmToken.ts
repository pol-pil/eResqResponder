import { useEffect, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { getMessaging, getToken } from "firebase/messaging";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAR8DRSthSvwciMny0Jhp7whRLo-Cyn1Hc",
  projectId: "eresq-e",
  messagingSenderId: "248551517309",
  appId: "1:248551517309:web:24c15345353ed14a5a9514",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function useRegisterFcmToken() {
  const saveToken = useMutation(api.userTokens.saveToken);

  useEffect(() => {
    async function register() {
      if (!Device.isDevice) return;

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      try {
        const token = await getToken(messaging, {
          vapidKey: "BFr1Dv7s1p6Fwky8P_VzlWF8o6q_AiBhdglD9vv7ESU2ef6jykg09FBPws6ZqbqK5wxHV_zjLWAVAfUE2oLwLfk",
        });
        if (token) {
          await saveToken({ token });
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    }

    register();
  }, []);
}
