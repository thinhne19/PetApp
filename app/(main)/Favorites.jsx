import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PetListByCategory from "../../components/Home/PetListByCategory";

const favorites = () => {
  return (
    <View>
      {/* petlist + category */}
      <PetListByCategory />
    </View>
  );
};

export default favorites;

const styles = StyleSheet.create({});
