import { View } from "react-native";
import React from "react";
import PetSubInfoCard from "./PetSubInfoCard";

export default function PetSubInfo({ pet }) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <PetSubInfoCard
          icon={require("./../../assets/images/calendar.png")}
          title={"Tuổi"}
          value={pet?.age + " Years"}
        />
        <PetSubInfoCard
          icon={require("./../../assets/images/bone.png")}
          title={"Loài"}
          value={pet?.breed}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <PetSubInfoCard
          icon={require("./../../assets/images/sex.png")}
          title={"Giới tính"}
          value={pet?.sex}
        />
        <PetSubInfoCard
          icon={require("./../../assets/images/weight.png")}
          title={"Cân nặng"}
          value={pet?.Weight + " Kg"}
        />
      </View>
    </View>
  );
}
