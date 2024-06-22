import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import HomeNavigation from "./src/navigation/Home";
import { ChatbotProvider } from "./src/context/chatbot";

export default function App() {
  return (
    <ChatbotProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <HomeNavigation />
        </SafeAreaProvider>
      </NavigationContainer>
    </ChatbotProvider>
  );
}
