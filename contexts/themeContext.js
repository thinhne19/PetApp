import { View, Text } from "react-native";
import React, { createContext } from "react";
import { theme } from "../constants/theme";

const themeContext = createContext({
  dark: {
    background: "#121212",
    color: '"#E8B20E"',
  },
  light: {
    background: "#FFF",
    color: "#000",
  },
});

export default themeContext;
