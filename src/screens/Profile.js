import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback, 
  Keyboard,
  TextInput
} from 'react-native';

import {useTheme} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import Modal from "react-native-modal";
import * as ImagePicker from 'expo-image-picker';

import { getDatabase, ref, onValue, once, get, child, update } from 'firebase/database';
import { getStorage, storage, uploadBytes, getDownloadURL, uploadBytesResumable  } from "firebase/storage";
import { ref as sRef } from 'firebase/storage';
import '../../firebase'
import { passwordValidator } from '../helpers/passwordValidator'
import { oldPasswordValidator } from '../helpers/oldPasswordValidator'
import { confirmPasswordValidator } from '../helpers/confirmPasswordValidator'
import MyTextInput from '../components/TextInput'


export default function ProfileScreen({route}) {
  const {studentID} = route.params;
  const {colors} = useTheme();
  const [name, setName] = useState('name');
  const [password, setPassword] = useState('password');
  const [nickName, setNickName] = useState('nickName');
  const [license, setLicense] = useState('license');
  const [email, setEmail] = useState('email');
  const [phone, setPhone] = useState('phone');
  const [image, setImage] = useState('https://firebasestorage.googleapis.com/v0/b/parking-lot-management-5116b.appspot.com/o/avatar%2Fnull.jpg?alt=media&token=43c797de-0439-4103-9083-249fc138c885');
  const [visible, setVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState({ value: '', error: '' });
  const [newPassword, setNewPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });

  const bs = React.createRef();
  const fall = new Animated.Value(1);
  

  const db = getDatabase();
  const reference = ref(db, `account/${studentID}`);
  onValue(reference, async (snapshot) => {
    const _name = await snapshot.val().name;
    const _password = await snapshot.val().password;
    const _nickName = await snapshot.val().nickname;
    const _license = await snapshot.val().license;
    const _email = await snapshot.val().email;
    const _phone = await snapshot.val().phone;
    const _avatar = await snapshot.val().avatar;
    // console.log("succesful, ", _name);
    setName(_name);
    setPassword(_password);
    setNickName(_nickName);
    setLicense(_license);
    setEmail(_email);
    setPhone(_phone);
    if(_avatar) setImage(_avatar);
  });

  const handleNickname = (text) => {
    const updates = {};
    updates['/nickname'] = text;

    update(reference, updates)
    .then(() => {
      alert("Successfully changed nickname");
    })
    .catch((error) => {
      alert("Failed to change nickname");
    });
    
  }

  const handlePhone = (text) => {
    const updates = {};
    updates['/phone'] = text;

    update(reference, updates)
    .then(() => {
      alert("Successfully changed phone");
    })
    .catch((error) => {
      alert("Failed to change phone");
    });
    
  }

  const handleEmail = (text) => {
    const updates = {};
    updates['/email'] = text;

    update(reference, updates)
    .then(() => {
      alert("Successfully changed email");
    })
    .catch((error) => {
      alert("Failed to change email");
    });
    
  }

  const handleOldPassword = () => {
    // console.log("old password: ", oldPassword.value);
    // console.log("password: ", password);
    const oldPasswordError = oldPasswordValidator(password, oldPassword.value);
    if (oldPasswordError) {
      setOldPassword({ ...oldPassword, error: oldPasswordError });
      return
    }
  }

  const handleNewPassword = () => {
    // console.log("new password: ", newPassword.value);
    const passwordError = passwordValidator(newPassword.value);
    if (passwordError) {
      setNewPassword({ ...newPassword, error: passwordError });
      return
    }
  }

  const handleConfirmPassword = () => {
    // console.log("confirm password: ", confirmPassword.value);
    const confirmPasswordError = confirmPasswordValidator(newPassword.value, confirmPassword.value);
    if (confirmPasswordError) {
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      return
    }
  }

  const handleConfirm = () => {
    const passwordError = passwordValidator(newPassword.value);
    const oldPasswordError = oldPasswordValidator(password, oldPassword.value);
    const confirmPasswordError = confirmPasswordValidator(newPassword.value, confirmPassword.value);
    if (oldPasswordError || passwordError || confirmPasswordError) {
      // console.log("password: ", password);
      setOldPassword({ ...oldPassword, error: oldPasswordError });
      setNewPassword({ ...newPassword, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      return
    }
    
    const updates = {};
    updates['/password'] = newPassword.value;

    update(reference, updates)
    .then(() => {
      alert("Successfully changed password");
      setOldPassword({ value: '', error: '' });
      setNewPassword({ value: '', error: '' });
      setConfirmPassword({ value: '', error: '' });
      setVisible(!visible);
    })
    .catch((error) => {
      alert("Failed to change password");
    });
    
  }

  uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const _storage = getStorage();
    const storageRef = sRef(_storage, `avatar/${studentID}.jpg`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log('File available at', downloadURL);
          const updates = {};
          updates['/avatar'] = downloadURL;

          update(reference, updates)
          .then(() => {
            alert("Successfully changed avatar");
          })
          .catch((error) => {
            alert("Failed to change avatar");
          });
        });
      }
    );
}

  const pickImageFromCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
    
  };

  const pickImageFromLibrary = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
    
  };

  const takePhotoFromCamera = () => {
    pickImageFromCamera();
    bs.current.snapTo(1);
  }

  const choosePhotoFromLibrary = () => {
    pickImageFromLibrary();
    bs.current.snapTo(1);
  }

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={() => takePhotoFromCamera()}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={() => choosePhotoFromLibrary()}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <BottomSheet
          ref={bs}
          snapPoints={[330, 0]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
        />
        <Animated.View style={{margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),}}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ImageBackground
                  source={{
                    uri: image,
                  }}
                  // source={require('../assets/user-profile.jpg')}
                  style={{height: 100, width: 100}}
                  imageStyle={{borderRadius: 15}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="camera"
                      size={35}
                      color="#fff"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
            <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
              {name}
            </Text>
          </View>
          <View style={styles.action}>
            <FontAwesome name="id-card-o" color={colors.text} size={20} />
            <Text style={[styles.textInput,{color: colors.text,}, {flexDirection:"row"}, {flex:3},]}>Student ID</Text>
            <Text style={[styles.textInput,{color: colors.text,}, {flexDirection:"row"}, {flex:7},]}>{studentID}</Text>
          </View>
          <View style={styles.action}>
            <FontAwesome name="motorcycle" color={colors.text} size={20} />
            <Text style={[styles.textInput,{color: colors.text,}, {flexDirection:"row"}, {flex:3},]}>License</Text>
            <Text style={[styles.textInput,{color: colors.text,}, {flexDirection:"row"}, {flex:7},]}>{license}</Text>
          </View>
          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <Text style={[styles.textInput,{color: colors.text,}, {flexDirection:"row"}, {flex:3},]}>Nickname</Text>
            <TextInput
              placeholder={nickName}
              placeholderTextColor="#666666"
              returnKeyType="done"
              autoCorrect={false}
              style={[
                styles.textInput,
                {color: colors.text,},
                {flexDirection:"row"}, {flex:7},
              ]}
              onSubmitEditing={(event) => handleNickname(event.nativeEvent.text)}
            />
          </View>
          <View style={styles.action}>
            <Feather name="phone" color={colors.text} size={20} />
            <Text style={[styles.textInput,{color: colors.text,}, {flexDirection:"row"}, {flex:3},]}>Phone</Text>
            <TextInput
              placeholder={phone}
              placeholderTextColor="#666666"
              keyboardType="default"
              returnKeyType="done"
              autoCorrect={false}
              style={[
                styles.textInput,
                {color: colors.text,},
                {flexDirection:"row"}, {flex:7},
              ]}
              onSubmitEditing={(event) => handlePhone(event.nativeEvent.text)}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="envelope-o" color={colors.text} size={20} />
            <Text style={[styles.textInput,{color: colors.text,}, {flexDirection:"row"}, {flex:3},]}>Email</Text>
            <TextInput
              placeholder={email}
              placeholderTextColor="#666666"
              keyboardType="email-address"
              returnKeyType="done"
              autoCorrect={false}
              style={[
                styles.textInput,
                {color: colors.text,},
                {flexDirection:"row"}, {flex:7},
              ]}
              onSubmitEditing={(event) => handleEmail(event.nativeEvent.text)}
            />
          </View>
          <View style={styles.centeredView}>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => setVisible(!visible)}
            >
              <Text style={styles.textStyle}>Change Password</Text>
            </Pressable>
            <Modal
              animationType="slide"
              transparent={true}
              visible={visible}
              onBackdropPress={() => {
                setVisible(!visible);
              }}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setVisible(!visible);
              }}
            >
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Change Password</Text>
                <MyTextInput
                  label="Old Password"
                  returnKeyType="done"
                  value={oldPassword.value}
                  onChangeText={(text) => setOldPassword({ value: text, error: '' })}
                  onSubmitEditing={() => handleOldPassword()}
                  error={!!oldPassword.error}
                  errorText={oldPassword.error}
                  secureTextEntry
                />
                <MyTextInput
                  label="New Password"
                  returnKeyType="done"
                  value={newPassword.value}
                  onChangeText={(text) => setNewPassword({ value: text, error: '' })}
                  onSubmitEditing={() => handleNewPassword()}
                  error={!!newPassword.error}
                  errorText={newPassword.error}
                  secureTextEntry
                />
                <MyTextInput
                  label="Confirm Password"
                  returnKeyType="done"
                  value={confirmPassword.value}
                  onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
                  onSubmitEditing={() => handleConfirmPassword()}
                  error={!!confirmPassword.error}
                  errorText={confirmPassword.error}
                  secureTextEntry
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleConfirm()}
                >
                  <Text style={styles.textStyle}>Confirm</Text>
                </Pressable>
              </View>
            </Modal>
            
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
    
  );
 }

 const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: 0,
    marginRight: 0,
    paddingLeft: 10,
    color: '#05375a',
  },
  centeredView: {
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    height: '50%',
    width: '100%',
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    padding:20,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#ff6347",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    margin: 20,
  },
  textStyle: {
    fontSize:15,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize:20,
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    width: '80%',
    margin: 20,
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
  }
});