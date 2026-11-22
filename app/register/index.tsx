// app/register/index.tsx

import React, { useState } from "react";
import { Link, router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { registerUser } from "../../services/firebase";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await registerUser(email, password);
      Alert.alert("Success", "Account created successfully", [
        { text: "OK", onPress: () => router.replace("/") }
      ]);
    } catch (error: any) {
      let message = "Failed to create account";
      if (error.code === "auth/email-already-in-use") {
        message = "Email is already in use";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak";
      }
      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 32 }}>
        Create your account!
      </Text>
      <View
        style={{
          width: "80%",
          display: "flex",
        }}
      >
        <Text>Email</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            width: "100%",
          }}
          placeholder="your@email.com"
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View
        style={{
          width: "80%",
          display: "flex",
        }}
      >
        <Text>Password</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            width: "100%",
          }}
          placeholder="**********"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View
        style={{
          width: "80%",
          display: "flex",
        }}
      >
        <Text>Confirm password</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            width: "100%",
          }}
          placeholder="**********"
          secureTextEntry
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>
      <View
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: -10,
        }}
      >
        <Link href={"/login"}>
          <Text style={{ fontSize: 12, color: "gray" }}>
            Already have an account?
          </Text>
        </Link>
        <TouchableOpacity
          style={{
            backgroundColor: "#6E9ECF",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 5,
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginTop: 10,
          }}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}