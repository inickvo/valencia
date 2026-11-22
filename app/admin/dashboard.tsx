// app/admin/dashboard.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { getVideos, addVideo, auth, getUserData } from "../../services/firebase";
import { router } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function AdminDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Unauthorized", "Please login to access this page");
        router.replace("/login");
        return;
      }

      const userData = await getUserData(currentUser.uid);
      if (userData?.role !== "admin") {
        Alert.alert("Unauthorized", "You do not have permission to access this page");
        router.replace("/");
        return;
      }

      setIsAdmin(true);
      loadVideos();
    };

    checkAdmin();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos);
    } catch (error) {
      console.error("Error loading videos:", error);
      Alert.alert("Error", "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async () => {
    if (!title.trim() || !videoId.trim()) {
      Alert.alert("Error", "Title and YouTube Video ID are required");
      return;
    }

    try {
      setSubmitting(true);
      await addVideo({
        title,
        videoId,
        description,
        addedBy: auth.currentUser.uid,
        isPublic: true,
      });
      
      setTitle("");
      setVideoId("");
      setDescription("");
      Alert.alert("Success", "Video added successfully");
      loadVideos();
    } catch (error) {
      console.error("Error adding video:", error);
      Alert.alert("Error", "Failed to add video");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6E9ECF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadVideos}
        >
          <FontAwesome5 name="sync" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Add New Video</Text>
        
        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter video title"
        />
        
        <Text style={styles.inputLabel}>YouTube Video ID</Text>
        <TextInput
          style={styles.input}
          value={videoId}
          onChangeText={setVideoId}
          placeholder="e.g. dQw4w9WgXcQ"
        />
        
        <Text style={styles.inputLabel}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter video description"
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddVideo}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Add Video</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Manage Videos</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#6E9ECF" />
        ) : videos.length === 0 ? (
          <Text style={styles.emptyText}>No videos found</Text>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.videoItem}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.videoId}>ID: {item.videoId}</Text>
                {item.description && (
                  <Text style={styles.videoDescription}>{item.description}</Text>
                )}
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002147",
  },
  refreshButton: {
    backgroundColor: "#6E9ECF",
    padding: 8,
    borderRadius: 5,
  },
  formContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#002147",
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: "#4682B4",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  videoItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#6E9ECF",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  videoId: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
});