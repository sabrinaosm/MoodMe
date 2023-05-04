import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MoodMainScreen from '../screens/MoodMainScreen';
import SettingScreen from '../screens/SettingScreen';
import DiaryScreen from '../screens/DiaryScreen';

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1} style={styles.container}>
      <MaterialCommunityIcons name={focused ? item.activeIcon : item.inactiveIcon} />
    </TouchableOpacity>
  )
}

export default function BottomTab() {
  return(
    <Tab.Navigator
    screenOptions = {
      {
        headerShown:false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#FAF9F6',
          height: 70,
          width: '80%',
          bottom: 20,
          left: '10%',

          borderRadius: 30,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.15,
          shadowRadius: 4
        },
      }
    }>

      <Tab.Screen
      name="Home"
      component={MoodMainScreen}
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialCommunityIcons
          name={focused ? 'home-heart' : 'home-outline'}
          color={focused ? '#F500B7' : '#707070'}
          size={28}
          style={{position: 'absolute', top: 20}} />
        )}
      } />
      <Tab.Screen
      name="Diary"
      component={DiaryScreen}
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialCommunityIcons
          name={focused ? 'folder-heart' : 'folder-heart-outline'}
          color={focused ? '#F500B7' : '#707070'}
          size={26}
          style={{position: 'absolute', top: 20}}/>
          )}
      } />
      <Tab.Screen
      name="Settings"
      component={SettingScreen}
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialCommunityIcons
          name={focused ? 'cog' : 'cog-outline'}
          color={focused ? '#F500B7' : '#707070'}
          size={26}
          style={{position: 'absolute', top: 20}}/>
        )}
      } />

    </Tab.Navigator>
  )
}
