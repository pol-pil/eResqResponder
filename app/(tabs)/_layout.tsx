import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { scale, verticalScale, moderateScale } from "@/constants/responsive";

export default function Tablayout() {

   return (
      <Tabs
         screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: COLORS.flood,
            tabBarInactiveTintColor: COLORS.desc,
            tabBarStyle: {
               display: "none",
               backgroundColor: "#fff",
               elevation: 0,
               position: "absolute",
               height: verticalScale(50),
               borderTopWidth: 1,
            },
            tabBarItemStyle: {
               margin: scale(5),
            },
            lazy: false,
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               tabBarLabel: "Index",
               tabBarIcon: ({ color }: { color: string }) => (
                  <Ionicons
                     name="home"
                     size={moderateScale(24)}
                     color={color}
                  />
               ),
            }}
         />
         <Tabs.Screen
            name="profile"
            options={{
               tabBarLabel: "Profile",
               tabBarIcon: ({ color }: { color: string }) => (
                  <Ionicons
                     name="person-circle"
                     size={moderateScale(26)}
                     color={color}
                  />
               ),
            }}
         />
      </Tabs>
   );
}
