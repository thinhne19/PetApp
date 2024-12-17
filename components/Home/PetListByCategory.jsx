import { View, Text, FlatList } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import Category from "./Category";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import PetListItem from "./PetListItem";
import React, { useEffect, useState } from "react";

export default function PetListByCategory() {
  const { user } = useUser();
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  const getPetListByCategory = async (category) => {
    if (!user) {
      console.log("Không tìm thấy người dùng");
      return;
    }

    setLoader(true);
    try {
      const userEmail = user.emailAddresses[0].emailAddress;
      console.log("Email của người dùng hiện tại:", userEmail);
      console.log("Danh mục được chọn:", category);

      const q = query(
        collection(db, "Pets"),
        where("ownerId", "==", userEmail),
        where("category", "==", category)
      );

      const querySnapshot = await getDocs(q);
      console.log("Tổng số thú cưng được tìm thấy:", querySnapshot.size);

      const pets = [];
      querySnapshot.forEach((doc) => {
        const petData = { ...doc.data() };
        console.log("Dữ liệu thú cưng:", petData);
        pets.push(petData);
      });

      setPetList(pets);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thú cưng theo danh mục:", error);
    }
    setLoader(false);
  };

  return (
    <View>
      <Category category={(value) => getPetListByCategory(value)} />
      <FlatList
        data={petList}
        style={{ marginTop: 10 }}
        numColumns={2}
        refreshing={loader}
        onRefresh={() => getPetListByCategory("Dogs")}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: "50%",
              paddingHorizontal: 5,
              paddingVertical: 5,
              alignItems: "flex-start",
            }}
          >
            <PetListItem pet={item} />
          </View>
        )}
        keyExtractor={(item, index) => item.id || index.toString()}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text>Không có thú cưng nào</Text>
          </View>
        )}
      />
    </View>
  );
}
