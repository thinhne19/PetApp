import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";

export default function AboutPet({ pet }) {
  const [readMore, setReadMore] = useState(true);
  return (
    <View
      style={{
        padding: 10,
        // marginHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}
      >
        Thông tin về : {pet?.name}
      </Text>
      <Text
        numberOfLines={readMore ? 3 : 20}
        style={{
          fontFamily: "outfit",
          fontSize: 14,
        }}
      >
        {pet.about}
      </Text>
      {readMore && (
        <Pressable
          onPress={() => {
            setReadMore(false);
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 14,
              color: Colors.SECONDARY,
            }}
          >
            Xem thêm
          </Text>
        </Pressable>
      )}
    </View>
  );
}
