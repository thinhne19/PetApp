import { View, Text } from "react-native";
import React from "react";
import Category from "./Category";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/config";
export default function PetListByCategory() {
  const GetPetList = async (category) => {
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };
  return (
    <View>
      <Category category={(value) => GetPetList(value)} />
    </View>
  );
}
