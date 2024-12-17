import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Favorites = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Thú Cưng Yêu Thích Của Bạn</Text>
        <Text style={styles.subHeaderText}>
          Khám phá thú cưng yêu thích của bạn tại đây!
        </Text>
      </View>
      <View style={{ padding: 20, marginTop: 20 }}>
        {/* Nút "Thêm thú cưng" */}
        <Link href={"/add-new-pet"} style={styles.addNewPetContainer}>
          <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
          <Text
            style={{
              fontFamily: "outfit-medium",
              color: Colors.PRIMARY,
              fontSize: 18,
            }}
          >
            Thêm Thú Cưng Mới
          </Text>
        </Link>

        {/* Danh sách thú cưng theo danh mục */}
        <PetListByCategory />

        {/* Nút "Xem Yêu Thích" */}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.favoritesBtn}>
          <Link href={"/fav-pet-list"} style={styles.favoritesText}>
            Xem Yêu Thích
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.WHITE,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 16,
    color: Colors.WHITE,
    textAlign: "center",
    marginTop: 5,
  },
  addPetContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  addPetButton: {
    backgroundColor: Colors.SECONDARY, // Màu khác biệt để nổi bật nút
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  addPetText: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: Colors.WHITE,
    textAlign: "center",
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 20,
    alignItems: "center",
  },
  favoritesBtn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 50,
    elevation: 5,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  favoritesText: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: Colors.WHITE,
    textAlign: "center",
  },
  addNewPetContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 20,
    marginTop: 20,
    textAlign: "center",
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: "dashed",
    justifyContent: "center",
  },
});

export default Favorites;
