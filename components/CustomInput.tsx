import {
    TextInput,
    StyleSheet,
    TextInputProps,
    Text,
    View,
    TouchableOpacity,
 } from "react-native";
 import { styles } from "@/styles/auth.styles";
 import { Controller } from "react-hook-form";
 import { COLORS } from "@/constants/theme";
 import { Ionicons } from "@expo/vector-icons";
 import { useState } from "react";
 
 type CustomInputProps = {
    control: any;
    name: string;
    secureTextEntry: any;
 } & TextInputProps;
 
 export default function CustomInput({
    control,
    name,
    secureTextEntry,
    ...props
 }: CustomInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
    return (
       <Controller
          control={control}
          name={name}
          rules={{ required: "This field is required" }}
          render={({
             field: { value, onChange, onBlur },
             fieldState: { error },
          }) => (
             <View>
                <View style={[styles.inputContain, { backgroundColor: error ? COLORS.error : COLORS.inp },]}>
                <TextInput
                   {...props}
                   value={value}
                   onChangeText={onChange}
                   onBlur={onBlur}
                   secureTextEntry={!isPasswordVisible}
                   style={
                      styles.input
                }
                />
                {secureTextEntry && (
                   <TouchableOpacity
                      onPress={() => setIsPasswordVisible((prev) => !prev)}
                   >
                      <Ionicons
                         name={isPasswordVisible ? "eye-off" : "eye"}
                         style={[styles.iconNormal, {color: COLORS.desc}]}
                      />
                   </TouchableOpacity>
                )}
                </View>
                {error && <Text style={styles.error}>{error?.message}</Text>}
             </View>
          )}
       />
    );
 }
 