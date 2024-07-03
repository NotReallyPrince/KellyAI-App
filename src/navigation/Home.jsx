import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();
const Home = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ headerShown: false, statusBarColor: 'black' }}
      />
      <Stack.Screen
        name="chat"
        component={ChatScreen}
        options={{ animation: "ios", statusBarColor: 'black', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Home;
