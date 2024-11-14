import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const About = () => {
    const router = useRouter()

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
                <Text style={styles.headerTitle}>Về chúng mình 🐾</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Logo và Slogan */}
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../assets/images/welcome.png')} // Thay đường dẫn logo của bạn
                        style={styles.logo}
                    />
                    <Text style={styles.slogan}>Chăm sóc thú cưng với cả trái tim ❤️</Text>
                </View>

                {/* Giới thiệu */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Câu chuyện của chúng mình</Text>
                    <Text style={styles.sectionContent}>
                        Chúng mình là một đội ngũ yêu động vật, luôn mong muốn mang đến dịch vụ 
                        chăm sóc thú cưng tốt nhất cho các bé...
                    </Text>
                </View>

                {/* Sứ mệnh */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sứ mệnh</Text>
                    <Text style={styles.sectionContent}>
                        Mang đến dịch vụ chăm sóc thú cưng chất lượng, an toàn và đáng tin cậy...
                    </Text>
                </View>

                {/* Liên hệ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Liên hệ với chúng mình</Text>
                    <View style={styles.contactItem}>
                        <MaterialCommunityIcons name="phone" size={20} color="#FF9999" />
                        <Text style={styles.contactText}>0123 456 789</Text>
                    </View>
                    <View style={styles.contactItem}>
                        <MaterialCommunityIcons name="email" size={20} color="#FF9999" />
                        <Text style={styles.contactText}>support@petcare.com</Text>
                    </View>
                    <View style={styles.contactItem}>
                        <MaterialCommunityIcons name="map-marker" size={20} color="#FF9999" />
                        <Text style={styles.contactText}>123 Đường ABC, Quận XYZ, TP.HCM</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default About

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
    logoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    slogan: {
        fontSize: 16,
        color: '#FF8533',
        marginTop: 10,
        fontWeight: '500',
    },
    section: {
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF8533',
        marginBottom: 10,
    },
    sectionContent: {
        color: '#666',
        lineHeight: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactText: {
        color: '#666',
        marginLeft: 10,
    }
})