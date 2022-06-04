import * as React from 'react';
import { View, Text,StyleSheet, } from "react-native";
import '../../firebase'
import { getDatabase, ref, child, get, onValue,once} from "firebase/database";
import ItemComponent from '../components/ItemComponent.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
export default function EntryTimeScreen ({ route, navigation }) {
  const { studentID } = route.params;
  const [itemsArray, setItemsArray] = React.useState([]);

  var db = getDatabase();
  const dbRef = ref(getDatabase());

  let inoutref = ref(db, 'License plates/');

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
      {
        //(<Text style={{fontSize:16,fontWeight:'700'}}>Entry Time Screen</Text>)
        
        itemsArray.length > 0 ? (
          <ItemComponent items={itemsArray} />
        ) : (
          <Text>No data available</Text>
        )
        
      }
    </View>

   );
 }
