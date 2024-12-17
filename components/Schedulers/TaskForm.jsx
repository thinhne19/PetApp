import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Colors from "./../../constants/Colors";
export default function TaskForm({ onSubmit }) {
  const { user } = useUser();

  const [petName, setPetName] = useState("");
  const [petList, setPetList] = useState([]);
  const [address, setAddress] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      if (user) {
        const userEmail = user.primaryEmailAddress.emailAddress;
        const petsQuery = query(
          collection(db, "Pets"),
          where("ownerId", "==", userEmail)
        );
        const snapshot = await getDocs(petsQuery);
        const petsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPetList(petsArray);
        if (petsArray.length > 0) setPetName(petsArray[0].name);
      }
    };
    fetchPets();
  }, [user]);

  const handleSubmit = () => {
    if (!petName || !vaccineName || !address) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
    }

    const task = {
      petName,
      vaccineName,
      address,
      date: new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      ).toISOString(),
    };

    onSubmit(task);
    setAddress("");
    setVaccineName("");
    Alert.alert("Thành công", "Lịch trình đã được thêm!");
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Thêm Lịch Trình</Text>

      <Text style={styles.label}>Chọn thú cưng</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={petName}
          onValueChange={(value) => setPetName(value)}
          style={styles.picker}
        >
          {petList.map((pet) => (
            <Picker.Item key={pet.id} label={pet.name} value={pet.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tên tiêm</Text>
      <TextInput
        placeholder="Vaccine phòng dại"
        value={vaccineName}
        onChangeText={setVaccineName}
        style={styles.input}
      />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        placeholder="Phòng khám XYZ"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Chọn ngày: {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Thêm lịch trình</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 10,
    shadowColor: Colors.WHITE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    marginBottom: 10,
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
    fontFamily: "outfit-medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontFamily: "outfit-medium",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { backgroundColor: "#f9f9f9" },
  dateButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  dateButtonText: {
    color: Colors.WHITE,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: Colors.WHITE, fontWeight: "bold", fontSize: 16 },
});
