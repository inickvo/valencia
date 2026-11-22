// app/video/[id].tsx

import React, { useState, useEffect } from "react";
import { Dimensions, ScrollView, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import YoutubePlayer from "react-native-youtube-iframe";
import { VideosList } from "@/components/VideosList";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Video() {
  const { id } = useLocalSearchParams();
  const { width } = Dimensions.get("window");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);

        // Debugging
        console.log("Attempting to load video with ID:", id);

        // If the ID is a direct YouTube video ID
        if (typeof id === "string" && id.length >= 11 && !id.includes("/")) {
          console.log("Using direct video ID:", id);
          setVideoId(id);
          setVideo({
            title: "Tennis Analysis",
            date: new Date().toLocaleDateString(),
            duration: "Video Analysis"
          });
        }
        // Otherwise, try to load from database
        else if (typeof id === "string") {
          console.log("Trying to load video from database with ID:", id);
          const videoRef = doc(db, "videos", id);
          const videoDoc = await getDoc(videoRef);

          if (videoDoc.exists()) {
            const videoData = videoDoc.data();
            console.log("Video data from DB:", videoData);

            // Make sure the videoId is set correctly
            setVideoId(videoData.videoId);
            setVideo({
              title: videoData.title || "Tennis Analysis",
              date: videoData.createdAt ? new Date(videoData.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString(),
              description: videoData.description || "Video Analysis"
            });
          } else {
            console.log("Video not found in DB, using default");
            // Use a known working video ID as fallback
            setVideoId("n6XUxKpBBdA");
            setVideo({
              title: "Tennis Analysis",
              date: new Date().toLocaleDateString(),
              duration: "Video Analysis"
            });
          }
        }
      } catch (error) {
        console.error("Error loading video:", error);
        // Use a known working video ID as fallback
        setVideoId("n6XUxKpBBdA");
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6E9ECF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <YoutubePlayer
        width={width}
        height={(width * 9) / 16}
        videoId={videoId}
        play={false}
        onChangeState={(state) => console.log(state)}
      />
      <View style={styles.infoContainer}>
        <View style={styles.videoHeader}>
          <Text style={styles.title}>{video?.title || "Tennis Analysis"}</Text>
          <Text style={styles.date}>{video?.date || new Date().toLocaleDateString()}</Text>
          {video?.description && <Text style={styles.description}>{video.description}</Text>}
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.moreVideosTitle}>More Videos</Text>
          <VideosList />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  infoContainer: {
    flex: 1,
    padding: 16,
  },
  videoHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 16,
    marginBottom: 16,
  },
  title: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 4,
  },
  date: {
    color: "gray",
    fontSize: 12,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 8,
  },
  moreVideosTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#002147",
  },
});