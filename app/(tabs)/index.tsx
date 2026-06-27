import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from "react";
import {
   ActivityIndicator,
   BackHandler,
   Image,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   Text,
   TouchableOpacity,
   TouchableWithoutFeedback,
   View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
   BottomSheetScrollView,
   BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import GoogleMapView from "@/components/googleMapView";
import { COLORS } from "@/constants/theme";
import { styles } from "../../styles/home.styles";
import { styles as stylesp } from "../../styles/profile.styles";
import AlertCategory from "@/components/alertCategory";
import { formatDistanceToNowStrict } from "date-fns";
import { getDistance } from "geolib";
import { Id } from "@/convex/_generated/dataModel";
import NotificationSetup from "@/constants/notificationProvider";

const ALERT_CATEGORIES = [
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

type ResponderLocation = { latitude: number; longitude: number } | null;

type AlertType = {
   _id: string;
   category: string;
   location: string;
   alertLevel: string;
   latitude?: number;
   longitude?: number;
   userName: string;
   _creationTime: number;
   status: string;
   description?: string;
   relatedCategory?: string;
   responder?: string[] | null;
   responderLatitude?: number[] | null;
   responderLongitude?: number[] | null;
};

export default function Index() {
   const router = useRouter();
   const { user } = useUser();

   const updateAlertStatus = useMutation(api.alerts.updateAlert);
   const liveAlertsRaw = useQuery(api.getLiveAlerts.getLiveAlerts) || [];

   const [responderLocation, setResponderLocation] =
      useState<ResponderLocation>(null);
   const [responseOpen, setResponseOpen] = useState(false);
   const [responseStarted, setResponseStarted] = useState(false);
   const [isResponding, setIsResponding] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingLocation, setIsLoadingLocation] = useState(true);

   const bottomSheetCategory = useRef<BottomSheet | null>(null);
   const bottomSheetAlert = useRef<BottomSheet | null>(null);
   const scrollRef = useRef<BottomSheetScrollViewMethods | null>(null);

   const [currentSnapIndexCategory, setCurrentSnapIndexCategory] = useState(0);
   const [currentSnapIndexAlert, setCurrentSnapIndexAlert] = useState(0);

   const saveToken = useMutation(api.userTokens.saveToken);

   const handleTokenReceived = async (token: string) => {
      console.log("Saving token to Convex:", token);
      await saveToken({ token });
    };

   const alerts = useMemo(
      () => liveAlertsRaw?.filter((a) => a.status === "Active") ?? [],
      [liveAlertsRaw]
   );

   const snapPointsCategory = useMemo(() => ["10%", "40%"], []);
   const snapPointsAlert = useMemo(() => ["12%"], []);

   useEffect(() => {
      let sub: Location.LocationSubscription | null = null;
      let mounted = true;

      (async () => {
         try {
            setIsLoadingLocation(true);
            const { status } =
               await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
               console.warn("Location permission denied");
               setIsLoadingLocation(false);
               return;
            }

            sub = await Location.watchPositionAsync(
               {
                  accuracy: Location.Accuracy.High,
                  timeInterval: 3000,
                  distanceInterval: 5,
               },
               (loc) => {
                  if (!mounted) return;
                  setResponderLocation({
                     latitude: loc.coords.latitude,
                     longitude: loc.coords.longitude,
                  });
                  setIsLoadingLocation(false);
               }
            );
         } catch (err) {
            console.error("Failed to watch location", err);
            setIsLoadingLocation(false);
         }
      })();

      return () => {
         mounted = false;
         if (sub) sub.remove();
      };
   }, []);

   useEffect(() => {
      const backAction = () => {
         if (currentSnapIndexAlert > 0 || currentSnapIndexCategory > 0) {
            bottomSheetAlert.current?.close();
            bottomSheetCategory.current?.expand();
            return true;
         }
         return false;
      };

      const backHandler = BackHandler.addEventListener(
         "hardwareBackPress",
         backAction
      );
      return () => backHandler.remove();
   }, [currentSnapIndexAlert, currentSnapIndexCategory]);

   // open category sheet on screen focus
   useFocusEffect(
      useCallback(() => {
         const t = setTimeout(() => {
            bottomSheetCategory.current?.expand();
            bottomSheetAlert.current?.close();
         }, 500);
         return () => clearTimeout(t);
      }, [])
   );

   const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
   const [mapFocus, setMapFocus] = useState<{
      sender: { latitude: number; longitude: number };
      responder: { latitude: number; longitude: number };
   } | null>(null);

   useEffect(() => {
      if (!selectedAlert) return;
      const updated = liveAlertsRaw.find((a) => a._id === selectedAlert._id);
      if (!updated) return;
      const respondersChanged =
         JSON.stringify(updated.responder ?? []) !==
         JSON.stringify(selectedAlert.responder ?? []);
      const latChanged =
         JSON.stringify(updated.responderLatitude ?? []) !==
         JSON.stringify(selectedAlert.responderLatitude ?? []);
      const lngChanged =
         JSON.stringify(updated.responderLongitude ?? []) !==
         JSON.stringify(selectedAlert.responderLongitude ?? []);
      const statusChanged = updated.status !== selectedAlert.status;

      if (respondersChanged || latChanged || lngChanged || statusChanged) {
         setSelectedAlert({
            ...updated,
            responder: Array.isArray(updated.responder)
               ? updated.responder
               : [],
            responderLatitude: Array.isArray(updated.responderLatitude)
               ? updated.responderLatitude
               : [],
            responderLongitude: Array.isArray(updated.responderLongitude)
               ? updated.responderLongitude
               : [],
         });
      }
   }, [liveAlertsRaw, selectedAlert]);

   const safeDistance = useCallback(
      (
         from?: { latitude: number; longitude: number } | null,
         toLat?: number,
         toLng?: number
      ) => {
         if (!from || toLat === undefined || toLng === undefined) return null;
         try {
            return getDistance(from, { latitude: toLat, longitude: toLng });
         } catch {
            return null;
         }
      },
      []
   );

   const handleStartResponse = useCallback(async () => {
      if (!selectedAlert || !user?.firstName || !user?.lastName) {
         console.warn("Cannot start response: missing user or alert");
         return;
      }

      setIsLoading(true);
      const fullName = `${user.firstName} ${user.lastName}`;

      const currentAlert =
         liveAlertsRaw.find((a) => a._id === selectedAlert._id) ||
         selectedAlert;

      let alertLat = currentAlert.latitude;
      let alertLng = currentAlert.longitude;

      if (typeof alertLat !== "number" || typeof alertLng !== "number") {
         console.warn("Alert missing coordinates, defaulting to 0,0");
         alertLat = 0;
         alertLng = 0;
      }

      const responders = Array.isArray(currentAlert.responder)
         ? [...currentAlert.responder]
         : [];
      const responderLats = Array.isArray(currentAlert.responderLatitude)
         ? [...currentAlert.responderLatitude]
         : [];
      const responderLngs = Array.isArray(currentAlert.responderLongitude)
         ? [...currentAlert.responderLongitude]
         : [];

      if (!responders.includes(fullName)) {
         responders.push(fullName);

         const lat =
            responderLocation &&
            typeof responderLocation.latitude === "number" &&
            responderLocation.latitude !== 0
               ? responderLocation.latitude
               : 0;
         const lng =
            responderLocation &&
            typeof responderLocation.longitude === "number" &&
            responderLocation.longitude !== 0
               ? responderLocation.longitude
               : 0;

         responderLats.push(lat);
         responderLngs.push(lng);
      }

      const indices = responders.map((_, i) => i);
      indices.sort((a, b) => {
         const distA =
            responderLats[a] === 0 && responderLngs[a] === 0
               ? Infinity
               : getDistance(
                    { latitude: responderLats[a], longitude: responderLngs[a] },
                    { latitude: alertLat, longitude: alertLng }
                 );
         const distB =
            responderLats[b] === 0 && responderLngs[b] === 0
               ? Infinity
               : getDistance(
                    { latitude: responderLats[b], longitude: responderLngs[b] },
                    { latitude: alertLat, longitude: alertLng }
                 );
         return distA - distB;
      });

      const sortedResponders = indices.map((i) => responders[i]);
      const sortedLats = indices.map((i) => responderLats[i]);
      const sortedLngs = indices.map((i) => responderLngs[i]);

      const updatePayload: any = {
         id: selectedAlert._id,
         status: currentAlert.status,
         responder: sortedResponders,
         responderLatitude: sortedLats,
         responderLongitude: sortedLngs,
      };

      try {
         await updateAlertStatus(updatePayload);

         setSelectedAlert((prev) =>
            prev
               ? {
                    ...prev,
                    responder: sortedResponders,
                    responderLatitude: sortedLats,
                    responderLongitude: sortedLngs,
                 }
               : prev
         );

         bottomSheetAlert.current?.collapse();
         setResponseStarted(true);
         setIsResponding(true);
      } catch (err) {
         console.error("Failed to start response", err);
      } finally {
         setIsLoading(false);
      }
   }, [
      selectedAlert,
      user,
      responderLocation,
      liveAlertsRaw,
      updateAlertStatus,
   ]);

   const cancelResponse = useCallback(async () => {
      if (!selectedAlert || !user?.firstName || !user?.lastName) {
         closeAlert();
         return;
      }

      setIsLoading(true);
      const fullName = `${user.firstName} ${user.lastName}`;

      const existingResponders = Array.isArray(selectedAlert.responder)
         ? [...selectedAlert.responder]
         : [];
      const existingLatitudes = Array.isArray(selectedAlert.responderLatitude)
         ? [...selectedAlert.responderLatitude]
         : [];
      const existingLongitudes = Array.isArray(selectedAlert.responderLongitude)
         ? [...selectedAlert.responderLongitude]
         : [];

      const idx = existingResponders.indexOf(fullName);
      if (idx === -1) {
         closeAlert();
         setIsLoading(false);
         return;
      }

      existingResponders.splice(idx, 1);
      existingLatitudes.splice(idx, 1);
      existingLongitudes.splice(idx, 1);

      try {
         await updateAlertStatus({
            id: selectedAlert._id as Id<"alerts">,
            status: selectedAlert.status,
            responder: existingResponders,
            responderLatitude: existingLatitudes,
            responderLongitude: existingLongitudes,
         });

         setSelectedAlert((prev) =>
            prev
               ? {
                    ...prev,
                    responder: existingResponders,
                    responderLatitude: existingLatitudes,
                    responderLongitude: existingLongitudes,
                 }
               : prev
         );
      } catch (err) {
         console.error("Failed to cancel response", err);
      } finally {
         setIsLoading(false);
      }

      closeAlert();
   }, [selectedAlert, user, updateAlertStatus]);

   const alertResolved = useCallback(async () => {
      if (!selectedAlert?._id) return;
      setIsLoading(true);
      try {
         await updateAlertStatus({
            id: selectedAlert._id as Id<"alerts">,
            status: "Resolved",
            responder: selectedAlert.responder || [],
            responderLatitude: [],
            responderLongitude: [],
         });
         closeAlert();
      } catch (err) {
         console.error("Failed to resolve alert", err);
      } finally {
         setIsLoading(false);
      }
   }, [selectedAlert, updateAlertStatus]);

   const closeAlert = useCallback(() => {
      bottomSheetAlert.current?.close();
      bottomSheetCategory.current?.expand();
      Keyboard.dismiss();
      setResponseOpen(false);
      setIsResponding(false);
      setResponseStarted(false);
      setSelectedAlert(null);
      setMapFocus(null);
   }, []);

   const handleSheetCategory = useCallback(
      (index: number) => setCurrentSnapIndexCategory(index),
      []
   );
   const handleSheetAlert = useCallback(
      (index: number) => setCurrentSnapIndexAlert(index),
      []
   );

   const handleMarkerPress = useCallback(
      (item: AlertType) => {
        const alertItem = {
          ...item,
          responder: Array.isArray(item.responder) ? item.responder : [],
          responderLatitude: Array.isArray(item.responderLatitude)
            ? item.responderLatitude
            : [],
          responderLongitude: Array.isArray(item.responderLongitude)
            ? item.responderLongitude
            : [],
        };
  
        setSelectedAlert(alertItem);

        bottomSheetCategory.current?.close();
        bottomSheetAlert.current?.expand();
        setResponseOpen(true);
 
        const alertLat =
          typeof item.latitude === "number" ? item.latitude : 0;
        const alertLng =
          typeof item.longitude === "number" ? item.longitude : 0;
    
        const responderLat =
          responderLocation?.latitude ?? alertLat;
        const responderLng =
          responderLocation?.longitude ?? alertLng;
    
        setMapFocus({
          sender: { latitude: alertLat, longitude: alertLng },
          responder: { latitude: responderLat, longitude: responderLng },
        });
      },
      [responderLocation]
    );

   return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
         <GestureHandlerRootView style={styles.container}>
         <NotificationSetup onTokenReceived={handleTokenReceived} />
            <GoogleMapView
               alerts={alerts}
               mapFocus={mapFocus}
               onMarkerPress={handleMarkerPress}
               responseStarted={responseStarted}
               activeAlertId={selectedAlert?._id || null}
            />

            {!responseOpen && (
               <TouchableOpacity onPress={() => router.push("/profile")}>
                  <View style={styles.profile}>
                     {user?.imageUrl && (
                        <Image
                           source={{ uri: user.imageUrl }}
                           style={styles.profileImage}
                        />
                     )}
                  </View>
               </TouchableOpacity>
            )}

            <BottomSheet
               ref={bottomSheetCategory}
               onChange={handleSheetCategory}
               enableDynamicSizing
               animateOnMount
               snapPoints={snapPointsCategory}
               handleIndicatorStyle={{ backgroundColor: COLORS.desc }}
               style={styles.bottomSheetStyle}
            >
               <BottomSheetScrollView
                  style={styles.container}
                  keyboardShouldPersistTaps="handled"
               >
                  <ScrollView style={styles.category}>
                     <Text style={styles.liveTitle}>Live Alerts</Text>

                     {isLoadingLocation && (
                        <View style={styles.loadingState}>
                           <ActivityIndicator size="small" color={COLORS.primary} />
                           <Text style={styles.loadingStateText}>Getting your location...</Text>
                        </View>
                     )}

                     {liveAlertsRaw === undefined ? (
                        <View style={styles.loadingState}>
                           <ActivityIndicator size="small" color={COLORS.primary} />
                           <Text style={styles.loadingStateText}>Loading alerts...</Text>
                        </View>
                     ) : alerts.length === 0 ? (
                        <View style={styles.emptyState}>
                           <Text style={styles.emptyStateText}>No active alerts</Text>
                        </View>
                     ) : (
                        alerts
                           ?.slice()
                           .sort((a, b) => a._creationTime - b._creationTime)
                           .map((item) => {
                              const category = ALERT_CATEGORIES.find(
                                 (c) => c.name === item.category
                              );
                              const distance = responderLocation
                                 ? safeDistance(
                                      responderLocation,
                                      item.latitude,
                                      item.longitude
                                   )
                                 : null;

                              return (
                                 <TouchableOpacity
                                    key={item._id}
                                    onPress={() => handleMarkerPress(item)}
                                    style={stylesp.alertCard}
                                 >
                                    <View style={stylesp.containerCategory}>
                                       <AlertCategory
                                          iconName={category?.iconName}
                                          iconColor={category?.iconColor}
                                       />
                                       <View style={stylesp.containerText}>
                                          <Text style={stylesp.alertCategory}>
                                             {item.userName}
                                          </Text>
                                          <Text style={stylesp.alertLocation}>
                                             {item.location}
                                          </Text>
                                          <View
                                             style={stylesp.alertExtraContainer}
                                          >
                                             <Text style={stylesp.alertDate}>
                                                {formatDistanceToNowStrict(
                                                   new Date(item._creationTime),
                                                   { addSuffix: true }
                                                )}
                                             </Text>
                                             <Text style={stylesp.alertDistance}>
                                                {distance !== null
                                                   ? `${distance}m away`
                                                   : "No GPS data"}
                                             </Text>
                                          </View>
                                       </View>
                                       <View
                                          style={[
                                             stylesp.alertLevel,
                                             {
                                                backgroundColor:
                                                   item.alertLevel === "Non-Urgent"
                                                      ? "#51ad5d"
                                                      : item.alertLevel ===
                                                          "Urgent"
                                                        ? "#ffb300"
                                                        : item.alertLevel ===
                                                            "Immediate"
                                                          ? "#ff4545"
                                                          : "gray",
                                             },
                                          ]}
                                       />
                                    </View>
                                 </TouchableOpacity>
                              );
                           })
                     )}
                  </ScrollView>
               </BottomSheetScrollView>
            </BottomSheet>

            {/* Alert Details Bottomsheet */}
            <BottomSheet
               ref={bottomSheetAlert}
               index={-1}
               onChange={handleSheetAlert}
               enableDynamicSizing
               snapPoints={snapPointsAlert}
               handleIndicatorStyle={{ backgroundColor: COLORS.desc }}
               style={styles.bottomSheetStyle}
            >
               <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={styles.confirmContainer}
               >
                  <BottomSheetScrollView
                     ref={scrollRef}
                     keyboardShouldPersistTaps="handled"
                     style={styles.confirmContent}
                  >
                     {selectedAlert ? (
                        selectedAlert.status === "Active" ? (
                           <>
                              <View style={styles.confirmHeader}>
                                 <View style={stylesp.containerCategory}>
                                    {(() => {
                                       const category = ALERT_CATEGORIES.find(
                                          (cat) =>
                                             cat.name === selectedAlert.category
                                       );
                                       return (
                                          <AlertCategory
                                             iconName={category?.iconName}
                                             iconColor={category?.iconColor}
                                          />
                                       );
                                    })()}

                                    {selectedAlert.relatedCategory &&
                                       selectedAlert.relatedCategory
                                          .split(",")
                                          .map((label) => label.trim())
                                          .map((label, index) => {
                                             const relatedCategory =
                                                ALERT_CATEGORIES.find(
                                                   (cat) => cat.name === label
                                                );
                                             if (!relatedCategory) return null;
                                             return (
                                                <AlertCategory
                                                   key={index}
                                                   iconName={
                                                      relatedCategory.iconName
                                                   }
                                                   iconColor={
                                                      relatedCategory.iconColor
                                                   }
                                                   style={
                                                      styles.relatedCategory
                                                   }
                                                />
                                             );
                                          })}
                                 </View>

                                 <View style={styles.categoryGroup}>
                                    <Text style={styles.alertDistance}>
                                       {responderLocation &&
                                       selectedAlert.latitude !== undefined &&
                                       selectedAlert.longitude !== undefined
                                          ? `${safeDistance(responderLocation, selectedAlert.latitude, selectedAlert.longitude)}m away`
                                          : "No GPS data"}
                                    </Text>
                                    {!responseStarted && (
                                       <TouchableOpacity onPress={closeAlert}>
                                          <Ionicons
                                             name="close"
                                             style={styles.iconNormal}
                                          />
                                       </TouchableOpacity>
                                    )}
                                 </View>
                              </View>

                              <View style={styles.nameContainer}>
                                 <View
                                    style={[
                                       styles.alertLevel,
                                       {
                                          backgroundColor:
                                             selectedAlert.alertLevel ===
                                             "Non-Urgent"
                                                ? "#51ad5d"
                                                : selectedAlert.alertLevel ===
                                                    "Urgent"
                                                  ? "#ffb300"
                                                  : selectedAlert.alertLevel ===
                                                      "Immediate"
                                                    ? "#ff4545"
                                                    : "gray",
                                       },
                                    ]}
                                 />
                                 <View style={styles.anotherContainer}>
                                    <Text style={styles.confirmTitle}>
                                       {selectedAlert.userName}
                                    </Text>
                                    <Text style={styles.alertLocation}>
                                       {selectedAlert.location}
                                    </Text>
                                 </View>
                              </View>

                              <View style={styles.anotherContainer}>
                                 <Text style={styles.inputLabel}>
                                    Description
                                 </Text>
                                 <Text style={styles.alertLocation}>
                                    {selectedAlert.description ||
                                       "No description provided"}
                                 </Text>
                              </View>

                              <View style={styles.anotherContainer}>
                                 <Text style={styles.inputLabel}>
                                    Responders:
                                 </Text>
                                 {selectedAlert.responder &&
                                 selectedAlert.responder.length > 0 ? (
                                    selectedAlert.responder.map(
                                       (name, index) => (
                                          <Text
                                             key={index}
                                             style={styles.alertLocation}
                                          >
                                             • {name}
                                          </Text>
                                       )
                                    )
                                 ) : (
                                    <Text style={styles.alertLocation}>
                                       No responders yet
                                    </Text>
                                 )}
                              </View>

                              {!isResponding ? (
                                 <View style={styles.alertButtonContainer}>
                                    <TouchableOpacity
                                       style={[
                                          styles.alertButton,
                                          isLoading && styles.buttonDisabled
                                       ]}
                                       onPress={handleStartResponse}
                                       disabled={isLoading}
                                    >
                                       {isLoading ? (
                                          <ActivityIndicator size="small" color={COLORS.white} />
                                       ) : (
                                          <Text style={styles.alertButtonText}>
                                             Start Response
                                          </Text>
                                       )}
                                    </TouchableOpacity>
                                 </View>
                              ) : (
                                 <View style={styles.alertButtonContainer2}>
                                    <TouchableOpacity
                                       style={[
                                          styles.cancelButton,
                                          isLoading && styles.buttonDisabled
                                       ]}
                                       onPress={cancelResponse}
                                       disabled={isLoading}
                                    >
                                       {isLoading ? (
                                          <ActivityIndicator size="small" color={COLORS.white} />
                                       ) : (
                                          <Text style={styles.alertButtonText}>
                                             Cancel Response
                                          </Text>
                                       )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                       style={[
                                          styles.markResolvedButton,
                                          isLoading && styles.buttonDisabled
                                       ]}
                                       onPress={alertResolved}
                                       disabled={isLoading}
                                    >
                                       {isLoading ? (
                                          <ActivityIndicator size="small" color={COLORS.white} />
                                       ) : (
                                          <Text style={styles.alertButtonText}>
                                             Mark as Resolved
                                          </Text>
                                       )}
                                    </TouchableOpacity>
                                 </View>
                              )}
                           </>
                        ) : selectedAlert.status === "Resolved" ? (
                           <View style={styles.confirmHeader}>
                              <Text style={styles.confirmTitle}>
                                 {selectedAlert.userName} alert is resolved.
                              </Text>
                              <TouchableOpacity onPress={closeAlert}>
                                 <Ionicons
                                    name="close"
                                    style={styles.iconNormal}
                                 />
                              </TouchableOpacity>
                           </View>
                        ) : (
                           <View style={styles.confirmHeader}>
                              <Text style={styles.confirmTitle}>
                                 {selectedAlert.userName} alert is canceled.
                              </Text>
                              <TouchableOpacity onPress={closeAlert}>
                                 <Ionicons
                                    name="close"
                                    style={styles.iconNormal}
                                 />
                              </TouchableOpacity>
                           </View>
                        )
                     ) : null}
                  </BottomSheetScrollView>
               </KeyboardAvoidingView>
            </BottomSheet>
         </GestureHandlerRootView>
      </TouchableWithoutFeedback>
   );
}