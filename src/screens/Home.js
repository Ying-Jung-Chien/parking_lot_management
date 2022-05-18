import * as React from 'react';
import { View, Text } from "react-native";
import { getDatabase, ref, onValue } from 'firebase/database';
import '../../firebase'

export default function HomeScreen() {
  const db = getDatabase();
  const reference = ref(db, 'account/' + "108010013");
  var nickname;
  onValue(reference, (snapshot) => {
    nickname = snapshot.val().nickname;
  });
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{fontSize:16,fontWeight:'100'}}>Home Screen</Text>
        <Text style={{fontSize:16,fontWeight:'100'}}>{nickname}</Text>
    </View>
  );
 }