import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import Slider from "../../components/Home/Slider";
import Header from "../../components/Home/Header";
import FoodByCategory from "../../components/Home/FoodByCategory";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../../constants/Colors";
const Home = () => {
  const router = useRouter();
  const { user } = useUser();

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      {/*Header*/}
      <Header />
      {/*Slider*/}
      <Slider />
      {/*Pet's Food*/}
      <FoodByCategory />
      {/*List Food*/}

      {/* new pet */}
      <Link href={"/add-new-pet"} style={styles.addNewPetContainer}>
        <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
        <Text
          style={{
            fontFamily: "outfit-medium",
            color: Colors.PRIMARY,
            fontSize: 18,
          }}
        >
          Add New Pet
        </Text>
      </Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
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
