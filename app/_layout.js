import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack >
      <Stack.Screen name="screens/Intro" options={{headerShown: false}} />
      <Stack.Screen name="screens/Login" options={{headerShown: false}} />
      <Stack.Screen name="screens/Signup" options={{headerShown: false}} />
      <Stack.Screen name="screens/DescribeRole" options={{headerShown: false}} />
      <Stack.Screen name="screens/Home" options={{headerShown: false}} />
    </Stack>
  );
};

export default RootLayout;
