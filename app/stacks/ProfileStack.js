import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyProfileScreen from '../screens/MyProfile';
import MyReviewScreen from '../screens/MyReview';
import AvailabilityScreen from '../screens/Availability';
import SettingsScreen from '../screens/Settings';
import PasswordUpdateScreen from '../screens/PasswordUpdate';
import EmailUpdateScreen from '../screens/EmailUpdate';
import WithdrawalEarningScreen from '../screens/WithdrawalEarning';
import BankAccountdetailsScreen from '../screens/BankAccountdetails';
import NotificationsSettingScreen from '../screens/NotificationsSetting';
import AppearanceScreen from '../screens/Appearance';
import WalletScreen from '../screens/Wallet';


const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{headerShown: false}}

      />
      <Stack.Screen
        name="MyReview"
        component={MyReviewScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
      name="Availability"
      component={AvailabilityScreen}
      options={{headerShown: false}}
       />
      <Stack.Screen
      name="Password update"
      component={PasswordUpdateScreen}
      options={{headerShown: false}}
       />
      <Stack.Screen
      name="Email update"
      component={EmailUpdateScreen}
      options={{headerShown: false}}
       />
      <Stack.Screen
      name="Withdrawal Earning"
      component={WithdrawalEarningScreen}
      options={{headerShown: false}}
       />
      <Stack.Screen
      name="Bank Account details"
      component={BankAccountdetailsScreen}
      options={{headerShown: false}}
       />
      <Stack.Screen
      name="Notifications Setting"
      component={NotificationsSettingScreen}
      options={{headerShown: false}}
       />
      <Stack.Screen
      name="Appearance"
      component={AppearanceScreen}
      options={{headerShown: false}}
       />
      <Stack.Screen
      name="Wallet"
      component={WalletScreen}
      options={{headerShown: false}}
       />
    </Stack.Navigator>
  );
}
