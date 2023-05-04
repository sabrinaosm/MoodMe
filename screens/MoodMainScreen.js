import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Alert, Dimensions, Button, Image, TouchableOpacity, Modal, TextInput, Keyboard, Vibration} from 'react-native';
import Emoji from 'react-native-emoji';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MoodView = (props) => {
  return (
    <View>
      <View style={[styles.moodContainer, styles.shadowStyle, {height:'52%', backgroundColor: props.backgroundColor}]}>
        <Emoji name={props.moodName}
        style={{position:'absolute', top: '35%', left:'5%', fontSize: 80, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10}}/>
        <View style={{marginHorizontal:'25%'}}>
          <Text style={{fontWeight:'400', fontSize: 18, fontFamily: 'Avenir', color:'#FFF', textAlign:'center'}}>{props.moodDate}</Text>
          <Text style={{fontWeight:'900', fontSize: 25, fontFamily:'Avenir', color: '#FFF', textAlign:'center'}}>Feeling {props.moodText}!</Text>
          <Text style={{fontWeight:'200', fontSize: 17, fontFamily: 'Avenir', color:'#FFF', textAlign:'center'}}>{props.moodExplained}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.shadowStyle, {backgroundColor:'#BE1F35', marginHorizontal: 10, borderRadius: 5, marginTop: 10}]} onPress={props.onPress}>
        <Text style={{fontFamily:'Avenir', fontWeight:'700', textAlign:'center', color: '#FFF', padding: 15}}>Delete Mood</Text>
      </TouchableOpacity>
    </View>
  )
};

