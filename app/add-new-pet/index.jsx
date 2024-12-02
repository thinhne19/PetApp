// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ScrollView,
//   Pressable,
//   ToastAndroid,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import Colors from "../../constants/Colors";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { collection, doc, getDocs } from "firebase/firestore";
// import { db, storage } from "../../config/firebaseConfig";
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from "expo-image-picker";
// export default function index() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     category: "Dogs",
//     sex: "Male",
//   });
//   const [gender, setGender] = useState();
//   const [categoryList, setCategoryList] = useState([]);
//   const [selectedcategory, setSelectedCategory] = useState();
//   const [image, setImage] = useState();

//   useEffect(() => {
//     GetCategories();
//   }, []);

//   const GetCategories = async () => {
//     setCategoryList([]);
//     const snapshot = await getDocs(collection(db, "Category"));
//     snapshot.forEach((doc) => {
//       console.log(doc.data());
//       setCategoryList((categoryList) => [...categoryList, doc.data()]);
//     });
//   };

//   const imagePicker = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const handleInputChange = (fieldName, fieldValue) => {
//     setFormData((prev) => ({
//       ...prev,
//       [fieldName]: fieldValue,
//     }));
//   };

//   const onSubmit = () => {
//     if (Object.keys(formData).length != 8) {
//       ToastAndroid.show("Enter All Details", ToastAndroid.SHORT);
//       return;
//     }
//     UploadImage();
//   };

//   const UploadImage = async () => {
//     const resp = await fetch(image);
//     const blobImage = await resp.blob();
//     const storageRef = ref(storage, "");
//   };
//   return (
//     <View>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <MaterialCommunityIcons
//             name="arrow-left"
//             size={24}
//             color={Colors.PRIMARY}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Thêm Thú Cưng</Text>
//       </View>
//       <ScrollView
//         style={{
//           padding: 20,
//         }}
//       >
//         <Text
//           style={{
//             fontFamily: "outfit-medium",
//             fontSize: 20,
//           }}
//         >
//           Add New Pet
//         </Text>
//         <Pressable onPress={imagePicker}>
//           {!image ? (
//             <Image
//               source={require("./../../assets/images/dog-placeholder-images-5.png")}
//               style={{
//                 width: 100,
//                 height: 100,
//                 borderRadius: 15,
//                 borderWidth: 1,
//                 borderColor: Colors.GRAY,
//               }}
//             />
//           ) : (
//             <Image
//               source={{ uri: image }}
//               style={{
//                 width: 100,
//                 height: 100,
//                 borderRadius: 15,
//               }}
//             />
//           )}
//         </Pressable>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Pet Name *</Text>
//           <TextInput
//             style={styles.input}
//             onChangeText={(value) => {
//               handleInputChange("name", value);
//             }}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Pet Category *</Text>
//           <Picker
//             selectedValue={selectedcategory}
//             style={styles.input}
//             onValueChange={(itemValue, itemIndex) => {
//               setSelectedCategory(itemValue);
//               handleInputChange("category", itemValue);
//             }}
//           >
//             {categoryList.map((category, index) => (
//               <Picker.Item
//                 key={index}
//                 label={category.name}
//                 value={category.name}
//               />
//             ))}
//           </Picker>
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Breed *</Text>
//           <TextInput
//             style={styles.input}
//             onChangeText={(value) => {
//               handleInputChange("breed", value);
//             }}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Age *</Text>
//           <TextInput
//             style={styles.input}
//             keyboardType="numeric"
//             onChangeText={(value) => {
//               // Kiểm tra xem giá trị nhập vào có phải là số không trước khi cập nhật
//               if (/^\d+$/.test(value) || value === "") {
//                 handleInputChange("age", value);
//               }
//             }}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Gender *</Text>
//           <Picker
//             selectedValue={gender}
//             style={styles.input}
//             onValueChange={(itemValue, itemIndex) => {
//               setGender(itemValue);
//               handleInputChange("sex", itemValue);
//             }}
//           >
//             <Picker.Item label="Male" value="Male" />
//             <Picker.Item label="Female" value="Female" />
//           </Picker>
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Weight *</Text>
//           <TextInput
//             style={styles.input}
//             keyboardType="numeric"
//             onChangeText={(value) => {
//               // Kiểm tra xem giá trị nhập vào có phải là số không trước khi cập nhật
//               if (/^\d+$/.test(value) || value === "") {
//                 handleInputChange("Weight", value);
//               }
//             }}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>About *</Text>
//           <TextInput
//             style={styles.input}
//             numberOfLines={5}
//             multiline={true}
//             onChangeText={(value) => {
//               handleInputChange("about", value);
//             }}
//           />
//         </View>

//         <TouchableOpacity style={styles.button} onPress={onSubmit}>
//           <Text
//             style={{
//               fontFamily: "outfit-medium",
//               textAlign: "center",
//             }}
//           >
//             Submit
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: Colors.LIGHT_PRIMARY,
//   },
//   backButton: {
//     padding: 5,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: Colors.PRIMARY,
//     marginLeft: 15,
//   },
//   inputContainer: {
//     marginVertical: 5,
//   },
//   input: {
//     padding: 10,
//     backgroundColor: Colors.WHITE,
//     borderRadius: 7,
//     fontFamily: "outfit",
//   },
//   label: {
//     marginVertical: 5,
//     fontFamily: "outfit",
//   },
//   button: {
//     padding: 15,
//     backgroundColor: Colors.PRIMARY,
//     borderRadius: 7,
//     marginVertical: 10,
//     marginBottom: 150,
//   },
// });
