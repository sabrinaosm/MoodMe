import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Modal, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EntryView = (props) => {
  return (
    <View>
      <Text style={{fontWeight:'800', fontFamily:'Avenir'}}>{props.entryTitle}</Text>
      <Text style={{fontWeight:'200', fontFamily:'Avenir', paddingVertical: 5 }} ellipsizeMode='tail' numberOfLines={4}>{props.entryBody}</Text>
      <Text style={{position:'absolute', right:5, top:4, fontWeight:'200', fontFamily:'Avenir'}}>{props.dateToday}</Text>
      <TouchableOpacity style={{position: 'absolute', right:  5, bottom: 5}} onPress={props.deleteOnPress}>
        <MaterialCommunityIcons name='trash-can' size={20} style={{color:'#BE1F35'}}/>
      </TouchableOpacity>
    </View>
  )
};

export default function DiaryScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewEntryModal, setViewEntryModal] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const dateToday = moment().format('D MMMM YYYY');

  const [entryTitle, setEntryTitle] = useState('');
  const [entryBody, setEntryBody] = useState('');
  const [entries, setEntries] = useState([]);

  let entriesEmpty = false;
  if (entries === null) {
    entriesEmpty = true;
  };

  const initialEntry = [{entryTitle, entryBody, dateToday}];
  const entry = {entryTitle, entryBody, dateToday};

  useEffect(() => {
    async function getFunction() {
      await getEntries();
    }
    getFunction();
    return () => {};

  }, []);

  const saveEntry = async () => {
    try {
      if (entries === null) {
        setEntries(initialEntry);
        const output = JSON.stringify(entries);
        await AsyncStorage.setItem('entriesList', output);

      } else {
        entries.push(entry);
        const output = JSON.stringify(entries);
        await AsyncStorage.setItem('entriesList', output);
      }

    } catch (error) {
      console.log(error)
    }
  };

  const deleteEntry = async (index) => {
    try {
      let entriesArray = [...entries];
      entriesArray.splice(index, 1);
      const output = JSON.stringify(entriesArray);
      await AsyncStorage.setItem('entriesList', output);
      setEntries(entriesArray);
      
    } catch (error) {
      console.log(error)
    }
  }

  const getEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('entriesList');
      const output = JSON.parse(data);
      setEntries(output);

    } catch (error){
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
      source={{uri:'https://doodleipsum.com/700/flat?i=93edffde9cb584da90241b8253cf2de3'}}
      style={{width:'50%', aspectRatio: 1, top:'5%'}}
      />

      <View style={styles.header}>
        <Text style={styles.diaryTitle}>Diary: </Text>
        <Text style={styles.diarySubtitle}>Reflect on your day today.</Text>
        <TouchableOpacity
        style={styles.newEntryBtn}
        onPress={() => setModalVisible(true)}>
          <Text style={styles.newEntryText}>Create an Entry</Text>
        </TouchableOpacity>

      </View>

      <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>

        <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.backButton}
          onPress={() => setModalVisible(!modalVisible)}>
            <MaterialCommunityIcons name='keyboard-backspace' size={26}/>
          </TouchableOpacity>

          <View style={{alignItems:'left', width: '100%', paddingLeft: '10%'}}>
            <Text style={[styles.entryHeaderText, {fontFamily: 'Avenir'}]}>What's on your mind?</Text>
            <Text style={{padding: 5, color: '#707070', fontSize: 12, fontFamily: 'Avenir'}}>Title</Text>
            <TextInput
            placeholder='Name your entry..'
            placeholderTextColor='grey'
            style={styles.inputTitle}
            onChangeText={value => setEntryTitle(value)}/>

            <Text style={{padding: 5, color: '#707070', fontSize: 12, fontFamily: 'Avenir'}}>Entry</Text>
            <TextInput
            placeholder='Let your emotions flow..'
            placeholderTextColor='grey'
            multiline={true}
            numberOfLines = {6}
            style={styles.inputBody}
            onChangeText={value => setEntryBody(value)}/>

            <Text style={{textAlign: 'left', padding: 5, color: '#707070', fontSize: 12, fontFamily: 'Avenir'}}>Written on {moment().format('D MMMM YYYY')}</Text>

            <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {saveEntry(),setModalVisible(!modalVisible)}}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{flex:1, paddingHorizontal:'5%', height: '100%', width: '100%'}}>
      <ScrollView style={{ marginBottom: '15%' }}>
        {(entriesEmpty == true | entries?.length === 0)
          ?
          <View style={{height:'100%', borderRadius: 5, borderWidth: 1,  borderStyle: 'dashed', justifyContent:'center'}}>
            <Text style={{padding: 20, textAlign:'center', fontFamily:'Avenir', fontWeight:'200'}}>Begin your self-reflection journey here.. Click on 'Create an Entry' to begin!</Text>
          </View>
          :
          <>
          {
            entries?.map((item, i) => {
              return (
                <View style={[styles.entryContainer, styles.shadowStyle]} key={i}>
                  <TouchableOpacity onPress={() => {setViewEntryModal(!viewEntryModal), console.log('opening index:', i)}}>
                    <EntryView
                    entryTitle={item.entryTitle}
                    entryBody={item.entryBody}
                    dateToday={item.dateToday}
                    deleteOnPress={() => Alert.alert("Are you sure?", "Are you sure you want to clear this entry?", [{text: "Yes", onPress: () => deleteEntry(i)}, {text: 'No'}])}
                    />
                  </TouchableOpacity>
                  <Modal
                  visible={viewEntryModal}
                  onRequestClose={() => {
                    setViewEntryModal(!viewEntryModal);
                  }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                      <TouchableOpacity style={styles.backButton}
                      onPress={() => setViewEntryModal(!viewEntryModal)}>
                        <MaterialCommunityIcons name='keyboard-backspace' size={26}/>
                      </TouchableOpacity>
                      <View style={{width:'80%'}}>
                        <Text style={{fontFamily:'Avenir', fontSize: 25, fontWeight: '800', marginBottom: 15}}>{item.entryTitle}</Text>
                        <Text style={{fontFamily:'Avenir', fontSize: 17, fontWeight: '200', textAlign: 'justify', lineHeight: 25, marginBottom: 15}}>{item.entryBody}</Text>
                        <Text style={{fontFamily:'Avenir', fontSize: 13, fontWeight: '100'}}>{item.dateToday}</Text>
                      </View>
                      <Image source={{uri: "https://doodleipsum.com/700/flat?i=1e5aea83f8f879df9ceb965fe1ee16b1"}} style={{aspectRatio: 1, height: '30%'}} />
                    </View>
                  </Modal>
                </View>
              )
            })
          }
          </>
        }
      </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEFEFE',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  header: {
    alignItems: 'left',
    width:'90%',
    marginBottom: 15
  },

  inputTitle: {
    backgroundColor: '#FEFDFD',
    borderWidth:1,
    width:'90%',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'Avenir',
    borderColor: 'lightgrey'
  },

  inputBody: {
    backgroundColor: '#FEFDFD',
    padding: 15,
    paddingTop: 15,
    borderWidth:1,
    width:'90%',
    height: '50%',
    borderRadius: 5,
    borderColor:'lightgrey',
    fontFamily: 'Avenir'
  },

  diaryTitle: {
    fontFamily:'Avenir',
    fontWeight:'800',
    fontSize: 30,
    color: '#4947D9',
  },

  diarySubtitle: {
    fontFamily:'Avenir',
    fontWeight:'200',
    fontSize: 21,
    color:'#4947D9',
  },

  newEntryBtn: {
    backgroundColor: '#4965CC',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'left',
    marginTop: 15
  },

  newEntryText: {
    color: '#FFF',
    fontWeight: '800',
    fontFamily: 'Avenir'
  },

  entryContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    height: 130,
    padding: 15,
    marginVertical: 10,
    borderColor: 'rgba(158, 150, 150, .5)'
  },

  submitBtn: {
    width: '90%',
    padding: 15,
    backgroundColor: '#4947D9',
    borderRadius: 5,
    marginTop: '10%'
  },

  submitText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '800',
    fontFamily: 'Avenir'
  },

  backButton: {
    position: 'absolute',
    top: '5%',
    left: '5%'
  },

  entryHeaderText: {
    marginTop: '10%',
    marginBottom: '5%',
    fontFamily: 'Avenir',
    fontWeight: '900',
    fontSize: 30,
    color: '#DE2CCF'
  },

  viewEntry: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },

  viewEntryTitle: {
    fontWeight:'900',
    fontFamily: 'Avenir',
    fontSize: 25,
    marginBottom: 20
  },

  viewEntryBody: {
    fontFamily:'Avenir',
    textAlign: 'justify',
    lineHeight: 20,
    marginBottom: 20
  },

});
