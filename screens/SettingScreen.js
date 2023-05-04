import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, Modal, FlatList, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingScreen() {
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalGuideVisible, setModalGuideVisible] = useState(false);

  useEffect(() => {
    getName();
  }, []);

  const saveName = async () => {
    try {
      await AsyncStorage.setItem('userName', name)
    } catch (error) {
      console.log(error);
    }
  };

  const getName = async () => {
    try {
      const value = await AsyncStorage.getItem('userName');
      if (value !== null) {
        setName(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearAll = async() => {
    try {
      await AsyncStorage.clear();
      setName('');
    } catch (error) {
      console.log(error);
    }
  };

  const SettingOption = (props) => {
    return (
      <TouchableOpacity style={styles.settingCell} onPress={props.onPress}>
        <Text style={{fontFamily: 'Avenir', fontSize: 18}}>{props.optionTitle}</Text>
        <Text style={{fontFamily: 'Avenir', fontSize: 15}}>{props.optionSubtitle}</Text>
      </TouchableOpacity>
    )
  };

  const showConfirmDialog = () => {
    return Alert.alert(
      "Are you sure?",
      "Are you sure you want to clear all information in MoodMe?",
      [{  text: "Yes",
          onPress: () => {clearAll()},
        },
        {
          text: "No",
        },]
    );
  };

  return (
    <View style={styles.container}>
      <Image
      source={{uri:'https://doodleipsum.com/700/flat?i=4a912bdfb7a2b359421bf69acbd6e221'}}
      style={{marginTop:'5%', width: '80%', aspectRatio: 1}}/>
      <View style={styles.header}>
        <Text style={styles.greetingStyle} testID="getName">Hi{name ? ', ' + name + '!' : '!'}</Text>

        <Text style={styles.headerText} textID="Settings">Settings</Text>
      </View>

      <ScrollView style={styles.settingContainer}>
        <SettingOption
        optionTitle='Personal Information'
        optionSubtitle='Make changes to your personal information!'
        onPress={ () => setModalVisible(true) } />

        <SettingOption
        optionTitle='Reset and Clear'
        optionSubtitle='Reset and clear all logged moods and diary entries.'
        onPress={ () => showConfirmDialog() } />

        <SettingOption
        optionTitle='About'
        optionSubtitle='A guide on using this application!'
        onPress={() => setModalGuideVisible(true)} />
      </ScrollView>

      <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {setModalVisible(!modalVisible);}}
      >
      <View style={{height:'60%'}}>
        <TouchableOpacity style={{marginLeft: '7%', marginTop: '15%'}} onPress={() => setModalVisible(!modalVisible)}>
          <MaterialCommunityIcons name='keyboard-backspace' size={26}/>
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent:'center', alignItems: 'center', margin: 20}}>
          <View style={{justifyContent: 'left', width: '90%', marginBottom: 20}}>
            <Text style={{fontWeight:'900', color:'#24B9CD', fontSize: 30, fontFamily: 'Avenir'}}>Personal Information</Text>
            <Text style={{fontWeight:'400', fontSize: 17, fontFamily: 'Avenir'}}>Make changes to your personal information here.</Text>
          </View>
          <View style={{justifyContent:'center', width:'90%'}}>
            <Text style={{fontWeight:'200', fontSize: 15, fontFamily: 'Avenir', marginVertical: 5}}>Edit Name:</Text>
            <TextInput
              placeholder={name ? name : 'Enter a name..'}
              placeholderTextColor='lightgray'
              onChangeText={value=>setName(value)}
              style={{borderRadius: 5, borderWidth: 1, padding: 15}}
              testID="nameInput"
              />
            <TouchableOpacity testID="saveName" onPress={() => {saveName(),setModalVisible(!modalVisible)}}
            style={{width:'100%', backgroundColor: '#F0E6F9', borderRadius: 5, padding: 15, marginVertical: 20}}>
              <Text style={{fontFamily:'Avenir', color:'#463C3C', fontWeight:'700'}}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>

      <Modal
      animationType="slide"
      transparent={false}
      visible={modalGuideVisible}
      onRequestClose={() => {setModalGuideVisible(!modalGuideVisible);}}>
        <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
          <View style={{height: '80%'}}>
            <Text style={[styles.guideText, {fontWeight: '900', fontSize: 25, color:'#24B9CD'}]}>Welcome to MoodMe!</Text>
            <Text style={[styles.guideText, {textAlign:'justify'}]}>MoodMe encourages self-care, self-improvement and overall wellbeing in your everyday life. Be mindful of your days through mood tracking and reflect through your own personal diary! </Text>
            <Text style={[styles.guideText, {fontWeight: '800', fontSize: 23, marginTop: 10}]}>Mood Tracker</Text>
            <FlatList style={{height:'15%'}} data={[
             {key: 'Choose a date to log a mood and click on Log Mood.' },
             {key: 'Choose an emotion.'},
             {key: 'Explain why you are feeling the way you do.'},
             {key: 'Click on Save Mood and you have successfully logged your mood of the day!'}
           ]}
           renderItem={({item}) =>
           <Text style={styles.guideText}>{'\uD83D\uDC97' + '  '}{item.key}</Text>}/>
            <Text style={[styles.guideText, {fontWeight: '800', fontSize: 23, marginTop: 10}]}>Personal Diary</Text>
            <FlatList style={{height:'15%'}} data={[
              {key: 'Create a diary entry by clicking on Create an Entry.'},
              {key: 'Title your diary entry and start journaling.'},
              {key: 'Click on Submit and you have successfully created a diary journaling!'},
            ]} renderItem={({item}) =>
              <Text style={styles.guideText}>{'\uD83D\uDC97' + '  '}{item.key}</Text>} />
            <View style={{alignItems:'center'}}>
              <Text style={{fontFamily:'Avenir', fontWeight: '900', fontSize: 20, color:'#0066FF', paddingBottom: 5}}>Enjoy, and thank you for choosing MoodMe.</Text>
              <Image source={{uri: 'https://doodleipsum.com/700/flat?i=90468079198d7a92a5f156ff4f784fd1'}}
              style={{aspectRatio: 1, width: '50%', paddingLeft:'5%'}}/>
              <TouchableOpacity style={{borderRadius: 5, backgroundColor: '#FF9900', padding: 15, width: '50%', alignItems:'center'}} onPress={() => setModalGuideVisible(!setModalGuideVisible)}>
                <Text style={{color:'#F8F0E3', fontFamily:'Avenir', fontWeight:'800'}}>Thanks!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 10
  },

  header: {
    width: '100%',
  },

  greetingStyle: {
    paddingLeft: '5%',
    fontWeight:'700',
    fontSize: 25,
    fontFamily: 'Avenir',
    color:'#463C3C'
  },

  headerText: {
    fontSize: 45,
    fontFamily: 'Avenir',
    color: '#24B9CD',
    fontWeight: '900',
    paddingLeft: '5%',
    textShadowColor: 'rgba(0, 0, 0, 0.12)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },

  guideText: {
    paddingLeft: '5%',
    width: '90%',
    fontFamily: 'Avenir',

    marginBottom: 5
  },

  settingContainer: {
    width: '100%',
    padding: 20
  },

  settingCell: {
    padding: 15,
    width:'100%',
    height:'30%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(158, 150, 150, .5)',
    marginVertical: 9,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5
  },
})
