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
          console.log("hehe",snapshot.val());
          var license='';
          var lic;
          license = snapshot.val();
          lic = license.replace(/-/, '');
          const entry = ref(db, 'License plates/' + lic);
          onValue(entry, (snapshot) => {
           
                var childData=snapshot.val();

                const items = Object.values(childData);
                setItemsArray(items);

               // console.log(element.key);
               // console.log("inout",childData.enter);
               // console.log("time",childData.time);
          
         });
        } else {
          console.log("No data available");
        }
        }).catch((error) => {
          console.error(error);
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
          <Text>No items</Text>
        )
        
      }
    </View>

   );
 }
