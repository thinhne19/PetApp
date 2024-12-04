import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { db } from "./../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import PetDetail from "./PetDetailsList";

export default function PetIdList() {
  const { user } = useUser();
  const [petIds, setPetIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      getPetIdsByEmail(user.primaryEmailAddress?.emailAddress);
    }
  }, [user]);

  const getPetIdsByEmail = async (userEmail) => {
    try {
      setLoading(true);
      setError(null);
      const docSnap = await getDoc(doc(db, "UserPets", userEmail));

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setPetIds(userData.petId || []);
      } else {
        setPetIds([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách pet ID:", error);
      setError("Có lỗi xảy ra khi lấy danh sách pet");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Vui lòng đăng nhập</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (petIds.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Không có pet nào</Text>
      </View>
    );
  }

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Danh sách ID pet:</Text>
    //   {petIds.map((id, index) => (
    //     <Text key={index} style={styles.petId}>
    //       {id}
    //     </Text>
    //   ))}
    // </View>
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin thú cưng:</Text>
      {petIds.map((id) => (
        <PetDetail key={id} petId={id} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  petId: {
    fontSize: 16,
    marginVertical: 4,
  },
  errorText: {
    color: "red",
  },
});
