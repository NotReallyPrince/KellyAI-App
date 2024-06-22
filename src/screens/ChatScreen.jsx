import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { Bubble, GiftedChat, Send, Time } from "react-native-gifted-chat";
import { getChatResponse, getImageResponse } from "../services/Api";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatbotContext } from "../context/chatbot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chatbot, setChatbot } = useContext(ChatbotContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState(null);
  const [text, setText] = useState("");


  useEffect(() => {
    loadMessages(); 
  }, []);

  useEffect(() => {
    saveMessages(); // Save messages to local storage whenever messages state changes
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
    if (messages[0].text.startsWith("generate")) {
      getImage(messages[0].text, "AbsoluteReality");
    } else {
      getRespones(chatbot, messages[0].text);
    }
  }, []);

  const getRespones = async (chatbot, msg) => {
    const response = await getChatResponse(chatbot, msg);
    if (response) {
      const chatResponse = {
        _id: Math.random() * (9999999 - 1),
        createdAt: new Date(),
        text: response,
        user: {
          _id: Math.random() * (9999999 - 1),
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
        _id: Math.random() * (9999999 - 1),
        text: "Something went wrong",
        createdAt: new Date(),
        user: {
          _id: Math.random() * (9999999 - 1),
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
    const text = prompt.split('generate ')[1].trim();
    const response = await getImageResponse(text, model);
    if (response) {
      const chatResponse = {
        _id: Math.random() * (9999999 - 1),
        text:
          "Prompt: " + text + "\nModel: " + model + "\n\nCreated By: KellyAI",
        createdAt: new Date(),
        user: {
          _id: Math.random() * (9999999 - 1),
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
        _id: Math.random() * (9999999 - 1),
        text: "Something went Wrong",
        createdAt: new Date(),
        user: {
          _id: Math.random() * (9999999 - 1),
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
        style={{ width: 250, height: 250, borderRadius: 10, margin: 3 }}
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
        right: { color: "#000" }, // Set right text color to black
      }}
      wrapperStyle={{
        left: { backgroundColor: "#f0f0f0" },
        right: { backgroundColor: "lightgreen" },
      }}
    />
  );

  const renderTime = (props) => (
    <Time
      {...props}
      timeTextStyle={{
        right: { color: "#000" }, // Set right time color to black
        left: { color: "#000" },
      }}
    />
  );

  const renderSend = (props) => {
    return (
      <>
        {text.length > 0 && (
          <Send {...props}>
            <View className="mb-2 ml-[10px]">
              <Ionicons name="send" size={32} color="black" />
            </View>
          </Send>
        )}
        {text.length === 0 && (
          <TouchableOpacity onPress={() => clearChat()}>
            <View className="mb-2 ml-[6px]">
              <MaterialIcons name="delete-outline" size={36} color="black" />
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <SafeAreaView>
      <ImageBackground
        source={{ uri: "https://graph.org/file/a87de534200003f6ab039.png" }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      >
        <GiftedChat
          messages={messages}
          isTyping={loading}
          onSend={(messages) => onSend(messages)}
          alwaysShowSend={true}
          renderSend={renderSend}
          imageProps={{ resizeMode: "contain" }}
          infiniteScroll={true}
          renderBubble={renderBubble}
          renderTime={renderTime}
          onInputTextChanged={setText}
          textInputProps={{
            style: {
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#e0e0e0",
              borderRadius: 20,
              paddingHorizontal: 15,
              fontSize: 16,
              minHeight: 45,
              maxHeight: 120,
              width: "83%",
              margin: 3,
            },
          }}
          placeholder="Enter your Prompt"
          user={{
            _id: 1,
          }}
        />
      </ImageBackground>
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
