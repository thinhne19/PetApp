import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "./../../constants/Colors";
import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { theme } from "../../constants/theme";
import themeContext from "../../contexts/themeContext";
export default function MainLayout() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
      setDarkMode(data);
    });

    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []);


  const navigationTheme = {
    dark: darkMode,
    colors: {
      primary: Colors.PRIMARY,
      background: darkMode ? theme.dark.background : theme.light.background,
      card: darkMode ? theme.dark.background : theme.light.background,
      text: darkMode ? '#E8B20E' : theme.light.color,
      border: darkMode ? theme.dark.background : theme.light.background,
      notification: Colors.SECONDARY
    }
  };

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <ThemeProvider value={navigationTheme}>
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.PRIMARY }} >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="newPost"
        options={{
          title: "Post",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "List",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
    </ThemeProvider>
    </themeContext.Provider>
  );
}
