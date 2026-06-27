// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
   apiKey: "AIzaSyAR8DRSthSvwciMny0Jhp7whRLo-Cyn1Hc",
   authDomain: "eresq-e.firebaseapp.com",
   projectId: "eresq-e",
   storageBucket: "eresq-e.firebasestorage.app",
   messagingSenderId: "248551517309",
   appId: "1:248551517309:web:24c15345353ed14a5a9514",
   measurementId: "G-4TWJ3GKWXF",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
