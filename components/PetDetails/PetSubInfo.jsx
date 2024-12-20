import React, { useEffect, useState } from "react";
import { View } from "react-native";
import PetSubInfoCard from "./PetSubInfoCard";

export default function PetSubInfo({ pet }) {
  const [latestWeight, setLatestWeight] = useState("N/A");

  useEffect(() => {
    let parsedHealthRecords = pet?.healthRecords;

    // Kiểm tra nếu healthRecords là một chuỗi, thì parse nó thành object
    if (typeof parsedHealthRecords === "string") {
      try {
        parsedHealthRecords = JSON.parse(parsedHealthRecords);
      } catch (error) {
        console.error("Lỗi khi parse healthRecords:", error);
        parsedHealthRecords = null; // Gán giá trị mặc định nếu parse lỗi
      }
    }

    // Kiểm tra và lấy cân nặng mới nhất
    if (
      parsedHealthRecords?.weightRecords &&
      Array.isArray(parsedHealthRecords.weightRecords) &&
      parsedHealthRecords.weightRecords.length > 0
    ) {
      const weightRecords = parsedHealthRecords.weightRecords;
      const latestRecord = weightRecords[weightRecords.length - 1];
      setLatestWeight(latestRecord.weight);
    } else {
      setLatestWeight("N/A");
    }
  }, [pet?.healthRecords]);

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <PetSubInfoCard
          icon={require("./../../assets/images/calendar.png")}
          title={"Tuổi"}
          value={`${pet?.age || "N/A"} Years`}
        />
        <PetSubInfoCard
          icon={require("./../../assets/images/bone.png")}
          title={"Loài"}
          value={pet?.breed || "N/A"}
        />
      </View>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <PetSubInfoCard
          icon={require("./../../assets/images/sex.png")}
          title={"Giới tính"}
          value={pet?.sex || "N/A"}
        />
        <PetSubInfoCard
          icon={require("./../../assets/images/weight.png")}
          title={"Cân nặng"}
          value={`${latestWeight} Kg`}
        />
      </View>
    </View>
  );
}
