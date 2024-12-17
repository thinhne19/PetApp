import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";

export default function TaskList({ tasks, onDelete }) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.taskName}</Text>
          <Text>Ngày: {new Date(item.date).toLocaleDateString()}</Text>
          <Button title="Xóa" onPress={() => onDelete(item.id)} color="red" />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: { padding: 10, borderBottomWidth: 1, marginBottom: 5 },
  title: {
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
