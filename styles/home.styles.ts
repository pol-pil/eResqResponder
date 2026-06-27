import { COLORS } from "@/constants/theme";
import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, moderateScale } from "@/constants/responsive";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
   map: {
      width: width,
      height: height * 0.9,
      zIndex: 0,
      position: "absolute",
   },
   container: {
      flex: 1,
   },
   category: {
      backgroundColor: COLORS.white,
      padding: scale(20),
      paddingTop: scale(4),
      paddingBottom: scale(20),
   },
   categoryExit: {
      width: "100%",
      height: "100%",
   },
   alertText: {
      marginLeft: scale(20),
      fontSize: moderateScale(14),
      fontFamily: "Poppins-Regular",
   },
   alertContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: scale(10),
   },
   iconContainer: {
      backgroundColor: COLORS.health,
      height: scale(50),
      width: scale(50),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: scale(54) / 2,
   },
   icon: {
      color: COLORS.white,
   },
   categoryGroup: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
   },
   confirmContainer: {
      flex: 1,
      justifyContent: "flex-end",
   },
   confirmContent: {
      backgroundColor: COLORS.white,
      padding: scale(24),
      paddingTop: scale(4),
      paddingBottom: scale(30),
   },
   confirmHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: scale(20),
   },
   confirmTitle: {
      color: COLORS.black,
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(20),
   },
   liveTitle: {
      color: COLORS.black,
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(20),
      marginBottom: 16,
   },
   confirmText: {
      color: COLORS.black,
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(14),
   },
   alertLocation: {
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(12),
      marginTop: -6,
   },
   relatedCategory: {
      marginLeft: 10,
      height: 50,
      width: 50,
   },
   alertDistance: {
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(12),
      marginRight: 16,
   },
   inputContainer: {
      marginBottom: verticalScale(20),
   },
   inputLabel: {
      color: COLORS.grey,
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(12),
      marginBottom: verticalScale(5),
   },
   input: {
      backgroundColor: COLORS.inp,
      fontFamily: "Poppins-Regular",
      borderRadius: scale(8),
      padding: scale(14),
      color: COLORS.black,
      fontSize: moderateScale(16),
   },
   alertButtonText: {
      color: COLORS.white,
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(16),
      textAlign: "center",
   },
   alertIcon: {
      color: COLORS.white,
      fontSize: moderateScale(26),
      marginBottom: verticalScale(6),
      marginLeft: scale(10),
   },

   bottomSheetStyle: {
      borderWidth: 0,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,

      elevation: 24,
   },

   iconNormal: {
      fontSize: moderateScale(20),
      color: COLORS.black,
   },

   radioChoice: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(10),
   },
   radioText: {
      marginLeft: scale(20),
      fontSize: moderateScale(16),
      fontFamily: "Poppins-Regular",
   },
   checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
   },
   nameContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   anotherContainer: {
      marginTop: -10,
      marginBottom: verticalScale(20),
   },
   descriptionContainer: {
      marginTop: -10,
      marginBottom: verticalScale(20),
   },
   alertLevel: {
      width: 8,
      height: 30,
      marginTop: -28,
      marginRight: 16,
      borderRadius: 100,
   },
   alertButtonContainer: {
      width: "50%",
      alignSelf: "flex-end",
      marginBottom: verticalScale(30),
      marginTop: verticalScale(20),
   },
   alertButtonContainer2: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: verticalScale(30),
      marginTop: verticalScale(20),
   },
   alertButton: {
      backgroundColor: COLORS.flood,
      padding: scale(6),
      paddingTop: verticalScale(10),
      borderRadius: scale(8),
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
   },
   responseButtonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
   },
   markResolvedButton: {
      width: "48%",
      backgroundColor: COLORS.green2,
      padding: scale(6),
      paddingTop: verticalScale(10),
      borderRadius: scale(8),
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
   },
   cancelButton: {
      width: "48%",
      backgroundColor: COLORS.crime,
      padding: scale(6),
      paddingTop: verticalScale(10),
      borderRadius: scale(8),
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
   },
   relatedContainer: {
      borderRadius: scale(10),
      backgroundColor: COLORS.inp,
      paddingLeft: 10,
      paddingRight: 10,
   },
   policyContainer: {
      marginBottom: verticalScale(28),
   },
   policyText: {
      color: COLORS.grey,
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(10),
      textAlign: "center",
   },
   profileImage: {
      width: 40,
      height: 40,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: COLORS.white,
   },
   profile: {
      position: "absolute",
      top: 10,
      left: 10,
      zIndex: 10,
      elevation: 4,
      borderRadius: 100,
   },
   responseTitle: {
      color: COLORS.green,
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(28),
   },
   responseText: {
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(14),
      marginTop: verticalScale(-10),
      marginBottom: verticalScale(10),
   },
   responseCancelButton: {
      alignItems: "center",
      alignSelf: "center",
   },
   responseCancelText: {
      color: COLORS.desc,
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(18),
   },
   awaitResponse: {
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(14),
      marginBottom: verticalScale(8),
      marginLeft: 10,
   },

   alertButtonLoading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
   },

   loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
   },
   loadingContainer: {
      backgroundColor: COLORS.white,
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
   },
   loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: COLORS.black,
   },
   loadingState: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
   },
   loadingStateText: {
      marginLeft: 8,
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(14),
      color: COLORS.desc,
   },
   emptyState: {
      padding: 20,
      alignItems: "center",
   },
   emptyStateText: {
      fontSize: 14,
      color: COLORS.desc,
      textAlign: "center",
   },
   buttonDisabled: {
      opacity: 0.6,
   },
});
