// components/VideosList.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// Import static data as fallback
import { videos as staticVideos } from "@/data/data";

// Import firebase services to fetch real data
import { getVideos } from "../services/firebase";

export const VideosList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useFirebase, setUseFirebase] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);

    try {
      if (useFirebase) {
        // Try to fetch from Firebase
        const fetchedVideos = await getVideos();
        console.log("Fetched videos:", fetchedVideos);

        // Only show public videos
        const publicVideos = fetchedVideos.filter(video => video.isPublic === true);

        if (publicVideos && publicVideos.length > 0) {
          setVideos(publicVideos);
          console.log("Using Firebase videos:", publicVideos.length);
        } else {
          // Fall back to static data if no videos from Firebase
          console.log("No videos from Firebase, using static data");
          setVideos(staticVideos);
          setUseFirebase(false);
        }
      } else {
        // Use static data
        setVideos(staticVideos);
      }
    } catch (error) {
      console.error("Error loading videos:", error);
      // Fall back to static data on error
      setVideos(staticVideos);
      setUseFirebase(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  const handleVideoPress = (video) => {
    if (useFirebase) {
      // For Firebase videos
      router.push(`/video/${video.id}`);
    } else {
      // For static videos
      router.push({
        pathname: `/video/${video.name}`,
        params: {
          name: video.name,
          date: video.date,
          time: video.time,
          weight: video.weight
        }
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E5F8A" />
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No videos available</Text>
      </View>
    );
  }

  const renderVideoItem = ({ item }) => {
    const videoTitle = useFirebase ? item.title : item.name;
    const videoDate = item.date || (item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : "");
    const videoDuration = item.time || "0:00";
    const videoSize = item.weight || "0MB";

    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => handleVideoPress(item)}
      >
        <View style={styles.thumbnailContainer}>
          <Image
            source={require("@/assets/images/video.png")}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{videoDuration}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>{videoTitle}</Text>
            <Text style={styles.dateText}>{videoDate}</Text>
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <FontAwesome5 name="file-video" size={12} color="#757575" style={styles.metaIcon} />
                <Text style={styles.metaText}>{videoSize}</Text>
              </View>
            </View>
          </View>

          <MaterialIcons name="more-vert" size={24} color="black" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={videos}
      renderItem={renderVideoItem}
      keyExtractor={(item, index) => item.id || `static-video-${index}`}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
  videoItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333333",
  },
  dateText: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#757575",
  },
});

export default VideosList;