import * as React from 'react';
import { View,TouchableOpacity, StyleSheet } from "react-native";
import { useState, createContext, useContext } from 'react'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { getDatabase, ref, onValue, once, get,set,child } from 'firebase/database';
import '../../firebase'

export default function ApplicationScreen({ route, navigation }) {
  const { studentID } = route.params;
  var db = getDatabase();
  const dbRef = ref(getDatabase());

  
  const [goapply, setgoapply] = useState({ value: ''})
  
  const [done, setdone] = useState([])
  const [ID, setID] = useState({ value: '', error: '' })
  const [Department, setDepartment] = useState({ value: '', error: '' })
  const [Name, setName] = useState({ value: '', error: '' })
  const [PhoneNumber, setPhoneNumber] = useState({ value: '', error: '' })
  const [Email, setEmail] = useState({ value: '', error: '' })
  const [LicenseNumber, setLicenseNumber] = useState({ value: '', error: '' })

  const [errortype, setErrortype] = useState({ value: "", show: 0});
  //console.log("ID",studentID);
  //get(child(dbRef, 'account/' + studentID+'/license'))
  React.useEffect(() => {
    get(child(dbRef,'account/' + studentID+'/license')).then((snapshot) => {
      if (snapshot.exists()) {
        const pwd = snapshot.val();
        const licesen = snapshot.val().license;
        //console.log(pwd)
        
        setdone(1)
      }
    }).catch((error) => {
      get(child(dbRef,'apply_data/' + studentID)).then((snapshot) => {
        if (snapshot.exists()) {
          const pwd = snapshot.val();
          //console.log(pwd)
          
          setdone(1)
        }
      }).catch((error) => {
        setdone(0)
        console.log("No dataa available");
      });
    });
  }, []);
  
  
  
  const onApplyPressed = async () => {

    const db = getDatabase();
    
    set(ref(db, 'apply_data/' +ID.value), {
      Student_ID: ID.value,
      Department: Department.value,
      Name: Name.value,
      PhoneNumber: PhoneNumber.value,
      Email: Email.value,
      LicenseNumber: LicenseNumber.value,
    });
    setdone(1)
  }
  const numbers = [1, 2, 3, 4, 5];
  return (
    <Background>
     
      {/* <BackButton goBack={navigation.goBack} /> */}
      {/* <Logo /> */}{
      done != 1?[<TextInput
        label="StudentID"
        returnKeyType="next"
        value={ID.value}
        onChangeText={(text) => setID({ value: text, error: '' })}
        autoCapitalize="none"
        keyboardType="numeric"
        key="ID"
      />,
      <TextInput
        label="Department"
        returnKeyType="next"
        key = "Department"
        value={Department.value}
        onChangeText={(text) => setDepartment({ value: text, error: '' })}
      />,
      <TextInput
        label="Name"
        returnKeyType="next"
        value={Name.value}
        key="Name"
        onChangeText={(text) => setName({ value: text, error: '' })}
      />,
       <TextInput
        label="Phone Number"
        returnKeyType="next"
        key="phone"
        keyboardType="numeric"
        value={PhoneNumber.value}
        onChangeText={(text) => setPhoneNumber({ value: text, error: '' })}
      />,
      <TextInput
        label="Email"
        key="email"
        returnKeyType="next"
        value={Email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
      />,
       <TextInput
        key="license"
        label="LicenseNumber"
        returnKeyType="done"
        value={LicenseNumber.value}
        onChangeText={(text) => setLicenseNumber({ value: text, error: '' })}
      />,
      
      <Button mode="contained" key="apply" onPress={onApplyPressed}>
        Apply
      </Button>]:(<Text>done apply</Text>)
}
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