import { moderateScale, scale, verticalScale } from "@/constants/responsive";
import { COLORS } from "@/constants/theme";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
   container: {
      flex: 1,
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

      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
   },
   loginContainer: {
      flex: 1,
      justifyContent: "flex-end",
   },
   loginContent: {
      backgroundColor: COLORS.white,
      padding: scale(30),
      paddingTop: scale(0),
   },
   loginHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: scale(10),
   },
   loginTitle: {
      color: COLORS.black,
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(22),
   },
   inputLabel: {
      color: COLORS.grey,
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(12),
      marginBottom: verticalScale(5),
   },
   inputContainer: {
      marginBottom: verticalScale(15),
   },
   inputContain: {
      flexDirection: "row",
      backgroundColor: COLORS.inp,
      alignItems: "center",
      borderRadius: scale(8),
      paddingHorizontal: scale(10),
   },
   input: {
      flex: 1,
      fontFamily: "Poppins-Regular",
      color: COLORS.black,
      fontSize: moderateScale(16),
   },
   inputname: {
      backgroundColor: COLORS.inp,
      flex: 1,
      fontFamily: "Poppins-Regular",
      color: COLORS.black,
      padding: scale(14),
      fontSize: moderateScale(16),
      borderRadius: scale(8),
   },
   loginButton: {
      backgroundColor: COLORS.green,
      padding: scale(10),
      borderRadius: scale(200),
      alignItems: "center",
      marginTop: verticalScale(10),
      paddingTop: verticalScale(14),
      justifyContent: "center",
      shadowColor: "#3d3d3d",
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
   },
   loginButtonText: {
      color: COLORS.white,
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(22),
   },
   termsContainer: {
      display: "flex",
      flexDirection: "row",
      marginTop: verticalScale(30),
      marginBottom: verticalScale(30),
      justifyContent: "center",
   },
   termsContainerSignup: {
      display: "flex",
      flexDirection: "row",
      marginTop: verticalScale(10),
      justifyContent: "center",
   },
   termsText: {
      fontFamily: "Poppins-Regular",
      fontSize: moderateScale(12),
      color: COLORS.desc,
   },
   termsTextLink: {
      fontFamily: "Poppins-Bold",
      fontSize: moderateScale(12),
      color: COLORS.green,
   },
   iconNormal: {
      fontSize: moderateScale(20),
      color: COLORS.black,
   },
   image: {
      width: "100%",
      height: "100%",
   },

   progressContainer: {
      display: "flex",
      flexDirection: "row",
      marginTop: verticalScale(14),
      alignItems: "center",
      justifyContent: "center",
   },
   progress: {
      fontSize: moderateScale(8),
      marginLeft: moderateScale(5),
      marginRight: moderateScale(5),
      color: COLORS.inp,
   },
   progressActive: {
      fontSize: moderateScale(8),
      marginLeft: moderateScale(5),
      marginRight: moderateScale(5),
      color: COLORS.green,
   },
   error: {
      color: COLORS.health,
      fontFamily: "Poppins-Regular",
   },
   buttonDisabled: {
      opacity: 0.6,
   },
});
