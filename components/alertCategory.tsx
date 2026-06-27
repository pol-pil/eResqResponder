import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/home.styles';

interface AlertCategoryProps {
  iconName: any;
  iconColor: any;
  style?: ViewStyle;
}

export default function AlertCategory({
  iconName,
  iconColor,
  style,
}: AlertCategoryProps) {
  return (
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: iconColor },
        style, 
      ]}
    >
      <Ionicons
        style={[
          styles.icon,
          { fontSize: styles.iconContainer.width * 0.5 },
        ]}
        name={iconName}
      />
    </View>
  );
}
