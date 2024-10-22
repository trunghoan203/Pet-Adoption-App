import { View, Text } from "react-native";
import { Redirect, useRootNavigationState, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function Index() {
  const { isLoaded, error } = useUser(); // Không cần user ở đây
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoaded && rootNavigationState.key) { // Kiểm tra cả isLoaded và rootNavigationState.key
      router.replace("/(tabs)/home"); // Chuyển thẳng đến home
    }
  }, [isLoaded, rootNavigationState.key]); // Chạy lại effect khi isLoaded hoặc rootNavigationState.key thay đổi

  // Hiển thị loading trong khi chờ Clerk xác thực và navigation state sẵn sàng
  if (!isLoaded || !rootNavigationState.key) {
    return <View><Text>Loading...</Text></View>;
  }

  // Xử lý lỗi nếu có
  if (error) {
    console.error(error);
    return <View><Text>Authentication error: {error.message}</Text></View>;
  }

  // Không cần return JSX ở đây vì đã xử lý chuyển hướng trong useEffect
  return null;
}