import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Agenda } from "react-native-calendars";
import * as Notifications from "expo-notifications";
import TaskForm from "./../../components/Schedulers/TaskForm";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

// Cấu hình thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function PetScheduler() {
  const [items, setItems] = useState({});
  const router = useRouter();
  useEffect(() => {
    loadTasks();
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền thông báo bị từ chối!",
        "Cần cấp quyền để nhận nhắc nhở."
      );
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("pet_schedules");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const formattedTasks = parsedTasks.reduce((acc, task) => {
          const dateKey = task.date.split("T")[0];
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(task);
          return acc;
        }, {});
        setItems(formattedTasks);
      } else {
        setItems({});
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch trình:", error);
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      const allTasks = Object.values(updatedTasks).flat();
      await AsyncStorage.setItem("pet_schedules", JSON.stringify(allTasks));
      setItems(updatedTasks);
    } catch (error) {
      console.error("Lỗi khi lưu lịch trình", error);
    }
  };

  const handleAddTask = (task) => {
    const dateKey = new Date(task.date).toISOString().split("T")[0];
    const newTask = { id: Date.now().toString(), ...task };
    const updatedTasks = {
      ...items,
      [dateKey]: items[dateKey] ? [...items[dateKey], newTask] : [newTask],
    };
    saveTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId, dateKey) => {
    const updatedTasks = { ...items };
    updatedTasks[dateKey] = updatedTasks[dateKey].filter(
      (task) => task.id !== taskId
    );
    if (updatedTasks[dateKey]?.length === 0) delete updatedTasks[dateKey];
    saveTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vật nuôi của tôi</Text>
      </View>
      <Agenda
        items={items}
        loadItemsForMonth={loadTasks}
        disablePan={false} // Đảm bảo vuốt được
        renderItem={(task) => (
          <View style={styles.taskCard}>
            <View>
              <Text style={styles.petName}>{task.petName}</Text>
              <Text style={styles.info}>💉 {task.vaccineName}</Text>
              <Text style={styles.info}>📍 {task.address}</Text>
              <Text style={styles.info}>
                🕒{" "}
                {new Date(task.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteTask(task.id, task.date.split("T")[0])}
            >
              <MaterialIcons name="delete" size={28} color="#FF6F61" />
            </TouchableOpacity>
          </View>
        )}
        renderEmptyData={() => (
          <Text style={styles.noTaskText}>Không có hoạt động nào!</Text>
        )}
        theme={{
          todayTextColor: "#FF9800",
          selectedDayBackgroundColor: "#FF9800",
          dotColor: "#FF9800",
          agendaDayTextColor: "#333",
          agendaDayNumColor: "#FF9800",
        }}
      />

      <TaskForm onSubmit={handleAddTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  info: { fontSize: 14, color: "#555", marginTop: 3 },
  noTaskText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
