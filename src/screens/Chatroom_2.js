import React, { useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat';
import { View, Text } from "react-native";
import { TouchableOpacity, StyleSheet } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase'
import { getDatabase, ref, onValue, once, get, set, push } from 'firebase/database';

export default function ChatroomScreen2({navigation, route}) {
  const [fdlicense, setFdlicense] = useState({ value: '', error: '' })
  const [messages, setMessages] = useState({ value: '', error: '' });
  const [errortype, setErrortype] = useState({ value: "", show: 0});
  const {studentID} = route.params;
  const dbr = getDatabase();
  const reference = ref(dbr, 'account/');
  
  const user={
    _id: studentID,
    name: studentID,
    avatar: "https://placeimg.com/140/140/any"
  };

  const onSend = () => {
    let fdid = "";
    get(reference).then((snapshot) => {
      snapshot.forEach(function(childSnapshot) {
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        console.log("childData.license=",childData.license,",fdlicense=",fdlicense,"result=",childData.license == fdlicense);
        if(childData.license == fdlicense.value){
          fdid = childSnapshot.key;
          console.log(fdid);
          const t = new Date();
          const newData={
            _id: t.getTime(),
            createdAt: t,
            text: messages.value,
            user: user
          };
      
          addDoc(collection(db, fdid), newData);
      
          setFdlicense({ value: "", error: '' });
          setMessages({ value: "", error: '' });
          return true;
        }
      });
      if(fdid == ""){
        setErrortype({value: "Incorrect license number", show: 1});
      }
    });
  }
  
  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      {/* <Logo /> */}
      <TextInput
        label="License Number"
        returnKeyType="next"
        value={fdlicense.value}
        onChangeText={(text) => setFdlicense({ value: text.replace(/[^a-z0-9]/gi,''), error: '' })}
        error={!!fdlicense.error}
        errorText={fdlicense.error}
      />
      <TextInput
        label="Your Message"
        returnKeyType="done"
        value={messages.value}
        onChangeText={(text) => setMessages({ value: text, error: '' })}
        error={!!messages.error}
        errorText={messages.error}
      />
      { errortype.show ? (<Text>{errortype.value}</Text>) : null}
      <Button mode="contained" onPress={onSend}>
        Send
      </Button>

    </Background>
  );
 }

 const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})