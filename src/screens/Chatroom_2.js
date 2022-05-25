import React, { useState } from 'react'
import { View, Text } from "react-native";
import { TouchableOpacity, StyleSheet } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { getDatabase, ref, onValue, once, get, set, push } from 'firebase/database';
import '../../firebase'

export default function ChatroomScreen({navigation, route}) {
  const [fdlicense, setFdlicense] = useState({ value: '', error: '' })
  const [errortype, setErrortype] = useState({ value: "", show: 0});
  const {studentID} = route.params;
  console.log("studentID : ", studentID);
  const db = getDatabase();
  const reference = ref(db, 'account/' + studentID);
  var nickname;
  onValue(reference, async (snapshot) => {
    nickname = await snapshot.val().nickname;
    console.log("succesful: " + nickname);
  });

  const onAddChatPressed = async () => {
    {/*const added_email = fdlicense.value.replace(/[^a-z0-9]/gi,'');
    const db = getDatabase();
    const snapshot = await get(ref(db, 'account/' + ID.value));
    
    if(snapshot.exists()){
      console.log("succesful");
      const pwd = snapshot.val().fdlicense;
      console.log(pwd);
      if(fdlicense.value != pwd){
        console.log("fdlicense failed");
        setErrortype({value: "Incorrect fdlicense", show: 1});
        return;
      }

    } 
    else{
      console.log("ID failed");
      setErrortype({value: "this student id doesn't exist", show: 1});
      return;
    } 

    // navigation.setParams({
    //   studentID: ID.value,
    // });

    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Dashboard' }],
    // })
    navigation.navigate('Dashboard', {
      studentID: ID.value,
    });*/}
  }
  
  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      {/* <Logo /> */}
      <TextInput
        label="Your Friend's License Number"
        returnKeyType="done"
        value={fdlicense.value}
        onChangeText={(text) => setFdlicense({ value: text, error: '' })}
        error={!!fdlicense.error}
        errorText={fdlicense.error}
      />
      <Button mode="contained" onPress={onAddChatPressed}>
        Add Chat
      </Button>

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
        { errortype.show ? (<Text>{errortype.value}</Text>) : null}
      </View>
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