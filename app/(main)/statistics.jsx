import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { LineChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";

export default function PetHealthStatistics() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);

  // Hàm tải dữ liệu thú cưng
  const fetchPetHealthRecords = async () => {
    try {
      setLoading(true);

      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("User email not found.");
        setLoading(false);
        return;
      }

      const petsRef = collection(db, "Pets");
      const q = query(petsRef, where("ownerId", "==", email));
      const querySnapshot = await getDocs(q);

      const petList = [];
      querySnapshot.forEach((doc) => {
        const pet = doc.data();
        const weightRecords = pet.healthRecords?.weightRecords || [];
        const vaccineRecords = pet.healthRecords?.vaccineRecords || [];
        const dewormRecords = pet.healthRecords?.dewormRecords || [];

        // Sắp xếp dữ liệu cân nặng theo ngày
        const sortedWeightRecords = weightRecords.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        petList.push({
          id: pet.id,
          name: pet.name || "Unnamed",
          weightRecords: sortedWeightRecords,
          vaccineRecords,
          dewormRecords,
        });
      });

      setPets(petList);
    } catch (error) {
      console.error("Error fetching health records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại dữ liệu mỗi khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      fetchPetHealthRecords();
    }, [user])
  );

  const renderPetHealthDetails = ({ item }) => {
    const { weightRecords, vaccineRecords, dewormRecords } = item;

    const dates = weightRecords.map((record) => record.date);
    const weights = weightRecords.map((record) => record.weight);

    return (
      <View style={styles.petCard}>
        {/* Tên thú cưng */}
        <Text style={styles.petName}>{item.name}</Text>

        {/* Biểu đồ cân nặng */}
        {weightRecords.length > 0 ? (
          <LineChart
            data={{
              labels: dates.map((date) =>
                new Date(date).toLocaleDateString("vi-VN")
              ),
              datasets: [{ data: weights }],
            }}
            width={300} // Chiều rộng biểu đồ
            height={220} // Chiều cao biểu đồ
            yAxisSuffix="kg"
            chartConfig={{
              backgroundGradientFrom: "#f5f7fa",
              backgroundGradientTo: "#f5f7fa",
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2, // Độ dày đường
              propsForDots: {
                r: "5",
                strokeWidth: "1",
                stroke: "#388e3c",
              },
            }}
            bezier
            style={{
              marginVertical: 10,
              borderRadius: 10,
            }}
          />
        ) : (
          <Text style={styles.noDataText}>No weight data available</Text>
        )}

        {/* Tiêm phòng */}
        <View style={styles.recordSection}>
          <Text style={styles.recordTitle}>📌 Vaccination:</Text>
          {vaccineRecords.length > 0 ? (
            vaccineRecords.map((record, index) => (
              <Text key={`vaccine-${index}`} style={styles.recordItem}>
                • {record.date}: {record.vaccineName}
              </Text>
            ))
          ) : (
            <Text style={styles.noDataText}>No vaccination data available</Text>
          )}
        </View>

        {/* Xổ giun */}
        <View style={styles.recordSection}>
          <Text style={styles.recordTitle}>🐾 Deworming:</Text>
          {dewormRecords.length > 0 ? (
            dewormRecords.map((record, index) => (
              <Text key={`deworm-${index}`} style={styles.recordItem}>
                • {record.date}: {record.medicineName}
              </Text>
            ))
          ) : (
            <Text style={styles.noDataText}>No deworming data available</Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Pet Statistics</Text>
        <Text style={styles.subHeaderText}>
          Track your pets' health and records!
        </Text>
      </View>

      {/* Danh sách thông tin thú cưng */}
      <FlatList
        data={pets}
        renderItem={renderPetHealthDetails}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        nestedScrollEnabled={true} // Kích hoạt cuộn lồng nhau
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            No pets with health records found.
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.WHITE,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 16,
    color: Colors.WHITE,
    textAlign: "center",
    marginTop: 5,
  },
  refreshButton: {
    margin: 20,
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    alignItems: "center",
  },
  refreshButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 20,
  },
  petCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: Colors.PRIMARY,
  },
  petName: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 15,
  },
  recordSection: {
    marginBottom: 10,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.GRAY,
    marginBottom: 5,
  },
  recordItem: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    marginBottom: 3,
  },
  noDataText: {
    fontSize: 16,
    color: "#b0b0b0",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
  emptyListText: {
    textAlign: "center",
    color: Colors.GRAY,
    fontSize: 16,
    marginTop: 20,
  },
});
