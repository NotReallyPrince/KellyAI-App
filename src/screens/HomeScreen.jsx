import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ChatbotContext } from "../context/chatbot";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { chatbot, setChatbot } = useContext(ChatbotContext);

  return (
    <View className="flex-1 items-center mt-20">
      <Text className="text-4xl font-bold text-blue-500">Hello</Text>
      <View className="flex-row space-x-2">
        <Text className="text-2xl font-normal">Welcome to</Text>
        <Text className="text-2xl font-bold text-blue-600">KellyAI</Text>
      </View>
      <Image
        source={{ uri: "https://graph.org/file/ba2e3c1e2b3bc0461d546.png" }}
        className="w-72 h-72 mt-10 rounded-full"
      ></Image>
      <Text className="text-2xl font-semibold mt-9 text-gray-600">
        How can i help you ?
      </Text>
      <TouchableOpacity
        className="flex-row space-x-2 bg-blue-500 py-2 px-10 mt-7 rounded-lg"
        onPress={() => navigation.navigate("chat")}
      >
        <Text className="text-2xl font-bold text-white">Let's Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
