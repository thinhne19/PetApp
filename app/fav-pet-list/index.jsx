import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Shared from "./../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { db } from "./../../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import PetListItem from "../../components/Home/PetListItem";

export default function FavoritesList() {
  const router = useRouter();
  const { user } = useUser();
  const [loader, setLoader] = useState(false);
  const [petList, setPetList] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFavoritePets();
    }
  }, [user]);

  const fetchFavoritePets = async () => {
    try {
      setLoader(true);
      const favResult = await Shared.GetFavList(user);
      const favoriteIds = favResult?.favorites || [];

      if (favoriteIds.length === 0) {
        setPetList([]);
        setLoader(false);
        return;
      }

      const petsRef = collection(db, "Pets");
      const q = query(petsRef, where("id", "in", favoriteIds));
      const querySnapshot = await getDocs(q);

      const favoritePets = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        documentId: doc.id,
      }));

      setPetList(favoritePets);
      setLoader(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách pets yêu thích:", error);
      setLoader(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.petItemContainer}>
      <PetListItem pet={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={Colors.LIGHT_PRIMARY}
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.PRIMARY}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thú Cưng Yêu Thích</Text>
        </View>

        <FlatList
          data={petList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>
                Bạn chưa có thú cưng yêu thích
              </Text>
              <Text style={styles.emptyListSubtext}>
                Khám phá và thêm thú cưng ngay nhé!
              </Text>
            </View>
          )}
          refreshing={loader}
          onRefresh={fetchFavoritePets}
          // Thêm hiệu ứng bounces khi cuộn
          bounces={true}
          // Loại bỏ thanh cuộn mặc định
          overScrollMode="never"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
  petItemContainer: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 20,
  },
  emptyListText: {
    color: Colors.GRAY,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyListSubtext: {
    color: Colors.GRAY,
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
