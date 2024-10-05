import { View, Text } from "react-native";
import React from "react";
import LoginScreen from "./pages/Login";

const RootLayout = () => {
  return (
    <View>
      <Text>
        <LoginScreen />
      </Text>
    </View>
  );
};

export default RootLayout;
