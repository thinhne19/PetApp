import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/config";
import FoodListItem from "./FoodListItem";
import Category from "./Category";

export default function FoodByCategory() {
  const [foodList, setFoodList] = useState([]);

  const getFoodListByCategory = async (category) => {
    const q = query(collection(db, "Foods"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const foods = [];

    querySnapshot.forEach((doc) => {
      foods.push(doc.data());
    });

    setFoodList(foods);
  };

  useEffect(() => {
    // Mặc định hiển thị danh sách thức ăn cho category "Dogs" khi component được tải
    getFoodListByCategory("Dogs");
  }, []);

  return (
    <View>
      <Category category={(value) => getFoodListByCategory(value)} />
      <FlatList
        data={foodList}
        style={{ marginTop: 10 }}
        horizontal={true}
        renderItem={({ item }) => <FoodListItem food={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
