import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './components/BottomTab';

export default function App() {

  return (
    <NavigationContainer>
      <BottomTab />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
