import { View, Text, StyleSheet, Image, Touchable } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "../../constants/theme";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../config/config";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";

export default function Category({ category }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedcategory, setSelectedCategory] = useState("Dogs");
  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    snapshot.forEach((doc) => {
      console.log(doc.data());
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.title}>Pet's Food</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item.name);
              category(item.name);
            }}
            style={{ flex: 1 }}
          >
            <View
              style={[
                styles.container,
                selectedcategory == item.name && styles.selected,
              ]}
            >
              <Image
                source={{ uri: item?.imageUrl }}
                style={{ width: 40, height: 40 }}
              />
            </View>
            <Text style={{ textAlign: "center" }}>{item?.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fdf7d6",
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 15,
    margin: 15,
  },

  title: {
    fontWeight: theme.fonts.bold,
    fontSize: 20,
  },

  selected: {
    backgroundColor: "#FFCC66",
  },
});
