import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '@/styles/home.styles'

export default function AlertButton({ text, iconName, iconColor, onPress } : {text:string, iconName:any, iconColor:any, onPress: () => void}) {
    return (
       <TouchableOpacity style={styles.alertContainer} onPress={onPress}>
        <View style={styles.categoryGroup}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
            <Ionicons style={[styles.icon, { fontSize: styles.iconContainer.width * 0.5 }]} name={iconName}/>
          </View>
          <Text style={styles.alertText}>{text}</Text>
        </View>
        <Ionicons name="chevron-forward" style={styles.iconNormal} />
      </TouchableOpacity>
    );
  }
