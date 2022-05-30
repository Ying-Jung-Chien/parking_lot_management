import React, { useState, createContext, useContext } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import MyTextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { IDValidator } from '../helpers/IDValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { getDatabase, ref, onValue, once, get } from 'firebase/database';
import '../../firebase'


export default function LoginScreen({ navigation }) {
  const [ID, setID] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [errortype, setErrortype] = useState({ value: "", show: 0});

  const onLoginPressed = async () => {
    const IDError = IDValidator(ID.value)
    const passwordError = passwordValidator(password.value)
    if (IDError || passwordError) {
      setID({ ...ID, error: IDError })
      setPassword({ ...password, error: passwordError })
      return
    }

    const db = getDatabase();
    const snapshot = await get(ref(db, 'account/' + ID.value));
    
    if(snapshot.exists()){
      // console.log("succesful");
      const pwd = snapshot.val().password;
      // console.log(pwd);
      if(password.value != pwd){
        console.log("password failed");
        setErrortype({value: "Incorrect password", show: 1});
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
    });
  }

  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      {/* <Logo /> */}
      <Header>Welcome back.</Header>
      <MyTextInput
        label="StudentID"
        returnKeyType="next"
        value={ID.value}
        onChangeText={(text) => setID({ value: text, error: '' })}
        error={!!ID.error}
        errorText={ID.error}
        autoCapitalize="none"
        autoCompleteType="username"
        textContentType="username"
        keyboardType="numeric"
      />
      <MyTextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
        { errortype.show ? (<Text>{errortype.value}</Text>) : null}
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
    </Background>
  )
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