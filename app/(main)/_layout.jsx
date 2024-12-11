import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Colors from "./../../constants/Colors";
export default function MainLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.PRIMARY }}>
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
          title: "Pet",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="pets" size={24} color={color} />
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
        name="statistics"
        options={{
          title: "Statistics",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="newspaper-variant"
              size={24}
              color={color}
            />
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
  );
}
