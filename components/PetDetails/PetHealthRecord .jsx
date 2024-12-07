import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  collection,
  where,
  query,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./../../config/firebaseConfig";
import Colors from "./../../constants/Colors";

const PetHealthRecord = ({ petId }) => {
  const [weightRecords, setWeightRecords] = useState([]);
  const [vaccineRecords, setVaccineRecords] = useState([]);
  const [dewormRecords, setDewormRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recordType, setRecordType] = useState("");

  // Form states
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [vaccineName, setVaccineName] = useState("");

  const [date, setDate] = useState(new Date());
  const [nextDueDate, setNextDueDate] = useState(new Date());
  // DatePicker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDueDatePicker, setShowNextDueDatePicker] = useState(false);
  const [dateType, setDateType] = useState("date"); // "date" or "nextDueDate"
  const ensureDate = (dateValue) => {
    return dateValue instanceof Date ? dateValue : new Date(dateValue);
  };
  // Fetch records
  useEffect(() => {
    fetchHealthRecords();
  }, [petId]);
  const fetchHealthRecords = async () => {
    try {
      const q = query(collection(db, "Pets"), where("id", "==", petId));

      const querySnapshot = await getDocs(q);
      // Kiểm tra xem querySnapshot có dữ liệu không
      if (!querySnapshot.empty) {
        const petDoc = querySnapshot.docs[0]; // Lấy document đầu tiên
        const petData = petDoc.data();
        setWeightRecords(petData.healthRecords.weightRecords || []);
        setVaccineRecords(petData.healthRecords.vaccineRecords || []);
        setDewormRecords(petData.healthRecords.dewormRecords || []);
      }
    } catch (error) {
      console.error("Error fetching health records:", error);
      Alert.alert("Error", "Failed to load health records");
    }
  };
  const addRecord = async () => {
    try {
      const q = query(collection(db, "Pets"), where("id", "==", petId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const petDocRef = querySnapshot.docs[0].ref;

        // Tạo đối tượng chung cho tất cả các bản ghi
        const commonRecordData = {
          date: formatDate(date), // Sử dụng ngày đã chọn
          notes: notes, // Ghi chú (nếu có)
        };

        let updateData = {};
        switch (recordType) {
          case "weight":
            updateData = {
              "healthRecords.weightRecords": arrayUnion({
                ...commonRecordData,
                weight: parseFloat(weight),
              }),
            };
            break;
          case "vaccine":
            updateData = {
              "healthRecords.vaccineRecords": arrayUnion({
                ...commonRecordData,
                vaccineName,
                nextDueDate: formatDate(nextDueDate),
              }),
            };
            break;
          case "deworm":
            updateData = {
              "healthRecords.dewormRecords": arrayUnion({
                ...commonRecordData,
                medicineName: notes,
                nextDueDate: formatDate(nextDueDate),
              }),
            };
            break;
        }

        await updateDoc(petDocRef, updateData);

        Alert.alert("Thành công", "Đã thêm bản ghi mới");
        setModalVisible(false);
        clearForm();
        fetchHealthRecords();
      }
    } catch (error) {
      console.error("Error adding record:", error);
      Alert.alert("Lỗi", "Không thể thêm bản ghi");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = ensureDate(selectedDate);
    // Reset trạng thái picker
    setShowDatePicker(false);
    setShowNextDueDatePicker(false);

    if (currentDate) {
      if (dateType === "date") {
        setDate(currentDate);
      } else {
        setNextDueDate(currentDate);
      }
    }
  };
  const clearForm = () => {
    setWeight("");
    setDate(new Date());
    setNextDueDate(new Date());
    setNotes("");
    setVaccineName("");
  };
  const deleteRecord = async (record, type) => {
    try {
      const q = query(collection(db, "Pets"), where("id", "==", petId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const petDocRef = querySnapshot.docs[0].ref;

        let updateData = {};
        switch (type) {
          case "weight":
            updateData = {
              "healthRecords.weightRecords": arrayRemove(record),
            };
            break;
          case "vaccine":
            updateData = {
              "healthRecords.vaccineRecords": arrayRemove(record),
            };
            break;
          case "deworm":
            updateData = {
              "healthRecords.dewormRecords": arrayRemove(record),
            };
            break;
        }

        await updateDoc(petDocRef, updateData);

        Alert.alert("Thành công", "Xóa bản ghi thành công");
        fetchHealthRecords();
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      Alert.alert("Lỗi", "Không thể xóa bản ghi");
    }
  };
  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("vi-VN");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hồ Sơ Sức Khỏe</Text>
      <ScrollView style={styles.recordsContainer}>
        {/* Weight Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cân nặng</Text>
          {weightRecords.map((record, index) => (
            <View
              key={record.date + "-weight-" + index}
              style={styles.recordItem}
            >
              <View>
                <Text>Cân nặng: {record.weight}kg</Text>
                <Text>Ngày: {record.date}</Text>
                {record.notes && <Text>Ghi chú: {record.notes}</Text>}
              </View>
              <TouchableOpacity
                onPress={() => deleteRecord(record, "weight")}
                style={styles.deleteButton}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={Colors.RED}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Vaccine Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiêm phòng</Text>
          {vaccineRecords.map((record, index) => (
            <View
              key={record.date + "-vaccine-" + index}
              style={styles.recordItem}
            >
              <View>
                <Text>Vaccine: {record.vaccineName}</Text>
                <Text>Ngày tiêm: {record.date}</Text>
                <Text>Ngày tiêm tiếp theo: {record.nextDueDate}</Text>
                {record.notes && <Text>Ghi chú: {record.notes}</Text>}
              </View>
              <TouchableOpacity
                onPress={() => deleteRecord(record, "vaccine")}
                style={styles.deleteButton}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={Colors.RED}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Deworming Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Xổ giun</Text>
          {dewormRecords.map((record, index) => (
            <View
              key={record.date + "-deworm-" + index}
              style={styles.recordItem}
            >
              <View>
                <Text>Ngày xổ giun: {record.date}</Text>
                <Text>Ngày xổ giun tiếp theo: {record.nextDueDate}</Text>
                {record.notes && <Text>Thuốc: {record.notes}</Text>}
              </View>
              <TouchableOpacity
                onPress={() => deleteRecord(record, "deworm")}
                style={styles.deleteButton}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={Colors.RED}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Record Button */}
      <View style={styles.addButtonsContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setRecordType("weight");
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>+ Cân nặng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setRecordType("vaccine");
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>+ Tiêm phòng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setRecordType("deworm");
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>+ Xổ giun</Text>
        </TouchableOpacity>
      </View>

      {/* Add Record Modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>
              {recordType === "weight"
                ? "Thêm Bản Ghi Cân Nặng"
                : recordType === "vaccine"
                ? "Thêm Bản Ghi Tiêm Phòng"
                : "Thêm Bản Ghi Xổ Giun"}
            </Text>

            <View style={styles.modalContent}>
              {recordType === "weight" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Cân Nặng</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Nhập cân nặng (kg)"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>
              )}

              {recordType === "vaccine" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tên Vaccine</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Nhập tên vaccine"
                    value={vaccineName}
                    onChangeText={setVaccineName}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ngày</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => {
                    setDateType("date");
                    setShowDatePicker(true);
                  }}
                >
                  <MaterialCommunityIcons
                    name="calendar"
                    size={24}
                    color={Colors.PRIMARY}
                  />
                  <Text style={styles.datePickerText}>{formatDate(date)}</Text>
                </TouchableOpacity>
              </View>

              {(recordType === "vaccine" || recordType === "deworm") && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ngày Tiếp Theo</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => {
                      setDateType("nextDueDate");
                      setShowNextDueDatePicker(true);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="calendar"
                      size={24}
                      color={Colors.PRIMARY}
                    />
                    <Text style={styles.datePickerText}>
                      {formatDate(nextDueDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ghi Chú</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Nhập ghi chú (tùy chọn)"
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    clearForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={addRecord}>
                  <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* DatePicker for normal date */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}

        {/* DatePicker for next due date */}
        {showNextDueDatePicker && (
          <DateTimePicker
            value={nextDueDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    marginBottom: 15,
    color: Colors.PRIMARY,
  },
  recordsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    marginBottom: 10,
    color: Colors.BLACK,
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButton: {
    padding: 5,
  },
  addButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  addButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "outfit-bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent black overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: Colors.LIGHT_PRIMARY, // Fully white container
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    zIndex: 1,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
    textAlign: "center",
    paddingVertical: 15,
    fontSize: 18,
    fontFamily: "outfit-bold",
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: "outfit-medium",
    marginBottom: 5,
    color: Colors.BLACK,
  },
  inputField: {
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    padding: 10,
    fontFamily: "outfit",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    padding: 10,
  },
  datePickerText: {
    marginLeft: 10,
    fontFamily: "outfit",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    fontFamily: "outfit",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.RED,
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "outfit-bold",
  },
  saveButtonText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "outfit-bold",
  },
});

export default PetHealthRecord;
