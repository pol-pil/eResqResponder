import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "@/constants/responsive";

export const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
      fontFamily: "Poppins-Regular",
   },
   containerCategory: {
      flexDirection: "row",
      alignItems: "center",
   },
   containerText: {
      marginLeft: 14,
      width: "76%",
   },
   containerHeader: {
      padding: 20,
      marginBottom: 30,
      backgroundColor: COLORS.white,

      // iOS shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,

      // Android shadow
      elevation: 3,
   },
   containerHeader2: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      marginBottom: 30,
      backgroundColor: COLORS.white,

      // iOS shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,

      // Android shadow
      elevation: 3,
   },
   containerHistory: {
      paddingHorizontal: 24,
      flex: 1,
   },
   containerWait: {
      flex: 1,
      backgroundColor: COLORS.white,
      fontFamily: "Poppins-Regular",
   },
   containerPending: {
      flex: 1,
      backgroundColor: COLORS.white,
      fontFamily: "Poppins-Regular",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
   },
   containerNav: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignContent: "center",
      marginBottom: 18,
      marginInline: -5,
   },
   profileSection: {
      flexDirection: "row",
      alignItems: "center",
   },
   profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
   },
   profileName: {
      fontSize: moderateScale(20),
      fontFamily: "Poppins-Bold",
   },
   profileEmail: {
      fontSize: moderateScale(12),
      color: COLORS.desc,
      fontFamily: "Poppins-Regular",
      marginTop: -8,
   },
   historyTitle: {
      fontSize: moderateScale(18),
      marginBottom: 14,
      fontFamily: "Poppins-Bold",
   },
   alertCard: {
      padding: 18,
      backgroundColor: COLORS.box,
      borderRadius: 12,
      marginBottom: 10,
   },
   alertCategory: {
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(15),
   },
   alertLocation: {
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(10),
      marginTop: -4,
   },
   alertExtraContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
   },
   alertDate: {
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(10),
      color: COLORS.desc,
   },
   alertDate2: {
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(10),
      color: COLORS.desc,
      textAlign: "right",
      marginTop: -8,
      marginBottom: -8,
      marginRight: -2,
   },
   alertDistance: {
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(10),
      color: COLORS.desc,
      marginBottom: -16,
      marginRight: -16,
   },
   alertLevel: {
      width: 8,
      height: 26,
      marginLeft: 8,
      borderRadius: 100,
      backgroundColor: COLORS.health,
   },
   logoutButton: {
      backgroundColor: COLORS.health,
      paddingTop: 8,
      paddingBottom: 7,
      paddingHorizontal: 14,
      borderRadius: 100,
      alignItems: "center",
   },
   logoutButton2: {
      backgroundColor: COLORS.health,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 100,
      alignItems: "center",
   },
   logoutText: {
      color: COLORS.white,
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(12),
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
   waitText: {
      fontSize: moderateScale(14),
      fontFamily: "Poppins-Regular",
      textAlign: "center",
   },

   alertDetails: {
    padding: 12,
    paddingTop: 0,
 },
 detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
 },
 detailLabel: {
    fontSize: moderateScale(12),
    fontFamily: "Poppins-Bold",
    color: "#666",
    flex: 1,
 },
 detailValue: {
    fontSize: moderateScale(12),
    fontFamily: "Poppins-Regular",
    color: "#333",
    flex: 2,
    textAlign: "right",
 },
   responderList: {
      flex: 2,
      alignItems: "flex-end",
   },
   alertDetailsContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
 },
});
