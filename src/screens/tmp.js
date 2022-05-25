import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase'
import { getDatabase, ref, onValue, once, get, set, push } from 'firebase/database';

export default function LogScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const {studentID} = route.params;
  const dbr = getDatabase();
  const reference = ref(dbr, 'account/' + studentID);
  let nickname;
  onValue(reference, async (snapshot) => {
    nickname = await snapshot.val().nickname;
    console.log("succesful: " + nickname);
  });

  useLayoutEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
        snapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
        }))
    ));

    return () => {
      unsubscribe();
    };

  }, [navigation]);

  const onSend = useCallback((messages = []) => {
    const { _id, createdAt, text, user,} = messages[0]

    addDoc(collection(db, 'chats'), { _id, createdAt,  text, user });
  }, []);

  return (
      <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={messages => onSend(messages)}
          user={{
              _id: studentID,
              name: nickname,
              avatar: "https://placeimg.com/140/140/any"
          }}
      />
  );
}