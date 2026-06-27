import {
   View,
   Text,
   Image,
   TouchableOpacity,
   Keyboard,
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   Platform,
   ActivityIndicator,
} from "react-native";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
   BottomSheetScrollView,
   BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   isClerkAPIResponseError,
   useSignIn,
   useSignUp,
} from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";
import { verticalScale } from "@/constants/responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const loginSchema = z.object({
   email: z
      .string({ message: "Email is required" })
      .email("Invalid email")
      .max(100, "Email should be less than 100 characters")
      .regex(
         /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
         "Email should not have invalid characters"
      ),
   password: z
      .string({ message: "Password is required" })
      .min(8, "Password should be at least 8 characters long")
      .max(100, "Password should be less than 100 characters")
      .regex(
         /^\d*[A-Za-z]+\d*[A-Za-z]*\d*$/,
         "Password must contain only letters and numbers"
      ),
});
type loginFields = z.infer<typeof loginSchema>;

const mapClerkErrorToFormFieldLogin = (error: any) => {
   switch (error.meta?.paramName) {
      case "identifier":
         return "email";
      case "password":
         return "password";
      default:
         return "root";
   }
};

export default function Login() {
   const [isLoading, setIsLoading] = useState(false);

   useFocusEffect(
      useCallback(() => {
         const timeout = setTimeout(() => {
            bottomSheetVerify.current?.close();
            bottomSheetSignUp1.current?.close();
            bottomSheetLogin.current?.expand();
         }, 500);

         return () => clearTimeout(timeout);
      }, [])
   );

   const bottomSheetLogin = useRef<BottomSheet>(null);
   const bottomSheetSignUp1 = useRef<BottomSheet>(null);
   const bottomSheetVerify = useRef<BottomSheet>(null);
   const handleSheetLogin = useCallback((index: number) => {
      Keyboard.dismiss();
      if (index === -1) {
         resetLoginForm();
      }
   }, []);

   const changeLogin = () => {
      bottomSheetLogin.current?.close();
      bottomSheetSignUp1.current?.expand();
   };

   //LOG IN
   const {
      control: loginControl,
      handleSubmit: handleLoginSubmit,
      setError,
      formState: { errors },
      reset: resetLoginForm,
   } = useForm({ resolver: zodResolver(loginSchema) });

   const { signIn, isLoaded: isLoginLoaded, setActive } = useSignIn();
   const onLogin = async (data: loginFields) => {
      if (!isLoginLoaded) return;

      setIsLoading(true);
      const sanitizedEmail = data.email.replace(/[^A-Za-z0-9._%+-@]/g, "");
      const sanitizedPassword = data.password.replace(/[^A-Za-z0-9]/g, "");

      try {
         const loginAttempt = await signIn.create({
            identifier: sanitizedEmail,
            password: sanitizedPassword,
         });

         if (loginAttempt.status === "complete") {
            setActive({ session: loginAttempt.createdSessionId });
         } else {
            console.log("Login failed");
            setError("root", { message: "Sign in could not be completed" });
         }
      } catch (error) {
         console.log("Login error: ", JSON.stringify(error, null, 2));

         if (isClerkAPIResponseError(error)) {
            error.errors.forEach((error) => {
               const fieldName = mapClerkErrorToFormFieldLogin(error);
               setError(fieldName, {
                  message: error.longMessage,
               });
            });
         } else {
            setError("root", { message: "Unknown error" });
         }
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
         <GestureHandlerRootView style={styles.container}>
            <Image
               style={styles.image}
               source={require("../../assets/images/login.png")}
            />
            <BottomSheet
               ref={bottomSheetLogin}
               onChange={handleSheetLogin}
               enableDynamicSizing={true}
               animateOnMount={true}
               handleIndicatorStyle={{ backgroundColor: COLORS.white }}
               style={styles.bottomSheetStyle}
            >
               <BottomSheetScrollView style={styles.loginContent}>
                  <KeyboardAwareScrollView
                     contentContainerStyle={{ flexGrow: 1 }}
                     enableOnAndroid={true}
                     extraScrollHeight={20}
                  >
                     <View style={styles.loginHeader}>
                        <Text style={styles.loginTitle}>Log in</Text>
                     </View>

                     <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>

                        <CustomInput
                           control={loginControl}
                           name="email"
                           secureTextEntry={false}
                           autoCapitalize="none"
                           keyboardType="email-address"
                           autoComplete="email"
                           editable={!isLoading}
                        />
                     </View>

                     <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <CustomInput
                           control={loginControl}
                           name="password"
                           secureTextEntry={true}
                           editable={!isLoading}
                        />
                        {errors.root && (
                           <Text style={styles.error}>
                              {errors.root.message}
                           </Text>
                        )}
                     </View>

                     <TouchableOpacity
                        style={[
                           styles.loginButton,
                           isLoading && styles.buttonDisabled,
                        ]}
                        onPress={handleLoginSubmit(onLogin)}
                        disabled={isLoading}
                     >
                        {isLoading ? (
                           <ActivityIndicator
                              size="small"
                              color={COLORS.white}
                           />
                        ) : (
                           <Text style={styles.loginButtonText}>Log in</Text>
                        )}
                     </TouchableOpacity>

                     <View style={styles.termsContainer}></View>
                  </KeyboardAwareScrollView>
               </BottomSheetScrollView>
            </BottomSheet>
         </GestureHandlerRootView>
      </TouchableWithoutFeedback>
   );
}
