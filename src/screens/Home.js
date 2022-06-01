import * as React from 'react';
import { useState, createContext, useContext } from 'react'
import { View, Text } from "react-native";
import { getDatabase, ref, onValue } from 'firebase/database';
import '../../firebase'


export default function HomeScreen({route}) {
  const {studentID} = route.params;
  // console.log("studentID : ", studentID);
  const db = getDatabase();
  const reference = ref(db, 'account/' + "108010013");
  var nickname;
  // onValue(reference, async (snapshot) => {
  //   nickname = await snapshot.val().nickname;
  //   // console.log("succesful");
  // });
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{fontSize:16,fontWeight:'700'}}>Home Screen</Text>
    </View>
  );
 }