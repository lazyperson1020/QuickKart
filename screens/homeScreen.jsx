import React from "react";
import {View, Text, Button} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Home from "../app/(tabs)/home"
export default function HomeScreen() {
  return (
    <View>
      <Text>
        Welcome to QuickKart
      </Text>
      <Button
        title="Logout"
        onPress={() =>
          signOut(auth)
        }
      />
      <Home></Home>
    </View>
  );
}