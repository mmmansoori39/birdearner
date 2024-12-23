import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "../lib/appwrite";

const WalletClientScreen = ({ navigation }) => {
    const { userData } = useAuth();
    const [walletAmount, setWalletAmount] = useState(userData?.wallet || 0);
    const [paymentHistory, setPaymentHistory] = useState([]);

    // Fetch updated wallet data when the screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchWalletData);
        return unsubscribe;
    }, [navigation]);

    const fetchPaymentHistory = async (userId) => {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.paymentHistoryCollectionId,
                [Query.equal("userId", userId)]
            );
            setPaymentHistory(response.documents || []);
        } catch (error) {
            console.error("Error fetching payment history:", error);
        }
    };

    const fetchWalletData = async () => {
        try {
            if (userData) {
                const userId = userData?.$id;
                const collectionId = appwriteConfig.clientCollectionId;

                // Fetch wallet details
                const userDoc = await databases.getDocument(
                    appwriteConfig.databaseId,
                    collectionId,
                    userId
                );
                setWalletAmount(userDoc.wallet || 0);

                // Fetch payment history
                fetchPaymentHistory(userId);
            }
        } catch (error) {
            console.error("Error fetching wallet data:", error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Success":
                return { color: "green" };
            case "Failed":
                return { color: "red" };
            case "Pending":
                return { color: "orange" };
            default:
                return {};
        }
    };

    const renderPaymentItem = ({ item }) => (
        <View style={styles.paymentItem}>
            <Text style={styles.paymentId}>Payment ID: {item.paymentId}</Text>
            <Text style={styles.paymentAmount}>Amount: ₹{item.amount}</Text>
            <Text style={[styles.paymentStatus, getStatusStyle(item.status)]}>
                Status: {item.status}
            </Text>
            <Text style={styles.paymentDate}>
                Date: {new Date(item.date).toLocaleString()}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Wallet</Text>
            </View>

            <Text style={styles.label}>Total Amount in Wallet</Text>
            <Text style={styles.colorText}>₹{walletAmount || "0.0"}</Text>

            <TouchableOpacity onPress={() => navigation.navigate("Payment")}>
                <Text style={styles.addAmount}>Add Amount to Wallet</Text>
            </TouchableOpacity>

            <View style={styles.historyContainer}>
                <Text style={styles.headerPay}>Payment History</Text>
                {paymentHistory.length > 0 ? (
                    <FlatList
                        data={paymentHistory}
                        renderItem={renderPaymentItem}
                        keyExtractor={(item) => item.$id} // Use the unique document ID as the key
                        style={styles.historyList}
                    />
                ) : (
                    <Text style={styles.noHistory}>No payment history available.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFF",
        paddingHorizontal: 40,
    },
    main: {
        marginTop: 45,
        marginBottom: 50,
        display: "flex",
        flexDirection: "row",
        gap: 50,
        alignItems: "center",
    },
    addAmount: {
        textAlign: "center",
        textDecorationLine: "underline",
        fontSize: 16,
        color: "#4B0082",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    headerPay: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
        marginTop: 25,
        color: "#8F8F8F",
    },
    label: {
        fontSize: 18,
        color: "#000000",
        marginBottom: 8,
        fontWeight: "400",
        textAlign: "center",
    },
    colorText: {
        fontSize: 30,
        fontWeight: "600",
        color: "#4B0082",
        textAlign: "center",
        marginBottom: 20,
    },
    historyContainer: {
        flex: 1,
        marginTop: 20,
    },
    historyList: {
        marginTop: 10,
    },
    paymentItem: {
        backgroundColor: "#F9F9F9",
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    paymentId: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    paymentAmount: {
        fontSize: 14,
        fontWeight: "500",
        color: "#4B0082",
    },
    paymentStatus: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 5,
    },
    paymentDate: {
        fontSize: 12,
        color: "#888",
        marginTop: 5,
    },
    noHistory: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
});

export default WalletClientScreen;
