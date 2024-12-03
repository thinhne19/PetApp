import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

export default function PetDetails() {
  const router = useRouter();
  const pet = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
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
        <Text style={styles.headerTitle}>Thú Cưng Của Tôi ❤️</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pet info */}
        <PetInfo pet={pet} />
        {/* Pet sub info */}
        <PetSubInfo pet={pet} />
        {/* About */}
        <AboutPet pet={pet} />
        <View style={{ height: 70 }}></View>
      </ScrollView>

      {/* Edit pet */}
      <View style={styles.bottomContainer}>
        <Link href={"/pet-update"} style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginLeft: 15,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  editBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    textAlign: "center",
  },
  editText: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    color: Colors.WHITE,
  },
});
