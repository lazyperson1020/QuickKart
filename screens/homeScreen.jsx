import React from "react";
import {View, Text, Button} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

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
    </View>
  );
}