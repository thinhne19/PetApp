import { Stack, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MainLayout() {
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name="home" 
        options={{
          title: 'Home',
          tabBarIcon:({color}) => <Ionicons name="home-outline" size={24} color="black" />
        }}
      />
      <Tabs.Screen name="Favorites"
        options={{
          title: 'Favorites',
          tabBarIcon:({color}) => <Ionicons name="heart-outline" size={24} color="black" />
        }}
      />
      <Tabs.Screen name="newPost" 
        options={{
          title: 'Post',
          tabBarIcon:({color}) => <Ionicons name="add-circle-outline" size={24} color="black" />}}
      />
      <Tabs.Screen name="notification"
        options={{
          title: 'List',
          tabBarIcon:({color}) => <Ionicons name="calendar-outline" size={24} color="black" /> }}
      />
      <Tabs.Screen name="profile" 
        options={{
          title: 'Home',
          tabBarIcon:({color}) => <Ionicons name="person-outline" size={24} color="black" />}}
      />
    </Tabs>
  );
}