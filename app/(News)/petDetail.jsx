import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PetDetail() {
  const router = useRouter();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const { id } = params; // Lấy ID từ tham số truyền vào

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const petDoc = await getDoc(doc(db, "PetDictionary", id));
        if (petDoc.exists()) {
          setPet(petDoc.data());
        } else {
          console.log("Không tìm thấy thông tin!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={styles.loadingText}>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin chi tiết</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.headerTitle}>{pet.name}</Text>
      </TouchableOpacity>

      {/* Pet Image */}
      <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />

      {/* Pet Description */}
      <View style={styles.section}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petDescription}>{pet.description}</Text>
      </View>

      {/* Pet Details */}
      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>Origin</Text>
        <Text style={styles.detailValue}>{pet.origin}</Text>

        <Text style={styles.detailTitle}>Characteristics</Text>
        <Text style={styles.detailValue}>{pet.characteristics}</Text>

        <Text style={styles.detailTitle}>Scientific Name</Text>
        <Text style={styles.detailValue}>{pet.scientificName}</Text>

        <Text style={styles.detailTitle}>Life Span</Text>
        <Text style={styles.detailValue}>{pet.lifespan}</Text>

        <Text style={styles.detailTitle}>Weight</Text>
        <Text style={styles.detailValue}>{pet.weight}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  petImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  section: {
    padding: 20,
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  petDescription: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  detailSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#FF6F61",
  },
});
