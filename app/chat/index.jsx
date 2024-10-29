import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { GiftedChat } from 'react-native-gifted-chat'
import moment from 'moment';
import { getAuth } from "firebase/auth";

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;
    const [messages, setMessages] = useState([])

    useEffect(() => {
        GetUserDetails();
        const unsubcribe = onSnapshot(collection(db, 'Chat', params?.id, 'Messages'), (snapshot) => {
            const messageData = snapshot.docs.map((doc) => ({
                _id: doc.id,
                ...doc.data()
            }))
            setMessages(messageData)
        });
        return () => unsubcribe();
    }, [])

    const GetUserDetails = async () => {
        const docRef = doc(db, 'Chat', params?.id);
        const docSnap = await getDoc(docRef);

        const result = docSnap.data();
        console.log(result);
        const otherUser = result?.user.filer(item => item.email != user?.primaryEmailAddress?.emailAddress);
        console.log(otherUser);
        navigation.setOptions({
            headerTitle: otherUser[0].name
        })
    }

    const onSend = async (newMessage) => {
        setMessages((previousMessage) =>
            GiftedChat.append(previousMessage, newMessage));
        newMessage[0].createAt = moment().format('MM-DD-YYYY HH:mm:ss')
        await addDoc(collection(db, 'Chat', params.id, 'Messages'), newMessage[0])

    }
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            showUserAvatar={true}
            user={{
                _id: user?.primaryEmailAddress?.emailAddress,
                name: user?.fullName,
                avatar: user?.imageUrl
            }}
        />
    )
}
