import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Bubble, Day, GiftedChat, Send } from "react-native-gifted-chat";
import { getChatResponse, getImageResponse } from "../services/Api";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatbotContext } from "../context/chatbot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chatbot, setChatbot } = useContext(ChatbotContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState(null);
  const [text, setText] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    loadMessages();
    if (messages.length === 0) {
      setMessages([
        {
          _id: 1,
          text: "Hello, How can I help you?",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://graph.org/file/ba2e3c1e2b3bc0461d546.png",
          },
        },
      ]);
    }
  }, []);

  useEffect(() => {
    saveMessages(); // Save messages to local storage whenever messages state changes
    if (messages.length === 0) {
      setMessages([
        {
          _id: 1,
          text: "Hello, How can I help you?",
          createdAt: new Date(),
          user: {
            _id: Math.random().toString(),
            name: "React Native",
            avatar: "https://graph.org/file/ba2e3c1e2b3bc0461d546.png",
          },
        },
      ]);
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem("chatMessages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Failed to load chat messages from AsyncStorage:", error);
    }
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat messages to AsyncStorage:", error);
    }
  };

  const clearChat = () => {
    AsyncStorage.removeItem("chatMessages")
      .then(() => {
        setMessages([]);
      })
      .catch((error) => {
        console.error(
          "Failed to clear chat messages from AsyncStorage:",
          error
        );
      });
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    setLoading(true);
    if (messages[0].text.startsWith("imagine")) {
      getImage(messages[0].text, "PhotoPerfect");
    } else {
      getRespones(chatbot, messages[0].text);
    }
  }, []);

  const getRespones = async (chatbot, msg) => {
    const response = await getChatResponse(chatbot, msg);
    if (response) {
      const chatResponse = {
        _id: Math.random().toString(),
        createdAt: new Date(),
        text: response,
        user: {
          _id: Math.random().toString(),
          name: "User",
          avatar: "https://graph.org/file/ba2e3c1e2b3bc0461d546.png",
        },
        sent: true,
      };
      setLoading(false);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatResponse)
      );
    } else {
      const chatResponse = {
        _id: Math.random().toString(),
        text: "Something went wrong",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "User",
          avatar: "https://graph.org/file/ba2e3c1e2b3bc0461d546.png",
        },
      };
      setLoading(false);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatResponse)
      );
    }
  };

  const getImage = async (prompt, model) => {
    const text = prompt.split("imagine ")[1].trim();
    const response = await getImageResponse(text, model);
    if (response) {
      const chatResponse = {
        _id: Math.random().toString(),
        text:
          "Prompt: " + text + "\nModel: " + model + "\n\nCreated By: KellyAI",
        createdAt: new Date(),
        user: {
          _id: Math.random().toString(),
          name: "User",
          avatar: "https://graph.org/file/ba2e3c1e2b3bc0461d546.png",
        },
        image: response,
        sent: true,
      };
      setLoading(false);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatResponse)
      );
    } else {
      const chatResponse = {
        _id: Math.random().toString(),
        text: "Something went Wrong",
        createdAt: new Date(),
        user: {
          _id: Math.random().toString(),
          name: "User",
          avatar: "https://graph.org/file/ba2e3c1e2b3bc0461d546.png",
        },
      };
      setLoading(false);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatResponse)
      );
    }
  };

  const openImageModal = (uri) => {
    setCurrentImageUri(uri);
    setShowImageModal(true);
  };

  const renderMessageImage = (props) => (
    <TouchableOpacity
      onPress={() => openImageModal(props.currentMessage.image)}
    >
      <Image
        source={{ uri: props.currentMessage.image }}
        style={{ width: 250, height: 250, borderRadius: 5, margin: 2 }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      renderMessageImage={renderMessageImage}
      textStyle={{
        left: { color: "#000" },
        right: { color: "#fff" },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: "#f0f0f0",
          paddingHorizontal: 5,
          paddingVertical: 6,
        },
        right: {
          backgroundColor: "blue",
          paddingHorizontal: 5,
          paddingVertical: 6,
        },
      }}
    />
  );

  const renderSend = (props) => {
    return (
      <>
        {text.length > 0 && (
          <Send {...props}>
            <View className="mb-2">
              <View className="bg-gray-400 p-1 rounded-full">
                <AntDesign name="arrowup" size={24} color="white" />
              </View>
            </View>
          </Send>
        )}
        {text.length === 0 && (
          <TouchableOpacity onPress={() => clearChat()}>
            <View className="mb-2">
              <View className="bg-gray-400 p-1 rounded-full">
                <MaterialIcons name="delete-outline" size={24} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <SafeAreaView>
      <View className="w-full h-full">
        <ImageBackground
          source={{ uri: "https://graph.org/file/3c74f24ee42d73cff1bd4.jpg" }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        >
        <View className="flex-row justify-between items-center bg-transparent border-b-2 border-blue-400 blur-sm">
          <View className="h-14  flex-row items-center space-x-2 px-4">
            <Pressable onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
            <Image
              source={{
                uri: "https://graph.org/file/ba2e3c1e2b3bc0461d546.png",
              }}
              className="w-8 h-8 rounded-full bg-gray-400"
            />
            <Text className="text-lg font-bold">KellyAI</Text>
          </View>
          <View className="mr-2">
            <Entypo name="dots-three-vertical" size={24} color="black" />
            </View>
          </View>
          <GiftedChat
            messages={messages}
            isTyping={loading}
            onSend={(messages) => onSend(messages)}
            alwaysShowSend={true}
            renderSend={renderSend}
            imageProps={{ resizeMode: "contain" }}
            infiniteScroll={true}
            color={"black"}
            renderDay={(props) => (
              <Day {...props} textStyle={{ color: "#181818" }} />
            )}
            renderBubble={renderBubble}
            renderTime={() => null}
            onInputTextChanged={setText}
            dateFormat="MMMM DD YYYY, h:mm:ss a"
            textInputProps={{
              style: {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#e0e0e0",
                borderRadius: 20,
                paddingHorizontal: 15,
                fontSize: 16,
                minHeight: 45,
                maxHeight: 120,
                width: "88%",
                margin: 3,
              },
            }}
            placeholder="Enter your Prompt"
            user={{ _id: 1 }}
          />
        </ImageBackground>
      </View>
      <Modal
        visible={showImageModal}
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => setShowImageModal(false)}
          >
            <Image
              source={{ uri: currentImageUri }}
              style={{ width: "90%", height: "90%", resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
