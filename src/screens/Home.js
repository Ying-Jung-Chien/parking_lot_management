import * as React from 'react';
import { useState, createContext, useContext } from 'react'
import { View, Text } from "react-native";
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { getDatabase, ref, onValue,get,child ,set} from 'firebase/database';
import '../../firebase'

var space = 100;
export default function HomeScreen({route}) {
  const {studentID} = route.params;
  const [count_car, setcount_car] = useState({ value: 0})
  const [OwnCar, setOwnCar] = useState({ value: 0})
  const [Pos, setPos] = useState({ value: ''})
  const [input, setinput] = useState({ value: ''})
  const [License, setLicenseNumber] = useState({ value: ''})
  // console.log("studentID : ", studentID);
  const db = getDatabase();
  const reference = ref(db, 'account/' + "108010013");
  var nickname;

  const entry = ref(db, 'License plates/');
  

  React.useEffect(() => {
    let inoutref = ref(db, 'License plates/');
    onValue(inoutref, (snapshot) => {
      snapshot.forEach(function (element) { 
        var car = element.key;
        var position;
        element.forEach(function (e) { 
          var pos = e.val();
          position = pos.enter;
          
        });
        var cur;
        
        if(position == 'no'){
          set(ref(db, 'position/' +car), 'out');
        }
        else{
          get(child(dbRef,'position/' + car)).then((s) => {
            if (s.exists()) {
              if(s.val()=='out'){
                set(ref(db, 'position/' +car), 'in');
              }
            }
            else{
              set(ref(db, 'position/' +car), 'in');
            }
          })
         
        }
      });
    });

    const pos = ref(db, 'position/' );
  onValue(pos,  (snapshot) => {
    //console.log(snapshot.val());
    var num = 0;
    snapshot.forEach(function (snapshot) {   
      var obj = snapshot.val();
      if(obj!='out'){
        num = num+1;
      }
     });
     setcount_car({value:num})
     get(child(dbRef,'account/' + studentID+'/license')).then((snapshot) => {
      if (snapshot.exists()) {
        const pwd = snapshot.val();
        setLicenseNumber({value:pwd})
        setOwnCar({value:1})
        if(pwd!=""){
          get(child(dbRef,'position/' + pwd)).then((snapshot) => {
            if(snapshot.exists()){
              //console.log("snapshot",snapshot.val());
              setPos({value:snapshot.val()})
              if(snapshot.val()=='in')setinput({value:1})
              else setinput({value:0})
            }
            else{
              setinput({value:0})
              set(ref(db, 'position/' +pwd), 'out');
            }
            
          })
          setOwnCar({value:1})
        }
        else{
          setOwnCar({value:0})
        }
        
      }
      else{
        setOwnCar({value:0})
      }
    }).catch((error) => {
      setOwnCar({value:0})
    });
  });
  const dbRef = ref(getDatabase());
  
  }, []);
  
  const onApplyPressed = async () => {
    const db = getDatabase();
    set(ref(db, 'position/'+License.value), Pos.value);
    setinput({value:0})
  }

  const rendeposition = () => {
    if (OwnCar.value==1) {
      if(input.value==1){
        return [<TextInput
          label="Position"
          returnKeyType="done"
          value={Pos.value}
          onChangeText={(text) => setPos({ value: text})}
        />,
        
        <Button mode="contained" onPress={onApplyPressed}>
          Enter
        </Button>];
      }
      else{
        return <Text style={{fontSize:16,fontWeight:'700'}}>Position: {Pos.value}</Text>;
            
      }
    } else {
      return <Text style={{fontSize:16,fontWeight:'700'}}>No car</Text>;
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{fontSize:16,fontWeight:'700'}}>Home Screen</Text>
        {<Text style={{fontSize:16,fontWeight:'700'}}>available: {space-count_car.value}</Text>}
        {rendeposition()}
    </View>
  );
 }
