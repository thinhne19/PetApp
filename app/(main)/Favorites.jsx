import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

const Favorites = () => {
  return (
    <View style={styles.container}>
      {/* Danh sách thú cưng theo danh mục */}
      <PetListByCategory />

      {/* Nút "Favorites Pet" */}
      <View style={styles.bottomContainer}>
        <View style={styles.editBtn}>
          <Link href={"/fav-pet-list"} style={styles.editText}>
            Favorites
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR, // Đổi màu nền cho màn hình
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    alignItems: "center",
  },
  editBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
  },
  editText: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    color: Colors.WHITE,
    textAlign: "center",
  },
});

export default Favorites;
