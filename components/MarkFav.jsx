import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Shared from "./../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
export default function MarkFav({ pet }) {
  const { user } = useUser();
  const [favList, setFavList] = useState();
  useEffect(() => {
    user && GetFav();
  }, [user]);
  const GetFav = async () => {
    const result = await Shared.GetFavList(user);
    console.log(result);
    setFavList(result?.favorites ? result?.favorites : []);
  };
  const AddToFav = async () => {
    const favResult = favList;
    favResult.push(pet?.id);
    console.log("Adding pet with ID to favorites:", pet.id);
    await Shared.UpdateFav(user, favResult);
    GetFav();
  };
  const removeFromFav = async () => {
    try {
      const favResult = favList.filter((item) => item !== pet.id);
      console.log("Removing from favorites:", pet.id);
      await Shared.UpdateFav(user, favResult);
      await GetFav(); // Refresh the list
    } catch (error) {
      console.error("Error in removeFromFav:", error);
    }
  };
  return (
    <View>
      {favList?.includes(pet?.id) ? (
        <Pressable onPress={() => removeFromFav()}>
          <Ionicons name="heart" size={30} color="red" />
        </Pressable>
      ) : (
        <Pressable onPress={() => AddToFav()}>
          <Ionicons name="heart-outline" size={30} color="black" />
        </Pressable>
      )}
    </View>
  );
}
