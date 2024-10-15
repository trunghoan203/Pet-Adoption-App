import { Pressable, Text, View } from "react-native";
import { Link, Redirect, useRootNavigationState, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";


export default function Index() {

  const { user } = useUser();

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    CheckNavLoaded();
  }, [])

  const CheckNavLoaded = () => {
    if (!rootNavigationState.key)
      return null;
  }

  return user && (
    <View
      style={{
        flex: 1,

      }}
    >
      {user ?
        <Redirect href={'/(tabs)/home'} /> :
        <Redirect href={'/login/index'} />}

    </View>
  );
}
