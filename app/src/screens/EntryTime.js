import * as React from 'react';
import { Component } from 'react';
import { Table, Row, Rows,Cols,Col,TableWrapper } from 'react-native-table-component';
import { View, Text,StyleSheet,TouchableOpacity,Alert } from "react-native";
import '../../firebase'
import { getDatabase, ref, child, get, onValue,once} from "firebase/database";
import ItemComponent from '../components/ItemComponent.js';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

export default function EntryTimeScreen ({ route, navigation }) {
  const { studentID } = route.params;
  const [itemsArray, setItemsArray] = React.useState([]);
  const [timeArray, settimeArray] = React.useState([]);
  const [enterArray, setenterArray] = React.useState([]);
  var db = getDatabase();
  const dbRef = ref(getDatabase());

  let inoutref = ref(db, 'License plates/');
  tableHead= ['direction', 'time'],
    

  React.useEffect(() => {
    onValue(inoutref, (snapshot) => {
      get(child(dbRef, 'account/' + studentID+'/license')).then((snapshot) => {
        if (snapshot.exists()) {
          var license='';
          var lic;
          license = snapshot.val();
          lic = license.replace(/-/, '');
          const entry = ref(db, 'License plates/' + lic);
          if(lic!=""){
            onValue(entry, (e) => {
              if (e.exists()) {
                  var childData=e.val();
                  const items = Object.values(childData);
                  setItemsArray(items);
                  const enterList = Object.values(childData).map(item => item.enter=='yes'?'in':'out');
                  const timelist = Object.values(childData).map(item => item.time);
                  setenterArray(enterList);
                  settimeArray(timelist);
                  
              }
            
           });
          }
          else{
            console.log("No data available");
          }
          
        } else {
          console.log("No data available");
        }
        }).catch((error) => {
          console.log("No data available");
        });
   });
      
  }, []);
  
  
  
 
  
   return (
    <View style={styles.container}>
      {console.log("time array",timeArray)}
      {
        
        itemsArray.length > 0 ? (
          //<ItemComponent items={itemsArray} />
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head}  flexArr={[1, 3]}textStyle={styles.text}/>
          <TableWrapper style={styles.wrapper} >
          <Col data={enterArray} height={45} flex = {1} textStyle={styles.text}/>
          <Col data={timeArray} heightArr={45} flex = {3} textStyle={styles.text}/>
        </TableWrapper>
          
          </Table>
        ) : (
          <Text>No data available</Text>
        )
        
      }
    </View>
   );
 }
//<Rows data={itemsArray} textStyle={styles.text}/>
const styles = StyleSheet.create({
  container: {  padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  wrapper: { flexDirection: 'row' },
  text: { margin: 6 ,textAlign: 'center'}
});
