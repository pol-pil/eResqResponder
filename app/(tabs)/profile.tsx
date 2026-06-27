import { 
   View, 
   Text, 
   TouchableOpacity, 
   ScrollView, 
   Image,
   TouchableWithoutFeedback,
   Keyboard,
} from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { styles } from "@/styles/profile.styles";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import AlertCategory from "@/components/alertCategory";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useFocusEffect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import { styles as stylesh } from "@/styles/home.styles";
import BottomSheetWrapper from "@/components/BottomSheetWrapper";

type Alert = {
   _id: string;
   _creationTime: number;
   category: string;
   location: string;
   alertLevel?: string;
   status: string;
   description?: string;
   resolvedTime?: number;
   responder?: string[];
   userName?: string;
};

export default function Profile() {
   const { signOut } = useAuth();
   const { user } = useUser();
   const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

   const convexUser = useQuery(api.alert.getUserByClerkId, {
      clerkId: user?.id || "",
   });

   const alerts = useQuery(api.getLiveAlerts.getLiveAlerts);

   const userFullName = convexUser
      ? `${convexUser.firstname} ${convexUser.lastname}`
      : "";

   const resolvedAlertsByUser =
      alerts?.filter(
         (item) =>
            item.status === "Resolved" &&
            Array.isArray(item.responder) &&
            item.responder.includes(userFullName)
      ) || [];

   const alertCategories = [
      {
         id: 1,
         name: "Health Emergency",
         iconName: "medkit-outline",
         iconColor: COLORS.health,
      },
      {
         id: 2,
         name: "Fire Emergency",
         iconName: "flame-outline",
         iconColor: COLORS.fire,
      },
      {
         id: 3,
         name: "Flood or Weather Disaster",
         iconName: "rainy-outline",
         iconColor: COLORS.flood,
      },
      {
         id: 4,
         name: "Crime or Security Threat",
         iconName: "warning-outline",
         iconColor: COLORS.crime,
      },
   ];

   const bottomSheetDetails = useRef<BottomSheet | null>(null);

   const handleAlertPress = (alert: Alert) => {
      setSelectedAlert(alert);
      bottomSheetDetails.current?.expand();
   };

   const handleCloseBottomSheet = () => {
      setSelectedAlert(null);
      bottomSheetDetails.current?.close();
   };

   const router = useRouter();

   useFocusEffect(
      useCallback(() => {
         bottomSheetDetails.current?.close();
         setSelectedAlert(null);

         return () => {
           bottomSheetDetails.current?.close();
         };
      }, [])
   );

   return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
         <GestureHandlerRootView style={styles.container}>
            <View style={styles.containerHeader}>
               <View style={styles.containerNav}>
                  <TouchableOpacity onPress={() => router.back()}>
                     <Ionicons
                        name="chevron-back-outline"
                        size={24}
                        color={COLORS.black}
                     />
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => signOut()}
                     style={styles.logoutButton}
                  >
                     <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
               </View>
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
            </View>

            <View style={styles.containerHistory}>
               <Text style={styles.historyTitle}>Responded History</Text>

               <ScrollView style={{ flex: 1 }}>
                  {resolvedAlertsByUser.map((item) => {
                     const category = alertCategories.find(
                        (cat) => cat.name === item.category
                     );
                     return (
                        <TouchableOpacity
                           key={item._id}
                           style={styles.alertCard}
                           onPress={() => handleAlertPress(item)}
                        >
                           <View style={styles.containerCategory}>
                              <AlertCategory
                                 iconName={
                                    category?.iconName || "alert-circle-outline"
                                 }
                                 iconColor={
                                    category?.iconColor || COLORS.health
                                 }
                              />
                              <View style={styles.containerText}>
                                 <Text style={styles.alertCategory}>
                                    {item.userName}
                                 </Text>
                                 <Text style={styles.alertLocation}>
                                    {item.location}
                                 </Text>
                              </View>
                           </View>
                           <Text style={styles.alertDate2}>
                              {new Date(item._creationTime).toLocaleString()}
                           </Text>
                        </TouchableOpacity>
                     );
                  })}
               </ScrollView>
            </View>

            <BottomSheetWrapper ref={bottomSheetDetails} snapPoints={["10%"]}>
               <View style={styles.containerHistory}>
                  <View style={stylesh.confirmHeader}>
                     <Text style={stylesh.confirmTitle}>Alert Details</Text>
                     <TouchableOpacity onPress={handleCloseBottomSheet}>
                        <Ionicons name="close" style={stylesh.iconNormal} />
                     </TouchableOpacity>
                  </View>

                  {selectedAlert && (
                     <ScrollView style={styles.alertDetails}>
                        <View style={styles.detailRow}>
                           <Text style={styles.detailLabel}>Reported by:</Text>
                           <Text style={styles.detailValue}>
                              {selectedAlert.userName}
                           </Text>
                        </View>

                        <View style={styles.detailRow}>
                           <Text style={styles.detailLabel}>Category:</Text>
                           <Text style={styles.detailValue}>
                              {selectedAlert.category}
                           </Text>
                        </View>

                        <View style={styles.detailRow}>
                           <Text style={styles.detailLabel}>Alert Level:</Text>
                           <Text style={styles.detailValue}>
                              {selectedAlert.alertLevel || "Not specified"}
                           </Text>
                        </View>

                        <View style={styles.detailRow}>
                           <Text style={styles.detailLabel}>Status:</Text>
                           <Text
                              style={[
                                 styles.detailValue,
                                 {
                                    color:
                                       selectedAlert.status === "Resolved"
                                          ? "green"
                                          : selectedAlert.status === "Active"
                                            ? "red"
                                            : "orange",
                                 },
                              ]}
                           >
                              {selectedAlert.status}
                           </Text>
                        </View>

                        <View style={styles.detailRow}>
                           <Text style={styles.detailLabel}>Location:</Text>
                           <Text style={styles.detailValue}>
                              {selectedAlert.location}
                           </Text>
                        </View>

                        <View style={styles.detailRow}>
                           <Text style={styles.detailLabel}>Description:</Text>
                           <Text style={styles.detailValue}>
                              {selectedAlert.description || "No description provided"}
                           </Text>
                        </View>

                        <View style={styles.detailRow}>
                           <Text style={styles.detailLabel}>
                              Date Reported:
                           </Text>
                           <Text style={styles.detailValue}>
                              {new Date(
                                 selectedAlert._creationTime
                              ).toLocaleString()}
                           </Text>
                        </View>

                        {selectedAlert.resolvedTime && (
                           <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>
                                 Date Resolved:
                              </Text>
                              <Text style={styles.detailValue}>
                                 {new Date(
                                    selectedAlert.resolvedTime
                                 ).toLocaleString()}
                              </Text>
                           </View>
                        )}

                        {selectedAlert.responder &&
                           selectedAlert.responder.length > 0 && (
                              <View style={styles.detailRow}>
                                 <Text style={styles.detailLabel}>
                                    {selectedAlert.responder.length > 1
                                       ? "Responders:"
                                       : "Responder:"}
                                 </Text>
                                 <View style={styles.responderList}>
                                    {selectedAlert.responder.map(
                                       (responder: string, index: number) => (
                                          <Text
                                             key={index}
                                             style={styles.detailValue}
                                          >
                                             • {responder}
                                          </Text>
                                       )
                                    )}
                                 </View>
                              </View>
                           )}
                     </ScrollView>
                  )}
               </View>
            </BottomSheetWrapper>
         </GestureHandlerRootView>
      </TouchableWithoutFeedback>
   );
}