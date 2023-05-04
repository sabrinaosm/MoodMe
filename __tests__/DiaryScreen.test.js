/** @jest-environment jsdom */
import React from 'react';
import DiaryScreen from '../screens/DiaryScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from '@testing-library/react-native';

beforeEach(() => {
    AsyncStorage.clear();
});

describe('Check UI', () => {
  test('Checking <DiaryScreen />', () => {
      const snap = render(<DiaryScreen />).toJSON();
      expect(snap).toMatchSnapshot();
  });
})

describe('Check AsyncStorage', () => {
  test('Test for getItem and setItem', async () => {
    let entryTitleData = 'Entry Title Test'
    let entryBodyData = 'Entry Body Test'
    let dateTodayData = '20 June 2022'
    let entry = JSON.stringify([{
          entryTitle: entryTitleData,
          entryBody: entryBodyData,
          dayToday: dateTodayData }])
    await AsyncStorage.setItem('entriesList', entry)
    let output = await AsyncStorage.getItem('entriesList')
    expect(output).toBe(entry)
  });
})
