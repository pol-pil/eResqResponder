import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { styles } from "@/styles/home.styles";

const categoryIcons: any = {
   "Health Emergency": require("@/assets/pins/healthpin.png"),
   "Crime or Security Threat": require("@/assets/pins/crimepin.png"),
   "Fire Emergency": require("@/assets/pins/firepin.png"),
   "Flood or Weather Disaster": require("@/assets/pins/floodpin.png"),
};

const grayIcons: any = {
   "Health Emergency": require("@/assets/pins/healthpingray.png"),
   "Crime or Security Threat": require("@/assets/pins/crimepingray.png"),
   "Fire Emergency": require("@/assets/pins/firepingray.png"),
   "Flood or Weather Disaster": require("@/assets/pins/floodpingray.png"),
};

const DEFAULT_REGION = {
   latitude: 15.599,
   longitude: 121.0384,
   latitudeDelta: 0.011,
   longitudeDelta: 0.011,
};

export default function GoogleMapView({
   alerts,
   mapFocus,
   onMarkerPress,
   responseStarted,
   activeAlertId,
}: {
   alerts: any[];
   mapFocus: {
      sender: { latitude: number; longitude: number };
      responder: { latitude: number; longitude: number };
   } | null;
   onMarkerPress: (alert: any) => void;
   responseStarted: boolean;
   activeAlertId: string | null;
}) {
   const mapRef = useRef<MapView | null>(null);
   const [mapReady, setMapReady] = useState(false);

   useEffect(() => {
      if (!mapReady || !mapRef.current) return;

      if (
         mapFocus &&
         mapFocus.sender &&
         mapFocus.responder &&
         mapFocus.sender.latitude !== 0 &&
         mapFocus.sender.longitude !== 0 &&
         mapFocus.responder.latitude !== 0 &&
         mapFocus.responder.longitude !== 0
      ) {
         mapRef.current.fitToCoordinates(
            [
               {
                  latitude: mapFocus.sender.latitude,
                  longitude: mapFocus.sender.longitude,
               },
               {
                  latitude: mapFocus.responder.latitude,
                  longitude: mapFocus.responder.longitude,
               },
            ],
            {
               edgePadding: { top: 150, bottom: 170, left: 170, right: 170 },
               animated: true,
            }
         );
      } else {
         mapRef.current.animateToRegion(DEFAULT_REGION, 500);
      }
   }, [mapReady, mapFocus, responseStarted]);

   return (
      <View>
         <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            onMapReady={() => setMapReady(true)}
         >
            {alerts
               ?.filter(
                  (item) =>
                     typeof item.latitude === "number" &&
                     typeof item.longitude === "number"
               )
               .map((item) => (
                  <Marker
                     key={item._id}
                     coordinate={{
                        latitude: item.latitude!,
                        longitude: item.longitude!,
                     }}
                     image={
                        responseStarted && activeAlertId !== item._id
                           ? grayIcons[item.category] ||
                             grayIcons["Health Emergency"]
                           : categoryIcons[item.category] ||
                             categoryIcons["Health Emergency"]
                     }
                     onPress={() => onMarkerPress(item)}
                  />
               ))}
         </MapView>
      </View>
   );
}
