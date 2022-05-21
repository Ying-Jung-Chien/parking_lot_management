import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Home';
import LogScreen from './Log';
import ChatroomScreen from './Chatroom'
import ApplicationScreen from './Application'


const Drawer = createDrawerNavigator();

export default function Dashboard({ navigation, route }) {
  const {studentID} = route.params;
  console.log("Dashboard : ", studentID);
  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Home" drawerContent={props => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={() => props.navigation.reset({index: 0, routes: [{ name: 'LoginScreen' }],})} />
        </DrawerContentScrollView>
      )
    }}>
      <Drawer.Screen name="Home" component={HomeScreen} initialParams={{ studentID: studentID }}/>
      <Drawer.Screen name="Log" component={LogScreen} initialParams={{ studentID: studentID }}/>
      <Drawer.Screen name="Chatroom" component={ChatroomScreen} initialParams={{ studentID: studentID }}/>
      <Drawer.Screen name="Application" component={ApplicationScreen} initialParams={{ studentID: studentID }}/>
    </Drawer.Navigator>
  )
}