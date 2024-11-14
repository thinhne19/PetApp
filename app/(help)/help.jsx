import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Help = () => {
    const router = useRouter()


    const faqItems = [
        {
            question: "Làm sao để hủy lịch khám?",
            answer: "Để hủy lịch khám, bạn có thể vào mục 'Lịch hẹn' và chọn 'Hủy lịch'. Chúng tôi sẽ hoàn lại chi phí nếu bạn hủy trước 24 giờ."
        },
        {
            question: "Tôi có thể thay đổi lịch khám được không?",
            answer: "Chắc chắn rồi! Bạn có thể vào mục 'Lịch hẹn' và chọn 'Thay đổi lịch'. Chúng tôi sẽ hỗ trợ bạn sắp xếp lịch mới phù hợp."
        },
        {
            question: "Tôi có thể mang thú cưng của mình đến không?",
            answer: "Tất nhiên! Chúng tôi rất vui khi được gặp và chăm sóc thú cưng của bạn. Vui lòng đảm bảo rằng thú cưng đã được tiêm phòng đầy đủ và đeo rọ mõm khi đến cơ sở."
        },
        {
            question: "Tôi có thể thanh toán bằng hình thức nào?",
            answer: "Chúng tôi chấp nhận nhiều hình thức thanh toán như tiền mặt, thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng và ví điện tử. Bạn có thể lựa chọn phương thức phù hợp nhất."
        },
        {
            question: "Chính sách bảo mật của công ty như thế nào?",
            answer: "Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng một cách nghiêm ngặt. Thông tin của bạn sẽ không được chia sẻ với bên thứ ba mà không có sự đồng ý của bạn."
        }
    ];


    const helpItems = [
        {
            title: "Cách quản lý thú cưng",
            icon: "paw",
            content: "Bạn có thể dễ dàng xem lịch khám của thú cưng. Bạn có thể dễ dàng theo dõi và quản lý thông tin về thú cưng của mình"
        },
        {
            title: "Chính sách bảo mật",
            icon: "shield-check",
            content: "Thông tin của bạn luôn được bảo vệ một cách an toàn nhất"
        }
    ]

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
                <Text style={styles.headerTitle}>Trợ giúp bạn nhé 🌟</Text>
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
                {helpItems.map((item, index) => (
                    <View key={index} style={styles.helpItem}>
                        <View style={styles.helpHeader}>
                            <MaterialCommunityIcons 
                                name={item.icon} 
                                size={24} 
                                color="#FF9999" 
                            />
                            <Text style={styles.helpTitle}>{item.title}</Text>
                        </View>
                        <Text style={styles.helpContent}>{item.content}</Text>
                    </View>
                ))}


<View style={styles.helpItem}>
                <View style={styles.helpHeader}>
                    <MaterialCommunityIcons name="frequently-asked-questions" size={24} color="#FF9999" />
                    <Text style={styles.helpTitle}>Câu hỏi thường gặp</Text>
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
    )
}

export default Help

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF9E6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFE5CC',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF8533',
        marginLeft: 15,
    },
    content: {
        padding: 15,
    },
    helpItem: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#FFB366',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    helpHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF8533',
        marginLeft: 10,
    },
    helpContent: {
        color: '#666',
        lineHeight: 20,
    },
    faqItem: {
        marginBottom: 15,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF8533',
        marginBottom: 5,
    },
    faqAnswer: {
        color: '#666',
        lineHeight: 20,
    }
})