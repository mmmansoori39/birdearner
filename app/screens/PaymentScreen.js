import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { appwriteConfig, databases } from '../lib/appwrite';

const PaymentScreen = ({ navigation }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { userData } = useAuth();
  const pic = userData?.profile_photo || 'https://example.com/default-profile-pic.png';
  const name = userData?.full_name || 'Guest User';
  const [amount, setAmount] = useState('');

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handlePayment = async () => {
    try {
      const options = {
        description: `Add ₹${amount} to wallet`,
        image: pic,
        currency: 'INR',
        key: 'rzp_test_Jl7LJ6dEC1YfnX',
        amount: amount * 100,
        name: name,
        prefill: {
          email: 'mmm@gmail.com',
          phone: '9708283739',
          name: 'Md Moinuddin Mansoori',
        },
        theme: { color: '#4B0082' },
      };

      const paymentData = await RazorpayCheckout.open(options);

      await updateWalletAmount(amount, paymentData.razorpay_payment_id);
      setPaymentSuccess(true);
    } catch (error) {
      alert('Payment failed. Please try again.');
    }
  };

  const updateWalletAmount = async (addedAmount, paymentId) => {
    try {
      if (userData) {
        const userId = userData?.$id;

        // Collection IDs
        const clientCollectionId = appwriteConfig.clientCollectionId;
        const paymentHistoryCollectionId = appwriteConfig.paymentHistoryCollectionId;

        // Fetch user document to get the current wallet amount
        const userDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          clientCollectionId,
          userId
        );

        const currentWallet = userDoc.wallet || 0;
        const newWalletAmount = currentWallet + parseFloat(addedAmount);

        // Update wallet amount in the user's document
        await databases.updateDocument(
          appwriteConfig.databaseId,
          clientCollectionId,
          userId,
          {
            wallet: newWalletAmount,
          }
        );

        // Add a new payment history document
        await databases.createDocument(
          appwriteConfig.databaseId,
          paymentHistoryCollectionId,
          'unique()',
          {
            userId: userId,
            paymentId: paymentId,
            amount: parseFloat(addedAmount),
            status: 'Success',
            date: new Date().toISOString(),
          }
        );

        alert(`₹${addedAmount} added successfully! Your new wallet balance is ₹${newWalletAmount}.`);
      }
    } catch (error) {
      alert('Failed to update wallet. Please contact support.');
    }
  };


  return (
    <View style={styles.container}>
      {
        !paymentSuccess && (
          <View style={styles.main}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.header}>Add Amount to Wallet</Text>
          </View>
        )
      }

      {!paymentSuccess && (
        <>
          <Text style={styles.label}>Enter the amount you want to add</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
        </>
      )}

      {paymentSuccess ? (
        <View style={styles.paymentContainer}>
          <Image
            source={{ uri: pic }}
            style={styles.image}
          />
          <Text style={styles.description}>Thank you, {name}!</Text>
          <Text style={styles.amount}>Added Amount: ₹{amount}</Text>
          <TouchableOpacity style={styles.goBackk} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="black" />
            <Text>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.signupButton} onPress={handlePayment}>
          <Text style={styles.signupButtonText}>Add Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: 40,
    // justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  main: {
    marginTop: 45,
    marginBottom: 50,
    display: "flex",
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 8,
    fontWeight: "400",
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 40,
    fontSize: 16,
    borderColor: "#4B0082",
    borderWidth: 2,
    marginVertical: 10,
  },
  paymentContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignContent: "center",
    justifyContent: "center",
    marginVertical: 160
  },
  image: {
    width: 150,
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    marginBottom: 20,
  },
  signupButton: {
    width: "50%",
    height: 50,
    backgroundColor: "#4B0082",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  signupButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  goBackk: {
    display: "flex",
    flexDirection: "row",
    gap: 8
  }
});

export default PaymentScreen;
