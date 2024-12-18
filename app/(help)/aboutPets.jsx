import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { useRouter } from "expo-router";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import Colors from "../../constants/Colors";
  
  const Help = () => {
    const router = useRouter();
  
    const faqItems = [
      {
        question: "Làm cách nào để hủy cuộc hẹn?",
        answer:
          "Để hủy cuộc hẹn, hãy đến phần 'Cuộc hẹn' và chọn 'Hủy cuộc hẹn'. Chúng tôi sẽ hoàn lại phí nếu bạn hủy ít nhất 24 giờ trước.",
      },
      {
        question: "Tôi có thể đổi lịch cuộc hẹn không?",
        answer:
          "Dĩ nhiên! Bạn có thể đến phần 'Cuộc hẹn' và chọn 'Đổi lịch cuộc hẹn'. Chúng tôi sẽ giúp bạn sắp xếp thời gian mới phù hợp.",
      },
      {
        question: "Tôi có thể mang theo thú cưng của mình không?",
        answer:
          "Tất nhiên! Chúng tôi rất vui mừng được gặp và chăm sóc thú cưng của bạn. Vui lòng đảm bảo thú cưng của bạn đã được tiêm phòng đầy đủ và đeo mõm khi đến thăm cơ sở của chúng tôi.",
      },
      {
        question: "Phương thức thanh toán nào bạn chấp nhận?",
        answer:
          "Chúng tôi chấp nhận nhiều phương thức thanh toán như tiền mặt, thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng và ví điện tử. Bạn có thể chọn phương thức phù hợp nhất với mình.",
      },
      {
        question: "Chính sách bảo mật của công ty của bạn là gì?",
        answer:
          "Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng một cách nghiêm ngặt. Thông tin của bạn sẽ không được chia sẻ với bên thứ ba mà không có sự đồng ý của bạn.",
      },
    ];
  
    const helpItems = [
      {
        title: "Cách Quản Lý Thú Cưng",
        icon: "paw",
        content:
          "Bạn có thể dễ dàng xem lịch trình cuộc hẹn của thú cưng và thuận tiện theo dõi và quản lý thông tin của thú cưng.",
      },
      {
        title: "Chính Sách Bảo Mật",
        icon: "shield-check",
        content:
          "Thông tin của bạn luôn được bảo vệ một cách an toàn nhất có thể.",
      },
    ];
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FF8533" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đây để Hỗ Trợ Bạn 🌟</Text>
        </View>
  
        {/* Content */}
        <ScrollView style={styles.content}>
          {helpItems.map((item, index) => (
            <View key={index} style={styles.helpItem}>
              <View style={styles.helpHeader}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={Colors.LIGHT_PINK}
  />
                <Text style={styles.helpTitle}>{item.title}</Text>
              </View>
              <Text style={styles.helpContent}>{item.content}</Text>
            </View>
          ))}
  
          <View style={styles.helpItem}>
            <View style={styles.helpHeader}>
              <MaterialCommunityIcons
                name="frequently-asked-questions"
                size={24}
                color={Colors.LIGHT_PRIMARY}
              />
              <Text style={styles.helpTitle}>Câu Hỏi Thường Gặp</Text>
            </View>
            {faqItems.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  export default Help;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.WHITE,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: Colors.LIGHT_PRIMARY,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "outfit-bold",
      color: Colors.PRIMARY,
      marginLeft: 15,
    },
    content: {
      padding: 15,
      fontFamily: "outfit",
    },
    helpItem: {
      backgroundColor: Colors.WHITE,
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      shadowColor: Colors.PRIMARY,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    helpHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    helpTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.PRIMARY,
      marginLeft: 10,
      fontFamily: "outfit-bold",
    },
    helpContent: {
      color: "#666",
      lineHeight: 20,
      fontFamily: "outfit",
    },
    faqItem: {
      marginBottom: 15,
    },
    faqQuestion: {
      fontSize: 16,
      fontFamily: "outfit-bold",
      color: Colors.PRIMARY,
      marginBottom: 5,
    },
    faqAnswer: {
      color: "#666",
      lineHeight: 20,
      fontFamily: "outfit",
    },
  });