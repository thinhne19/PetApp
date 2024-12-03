import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import PetListItem from "./PetListItem";
export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    GetPetList("Dogs");
  }, []);

  const GetPetList = async (category) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      setPetList((petList) => [...petList, doc.data()]);
    });
    setLoader(false);
  };
  return (
    <View>
      <Category category={(value) => GetPetList(value)} />
      <FlatList
        data={petList}
        style={{ marginTop: 10 }}
        numColumns={2}
        refreshing={loader}
        onRefresh={() => GetPetList("Dogs")}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: "50%",
              paddingHorizontal: 5,
              paddingVertical: 5,
              alignItems: "flex-start", // Căn trái
            }}
          >
            <PetListItem pet={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
