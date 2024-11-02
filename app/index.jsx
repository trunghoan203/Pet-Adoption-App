import { View, Text } from "react-native";
import Welcome from "../components/Welcome/Welcome";
import { auth } from '../config/FirebaseConfig'
import { Redirect } from "expo-router";

export default function Index() {

  const user = auth.currentUser;

  return (
    <View style={{
      flex: 1,
    }}>
      {user ? <Redirect href={'/home'} /> :
        <Welcome />
      }
    </View>
  );
}
