/** @jest-environment jsdom */
import React from 'react';
import SettingScreen from '../screens/SettingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from '@testing-library/react-native';

beforeEach(() => {
    AsyncStorage.clear();
});

describe('Check UI', () => {
  test('Checking <SettingScreen />', () => {
      const snap = render(<SettingScreen />).toJSON();
      expect(snap).toMatchSnapshot();
  })
})

describe('Check AsyncStorage', () => {
  test('Test for getItem and setItem', async () => {
    let nameData = 'Sabrina'
    await AsyncStorage.setItem('userName', nameData)
    let output = await AsyncStorage.getItem('userName')
    expect(output).toBe(nameData)
  });
})
