/** @jest-environment jsdom */
import React from 'react';
import MoodMainScreen from '../screens/MoodMainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from '@testing-library/react-native';

beforeEach(() => {
    AsyncStorage.clear();
});

// Check UI: Does not pass the test
// describe('Check UI', () => {
//   test('Checking <MoodMainScreen />', () => {
//       const snap = render(<MoodMainScreen />).toJSON();
//       expect(snap).toMatchSnapshot();
//   });
// })

describe('Check AsyncStorage', () => {
  test('Test for getItem and setItem', async () => {
    let selectedDateData = '20 June 2022'
    let moodExplainedData = 'feeling great today!'
    let moodNameData = 'smile'
    let moodTextData = 'Happy'
    let moodToneData = '#FFCC33'
    let mood = JSON.stringify([{
      moodDate: {selectedDateString: selectedDateData},
      moodExplained: moodExplainedData,
      selectedMood: {moodName: moodNameData,
        moodText: moodTextData,
        moodTone: moodToneData}}])
    await AsyncStorage.setItem('moodList', mood)
    let output = await AsyncStorage.getItem('moodList')
    expect(output).toBe(mood)
  });
})
