import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { styles } from "@/styles/profile.styles";

export default function profile() {
   const { signOut } = useAuth();
   const { user } = useUser();

   return (
      <View style={styles.containerWait}>
         <View style={styles.containerHeader2}>
            <View style={styles.profileSection}>
               {user?.imageUrl && (
                  <Image
                     source={{ uri: user.imageUrl }}
                     style={styles.profileImage}
                  />
               )}
               <View>
                  <Text style={styles.profileName}>
                     {user?.fullName || "No Name"}
                  </Text>
                  <Text style={styles.profileEmail}>
                     {user?.primaryEmailAddress?.emailAddress}
                  </Text>
               </View>
            </View>
            <TouchableOpacity
               onPress={() => signOut()}
               style={styles.logoutButton2}
            >
               <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
         </View>
        <View style={styles.containerPending}>
         <Text style={styles.waitText}>Only authorized barangay responders can access this app.</Text>
         </View>
      </View>
   );
}
