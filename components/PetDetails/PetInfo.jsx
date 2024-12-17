import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MarkFav from "../MarkFav";
const { width } = Dimensions.get("window");

export default function PetInfo({ pet }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternDot,
              {
                left: Math.random() * width,
                top: Math.random() * 200,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pet.imagePath }}
          style={styles.petImage}
          resizeMode="cover"
        />
      </View>

      <View
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 27,
            }}
          >
            {pet?.name}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: Colors.GRAY,
            }}
          >
            Tuổi : {pet?.age} năm tuổi
          </Text>
        </View>
        <MarkFav pet={pet} />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundPattern: {
    position: "absolute",
    width: width,
    height: 300,
    overflow: "hidden",
  },
  patternDot: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    opacity: 0.3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  petImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 30,
  },
});
