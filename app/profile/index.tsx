// app/profile/index.tsx

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { auth, getVideos, getUserData, logoutUser } from "../../services/firebase";
import { router } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Unauthorized", "Please login to access this page");
        router.replace("/login");
        return;
      }

      try {
        setLoading(true);
        // Get user data
        const fetchedUserData = await getUserData(currentUser.uid);
        setUserData(fetchedUserData);

        // Get user's videos
        const videos = await getVideos(currentUser.uid);
        setUserVideos(videos);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6E9ECF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.userInfoContainer}>
        <View style={styles.userIcon}>
          <FontAwesome5 name="user-circle" size={60} color="#002147" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{userData?.email}</Text>
          <Text style={styles.userRole}>{userData?.role || "User"}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <FontAwesome5 name="sign-out-alt" size={16} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>My Videos</Text>
      {userVideos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You haven't analyzed any videos yet</Text>
          <TouchableOpacity
            style={styles.newAnalysisButton}
            onPress={() => router.push("/analysis")}
          >
            <Text style={styles.newAnalysisText}>Start New Analysis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userVideos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.videoItem}
              onPress={() => router.push(`/video/${item.videoId}`)}
            >
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{item.title || "Tennis Analysis"}</Text>
                <Text style={styles.videoDate}>
                  {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : "Recent"}
                </Text>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#002147" />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002147",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userIcon: {
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#002147",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  newAnalysisButton: {
    backgroundColor: "#6E9ECF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  newAnalysisText: {
    color: "white",
    fontWeight: "bold",
  },
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#6E9ECF",
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  videoDate: {
    fontSize: 12,
    color: "#666",
  },
});