import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import CustomDrawer from '../components/CustomDrawer';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import HomeScreen from './Home';
import ProfileScreen from './Profile';
import LogScreen from './Log';
import ChatroomScreen from './Chatroom'
import ChatroomScreen2 from './Chatroom_2'
import ApplicationScreen from './Application'
import EntryTimeScreen from './EntryTime'

const Drawer = createDrawerNavigator();

export default function Dashboard({ navigation, route }) {
  const {studentID} = route.params;
  // console.log("Dashboard : ", studentID);
  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Home" 
      drawerContent={props => <CustomDrawer {...props}/>
        // {
        //   return (
        //     <DrawerContentScrollView {...props}>
        //       <DrawerItemList {...props} />
        //       <DrawerItem label="Logout" onPress={() => props.navigation.reset({index: 0, routes: [{ name: 'LoginScreen' }],})} />
        //     </DrawerContentScrollView>
        //   )
        // }
      }
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: '#aa18ea',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} initialParams={{ studentID: studentID }}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}/>
      <Drawer.Screen name="Profile" component={ProfileScreen} initialParams={{ studentID: studentID }}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}/>
      <Drawer.Screen name="EntryTime" component={EntryTimeScreen} initialParams={{ studentID: studentID }}
        options={{
          drawerIcon: ({color}) => (
            <AntDesign name="filetext1" size={22} color={color} />
          ),
        }}/>
      <Drawer.Screen name="MessageBoard" component={ChatroomScreen} initialParams={{ studentID: studentID }}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
          ),
        }}/>
      <Drawer.Screen name="SendMessage" component={ChatroomScreen2} initialParams={{ studentID: studentID }}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
          ),
        }}/>
      <Drawer.Screen name="Application" component={ApplicationScreen} initialParams={{ studentID: studentID }}
        options={{
          drawerIcon: ({color}) => (
            <AntDesign name="form" size={22} color={color} />
          ),
        }}/>
    </Drawer.Navigator>
  )
}