export default function MoodMainScreen(props) {

  const win = Dimensions.get('window');
  const ratio = win.width/541;

  function generateGreetings() {
    let currentHour = moment().format("HH");

    if (currentHour >= 2 && currentHour < 12){
        return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18){
        return "Good Afternoon";
    }   else if (currentHour >= 18 && currentHour < 23){
        return "Good Evening";
    } else if (currentHour >= 23 && currentHour < 3){
        return "Good Night";
    } else {
        return "Hello"
    }
  }

  const emojiMoodList = [
    {'moodName':'angry', 'moodText':'Angry', 'moodTone':'#BE1F35'},
    {'moodName':'sob', 'moodText': 'Upset', 'moodTone':'#1D3F6E'},
    {'moodName':'weary', 'moodText':'Weary', 'moodTone':'#5D4A44'},
    {'moodName':'expressionless', 'moodText':'Bored', 'moodTone':'#6C3082'},
    {'moodName':'relieved', 'moodText':'Relaxed', 'moodTone':'#0EA7A5'},
    {'moodName':'smile', 'moodText':'Happy', 'moodTone':'#FFCC33'},
  ]

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const [selectedMood, setSelectedMood] = useState('');
  const [feeling, setFeeling] = useState('');
  const [moodExplained, setMoodExplained] = useState('');
  const [storedMoods, setStoredMoods] = useState([]);
  let moodDate = { selectedDateString };

  useEffect(() => {
    async function getFunction() {
      await getAllMood();
    }
    getFunction();
    return () => {};

  }, []);

  let moodFound = false;
  let moodLog = [];

  if (storedMoods === null) {
  } else {
    if ((storedMoods.find(moodFound => moodFound.moodDate.selectedDateString === selectedDateString)) === undefined) {
      moodFound = false
    } else {
        moodFound = true;
        moodLog = storedMoods.find(moodFound => moodFound.moodDate.selectedDateString === selectedDateString);
    }
  };

  if (!Array.isArray(moodLog)) {
    moodLog = [moodLog];
  };

  const initialMood = [{moodDate, selectedMood, moodExplained}];
  const mood = {moodDate, selectedMood, moodExplained};

  const setMood = async () => {
    try {
      if (storedMoods === null) {
        setStoredMoods(initialMood);
        const output = JSON.stringify(storedMoods);
        await AsyncStorage.setItem('moodList', output);

      } else {
        storedMoods.push(mood);
        const output = JSON.stringify(storedMoods);
        await AsyncStorage.setItem('moodList', output);
      }
      setSelectedMood('');
      setMoodExplained('');
      Keyboard.dismiss();

    } catch (error) {
      console.log(error);
    }
  };

  const deleteMoodLog = async (index) => {
    try {
      let storedMoodsArray = [...storedMoods];
      storedMoodsArray.splice(index, 1);
      const output = JSON.stringify(storedMoodsArray);
      await AsyncStorage.setItem('moodList', output);
      setStoredMoods(storedMoodsArray);
    } catch (error) {
      console.log(error);
    }
  }

  const getAllMood = async () => {
    try {
      const data = await AsyncStorage.getItem('moodList');
      const output = JSON.parse(data);
      setStoredMoods(output);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={{position:'absolute', top: '5%', left: '8%'}}>
        <Text style={[styles.baseFont, {fontWeight:'800', fontSize:30, color:'#FFF'}]}>{generateGreetings()},</Text>
        <Text style={[styles.baseFont, {fontWeight:'200', fontSize:20, color:'#FFF'}]}>How are you feeling?</Text>
        <Text style={[styles.baseFont, {fontWeight:'200', fontSize:15, color:'#FFF', justifyContent:'center'}]}>{moment().format('D MMMM YYYY')}</Text>
      </View>

      <Image
      source={require('../assets/images/selfcare.jpg')}
      style={{width: win.width, height: 362 * ratio, top:'15%'}}/>

      <View style={styles.innerContainer}>

        <CalendarStrip
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{type: 'background', duration: 200, highlightColor: '#FF9933'}}
          style={styles.calendarStyle}
          calendarHeaderStyle={{fontSize: 20, fontFamily:'Avenir', fontWeight: '800'}}
          dateNameStyle={styles.baseFont}
          dateNumberStyle={styles.baseFont}
          highlightDateNameStyle={{color: '#F8F0E3'}}
          highlightDateNumberStyle={{color: '#F8F0E3'}}
          onDateSelected={(date) => {
            setSelectedDateString(date.format('D MMMM YYYY'));
          }}
        />

        { moodLog.length === 0 ?
          <View style={[styles.moodContainer, styles.shadowStyle, {height:'20%', backgroundColor:'#FFDB4D'}]}>
            <Text style={[styles.baseFont, {color: '#463C3C', fontSize: 18, textAlign: 'center', fontWeight:'700', marginTop: '2%', marginBottom: 5}]}>Hello there, ready to log a mood? </Text>
            <Text style={[styles.baseFont, {color: '#463C3C', fontSize: 16, textAlign:'center', fontWeight:'500'}]}>Begin by choosing a date above!</Text>
          </View>
          :
          <>
            { moodLog.map((item, i) => {
              return (
                <View key={i}>
                  <MoodView
                  backgroundColor={item.selectedMood.item.moodTone}
                  moodName={item.selectedMood.item.moodName}
                  moodDate={item.moodDate.selectedDateString}
                  moodText={item.selectedMood.item.moodText}
                  moodExplained={item.moodExplained}
                  onPress={() => Alert.alert("Are you sure?", "Are you sure you want to delete this mood log?", [{text: "Yes", onPress: () => deleteMoodLog(i)},{text:'No'}])} />
                </View>
              )
            })}
          </>
        }


        <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible); }}>

          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', margin: 10}}>

            <View style={{width: '100%'}}>
              <TouchableOpacity style={{marginLeft: '1%', marginVertical: 20}} onPress={() => setModalVisible(!modalVisible)}>
                <MaterialCommunityIcons name='keyboard-backspace' size={26}/>
              </TouchableOpacity>

              <View style={styles.newMoodHeader}>
                <Text style={{fontFamily: 'Avenir', fontSize: 23, fontWeight: '800'}}>Mood Log</Text>
                <Text style={{fontFamily: 'Avenir', fontSize: 18, fontWeight: '100'}}>{selectedDateString}</Text>
              </View>

              <View style={styles.emojiList}>
                { emojiMoodList.map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={value => {setSelectedMood({item}), setFeeling(item.moodText)}}
                      style={{alignItems: 'center'}}>
                      <View>
                        <Emoji name={item.moodName} style={{fontSize: 30}}/>
                        <Text style={{fontWeight: '200', fontFamily: 'Avenir', marginTop: 5}}>{item.moodText}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                )}
              </View>

              <Text style={{fontFamily: 'Avenir', textAlign:'center', fontWeight:'200'}}>{feeling === '' ? 'How do you feel?' : 'You are feeling ' + feeling + '!'}</Text>

              <TextInput
              onChangeText={value=>setMoodExplained(value)}
              placeholder='Tell us more about your mood!'
              placeholderTextColor="grey"
              style={{backgroundColor:'#FEFEFC', padding: 15, borderWidth: 1, marginVertical: 10, borderRadius: 7, borderColor: 'rgba(158, 150, 150, .5)', fontFamily:'Avenir'}}/>

              <TouchableOpacity
              style={{padding: 15, backgroundColor:'#F500B7', marginBottom: 5, borderRadius: 7}}
              onPress={() => {setMood(), setModalVisible(!modalVisible)}}>
                <Text style={{textAlign:'center', fontFamily: 'Avenir', color:'#FFF', fontWeight: '800'}}>Save Mood</Text>
              </TouchableOpacity>
            </View>

            <View style={{width: '100%', alignItems: 'center'}}>
              <Image
              source={{uri:'https://doodleipsum.com/700/flat?i=330e732c9b45f0dbb3a6728d57e02977'}}
              style={{width:'80%', aspectRatio: 1}}
              />
            </View>
          </View>

        </Modal>
        { (moodLog.length === 0 && selectedDateString) ?
          <View style={{marginTop: 10, marginHorizontal:5}}>
            <TouchableOpacity
            style={styles.openModal}
            onPress={() => setModalVisible(true)}>
              <Text style={styles.openModalText}>
                Log Mood
              </Text>
            </TouchableOpacity>

          </View>
          :
          <></>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B1D5E5'
  },

  baseFont: {
    fontFamily:'Avenir'
  },

  innerContainer: {
    backgroundColor: '#FEFEFE',
    position: 'absolute',
    top: '45%',
    width: '100%',
    height: '100%',
    backgroundColor: '#FEFEFC',
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5
  },

  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5
  },

  calendarStyle: {
    height:'14%',
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 10
  },

  moodContainer: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 15,
    backgroundColor: '#FF9900',
    justifyContent: 'center',
  },

  selectedDate: {
    fontFamily: 'Avenir',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    position: 'absolute',
    left: 25,
    top: 20,
  },

  openModal: {
    backgroundColor:'#0066FF',
    borderRadius: 5,
    marginHorizontal: 5,

  },

  openModalText: {
    color:'white',
    textAlign:'center',
    padding: 15,
    fontFamily: 'Avenir',
    fontWeight: '800',
  },

  emojiList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20
  },

  newMoodHeader: {
    height: '10%',
    justifyContent: 'space-evenly',
    marginVertical: '7%',
    marginLeft: '1%'
  },


})
