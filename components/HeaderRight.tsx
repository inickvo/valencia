// components/HeaderRight.tsx

import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, router } from "expo-router";
import { auth, logoutUser, getUserData } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const HeaderRight = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userData = await getUserData(currentUser.uid);
        setIsAdmin(userData?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  const handleUserProfile = () => {
    if (isAdmin) {
      router.push("/admin/dashboard");
    } else {
      router.push("/profile");
    }
  };

  return (
    <View>
      {user ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isAdmin && (
            <Link href="/admin/dashboard" asChild>
              <TouchableOpacity>
                <FontAwesome5 name="crown" size={24} color="#FFD700" />
              </TouchableOpacity>
            </Link>
          )}
          <TouchableOpacity>
            <FontAwesome5 name="bell" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUserProfile}>
            <FontAwesome5 name="user" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <FontAwesome5 name="sign-out-alt" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Link href={"/login"} asChild>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
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
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#002147" }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href={"/register"} asChild>
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
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "black" }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
};

export default HeaderRight;