import React, { useContext, useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, Dimensions } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../../contexts/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const Theme = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useContext(themeContext);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("AppTheme");
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async (value) => {
    try {
      await AsyncStorage.setItem("AppTheme", value ? "dark" : "light");
      setDarkMode(value);
      EventRegister.emit("ChangeTheme", value);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkMode
            ? theme.dark.background
            : theme.light.background,
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Ionicons
            name={darkMode ? "moon" : "sunny"}
            size={50}
            color={darkMode ? "#E8B20E" : "#87CEFA"}
          />
          <Text
            style={[
              styles.headerText,
              { color: darkMode ? "#E8B20E" : theme.light.color },
            ]}
          >
            Thay đổi chế độ
          </Text>
        </View>

        <View style={styles.switchContainer}>
          <Text
            style={[
              styles.modeText,
              { color: darkMode ? "#E8B20E" : theme.light.color },
            ]}
          >
            {darkMode ? "Chế độ tối" : "Chế độ sáng"}
          </Text>
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            thumbColor={darkMode ? "#E8B20E" : "#87CEFA"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
        </View>

        <Text
          style={[
            styles.description,
            { color: darkMode ? "#E8B20E" : theme.light.color },
          ]}
        >
          {darkMode
            ? "Tận hưởng chủ đề tối nhẹ nhàng 🌙"
            : "Chủ đề ánh sáng tươi sáng và sạch sẽ ☀️"}
        </Text>
      </View>
    </View>
  );
};

export default Theme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 15,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  modeText: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
});
