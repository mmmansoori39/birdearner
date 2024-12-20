import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { account } from '../lib/appwrite'; // Import the AppWrite account
import { useRouter } from 'expo-router'; // Import useRouter to get the router object

const ForgetPassowrdScreen = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const router = useRouter();

  // Function to send OTP using AppWrite
  const sendOtp = async () => {
    setLoading(true);
    try {
      // Initiate the password recovery process with AppWrite (no recovery URL needed in your case)
      await account.createRecovery(email, ''); // Passing empty string, we don't need recovery URL.
      Alert.alert('OTP Sent', `An OTP has been sent to ${email}.`);
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP (Manual verification)
  const verifyOtp = async () => {
    try {
      setLoading(true);
      // Use your actual logic to verify the OTP; for example, if AppWrite automatically validates OTP
      const response = await account.updateRecovery(email, otp, password, confirmPassword);
      if (response) {
        Alert.alert('OTP Verified', 'You can now reset your password.');
        setOtpVerified(true);
      }
    } catch (error) {
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      console.error('OTP verification failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the password after OTP is verified
  const resetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    try {
      setLoading(true);
      // Assuming OTP has been verified successfully
      await account.updatePassword(password); // Reset password with new one
      Alert.alert('Success', 'Your password has been reset.');
      router.push('/screens/Login'); // Redirect to login screen
    } catch (error) {
      console.error('Password reset failed:', error.message);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>

      {!isOtpSent ? (
        <View>
          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Button title="Send OTP" onPress={sendOtp} />
        </View>
      ) : otpVerified ? (
        <View>
          {/* Password Reset */}
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button title="Reset Password" onPress={resetPassword} />
        </View>
      ) : (
        <View>
          {/* OTP Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <Button title="Verify OTP" onPress={verifyOtp} />
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#ff9800" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#020d19',
  },
  title: {
    fontSize: 24,
    color: '#f0f0f0',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#f0f0f0',
  },
});

export default ForgetPassowrdScreen;
