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
    let fdid = "123456789";
    console.log("11111111");
    get(reference).then((snapshot) => {
      console.log("2222222222");
      snapshot.forEach(function(childSnapshot) {
        console.log("3333333333");
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        console.log("childData.license=",childData.license,",fdlicense=",fdlicense,"result=",childData.license == fdlicense);
        if(childData.license == fdlicense.value){
          fdid = childSnapshot.key;
          console.log(fdid);
          const msg = messages.value;
          const createdAt = new Date().toLocaleString();
      
          addDoc(collection(db, fdid), { studentID, createdAt, msg, studentID });
      
          setFdlicense({ value: "", error: '' });
          setMessages({ value: "", error: '' });
          return true;
        }
      });
    });
  }
  
  return (
    <GiftedChat
    messages={messages}
    showAvatarForEveryMessage={true}
    // renderUsernameOnMessage={true}
    renderBubble={() => null}
    // renderInputToolbar={() => null}
    onSend={messages => onSend(messages)}
    user={{
        _id: studentID,
        name: studentID,
        avatar: "https://placeimg.com/140/140/any"
    }}
    />
    // <Background>
    //   {/* <BackButton goBack={navigation.goBack} /> */}
    //   {/* <Logo /> */}
    //   <TextInput
    //     label="Your Friend's License Number"
    //     returnKeyType="next"
    //     value={fdlicense.value}
    //     onChangeText={(text) => setFdlicense({ value: text.replace(/[^a-z0-9]/gi,''), error: '' })}
    //     error={!!fdlicense.error}
    //     errorText={fdlicense.error}
    //   />
    //   <TextInput
    //     label="Your Message"
    //     returnKeyType="done"
    //     value={messages.value}
    //     onChangeText={(text) => setMessages({ value: text, error: '' })}
    //     error={!!messages.error}
    //     errorText={messages.error}
    //   />
    //   <Button mode="contained" onPress={onSend}>
    //     Send
    //   </Button>

    // </Background>
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