import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { getDatabase, ref, onValue, once, get, child } from 'firebase/database';
import '../../firebase'

export default function CustomDrawer(props) {
  const studentID = props.state.routes[0].params["studentID"];
  const [name, setName] = useState('name');
  console.log("CustomDrawer ", studentID)

  const db = getDatabase();
  const reference = ref(db, `account/${studentID}`);
  onValue(reference, async (snapshot) => {
    const _name = await snapshot.val().name;
    console.log("succesful, ", _name);
    setName(_name);
  });

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#8200d6'}}>
        <ImageBackground
          source={require('../assets/menu-bg.jpeg')}
          style={{padding: 20}}>
          <Image
            source={require('../assets/user-profile.jpg')}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              marginBottom: 5,
            }}>
            {name}
          </Text>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        
        <TouchableOpacity onPress={() => props.navigation.reset({index: 0, routes: [{ name: 'LoginScreen' }],})} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

