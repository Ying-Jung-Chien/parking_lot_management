import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import DrawerItems from '../constants/DrawerItems'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import Page1Screen from './Page1';
import Page2Screen from './Page2';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';
// import { FontAwesome5 } from '@expo/vector-icons';


const Drawer = createDrawerNavigator();

export default function Dashboard({ navigation }) {
  return (
    /*<Background>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph>
        Your amazing app starts here. Open you favorite code editor and start
        editing this project.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>*/
    
    <Drawer.Navigator useLegacyImplementation initialRouteName="Page1" drawerContent={props => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={() => props.navigation.reset({index: 0, routes: [{ name: 'StartScreen' }],})} />
        </DrawerContentScrollView>
      )
    }}>
      <Drawer.Screen name="Page1" component={Page1Screen} />
      <Drawer.Screen name="Page2" component={Page2Screen} />
    </Drawer.Navigator>
  )
}