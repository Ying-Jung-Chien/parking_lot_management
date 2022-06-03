import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'

import { getDatabase, ref, onValue, update, get } from 'firebase/database';
import '../../firebase'

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [ID, setID] = useState({ value: '', error: '' })

  const resetPassword = async () => {
    const db = getDatabase();
    const snapshot = await get(ref(db, 'account/' + ID.value));
    
    if(snapshot.exists()){
      const original = await snapshot.val().original;
      const reference = ref(db, 'account/' + ID.value);
      const updates = {};
      updates['/password'] = original;

      update(reference, updates)
      .then(() => {
        alert("Successfully reset password");
      })
      .catch((error) => {
        alert("Failed to reset password");
      });
    } 
    else{
      console.log("ID failed");
      setErrortype({value: "this student id doesn't exist", show: 1});
      return;
    } 

    
    navigation.navigate('LoginScreen')
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      {/* <Logo /> */}
      <Header>Restore Password</Header>
      <TextInput
        label="Student ID"
        returnKeyType="done"
        value={ID.value}
        onChangeText={(text) => setID({ value: text, error: '' })}
        error={!!ID.error}
        errorText={ID.error}
        autoCapitalize="none"
        autoCompleteType="username"
        textContentType="username"
        keyboardType="numeric"
        description="The password will be reset to the default: the last 4 digits of ID No. + your birthday(MMDD)."
      />
      <Button
        mode="contained"
        onPress={resetPassword}
        style={{ marginTop: 16 }}
      >
        Reset Password
      </Button>
    </Background>
  )
}
