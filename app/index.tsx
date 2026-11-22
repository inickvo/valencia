// app/index.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import { VideosList } from "@/components/VideosList";
import AdminVideoControls from "@/components/AdminVideoControls";
import { auth, getUserData } from "../services/firebase";

export default function Index() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkIfAdmin();
  }, []);

  const checkIfAdmin = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userData = await getUserData(currentUser.uid);
      setIsAdmin(userData?.role === 'admin');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Admin Controls - Only visible to admin users */}
        {isAdmin && <AdminVideoControls />}

        {/* Buy Analysis/Placeholder */}
        <View style={styles.buySection}>
          <Text style={styles.buyTitle}>Professional Tennis Analysis</Text>
          <Text style={styles.buyPrice}>€10</Text>
          <Text style={styles.buyDescription}>
            Get professional feedback on your tennis technique. Upload your video and chat with coach Sergio.
          </Text>
          <View style={styles.buttonContainer}>
            <Link href={"/analysis"} asChild>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Analysis Action Button */}
        <View style={styles.analysisButtonWrapper}>
          <Link href={"/analysis"} asChild>
            <TouchableOpacity style={styles.analysisButton}>
              <View style={styles.analysisButtonContent}>
                <FontAwesome5 name="plus-square" size={24} color="white" style={styles.analysisButtonIcon} />
                <View style={styles.analysisButtonText}>
                  <Text style={styles.analysisButtonTitle}>Biomechanical Analysis</Text>
                  <Text style={styles.analysisButtonSubtitle}>Upload your video for professional feedback</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Videos Section */}
        <View style={styles.videosSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Check Your Tennis Skills</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <VideosList />
        </View>

        {/* Features Section - From Previous Design */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresSectionTitle}>Why Choose Our Analysis</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <FontAwesome5 name="chart-line" size={24} color="#1E5F8A" style={styles.featureIcon} />
              <Text style={styles.featureTitle}>Performance Tracking</Text>
              <Text style={styles.featureDescription}>Track your progress over time with detailed metrics</Text>
            </View>

            <View style={styles.featureCard}>
              <FontAwesome5 name="user-tie" size={24} color="#1E5F8A" style={styles.featureIcon} />
              <Text style={styles.featureTitle}>Expert Analysis</Text>
              <Text style={styles.featureDescription}>Get feedback from tennis professionals</Text>
            </View>

            <View style={styles.featureCard}>
              <FontAwesome5 name="video" size={24} color="#1E5F8A" style={styles.featureIcon} />
              <Text style={styles.featureTitle}>HD Video</Text>
              <Text style={styles.featureDescription}>High-quality video breakdown of techniques</Text>
            </View>

            <View style={styles.featureCard}>
              <FontAwesome5 name="laptop" size={24} color="#1E5F8A" style={styles.featureIcon} />
              <Text style={styles.featureTitle}>Instant Access</Text>
              <Text style={styles.featureDescription}>Access your analysis anywhere, anytime</Text>
            </View>
          </View>
        </View>

        {/* Coach Section */}
        <View style={styles.coachSection}>
          <Text style={styles.coachSectionTitle}>Meet Your Coach</Text>
          <Text style={styles.coachName}>Sergio</Text>
          <Text style={styles.coachDescription}>
            Professional tennis coach with over 15 years of experience working with players from beginners to advanced competitors. Sergio specializes in technique refinement and strategic game development.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  contentContainer: {
    padding: 16,
  },
  // Buy Section
  buySection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E5F8A",
    marginBottom: 8,
    textAlign: "center", // Centered
  },
  buyPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E5F8A",
    marginBottom: 12,
    textAlign: "center", // Centered
  },
  buyDescription: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 20,
    lineHeight: 20,
    textAlign: "center", // Centered
  },
  buttonContainer: {
    alignItems: "center", // Center the button
  },
  buyButton: {
    backgroundColor: "#1E5F8A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    width: "80%", // Make button more narrow
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Analysis Button
  analysisButtonWrapper: {
    alignItems: "center", // Center the button
    marginBottom: 24,
  },
  analysisButton: {
    backgroundColor: "#1E5F8A",
    borderRadius: 12,
    padding: 16,
    width: "80%", // Make button more narrow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisButtonIcon: {
    marginRight: 16,
  },
  analysisButtonText: {
    flex: 1,
  },
  analysisButtonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    textAlign: "center", // Centered
  },
  analysisButtonSubtitle: {
    fontSize: 13,
    color: "white",
    opacity: 0.9,
    textAlign: "center", // Centered
  },
  // Videos section1
  videosSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002147",
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: "#1E5F8A",
  },
  // Features Section
  featuresSection: {
    marginBottom: 24,
  },
  featuresSectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002147",
    marginBottom: 16,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#002147",
    marginBottom: 4,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
  },
  // Coach Section
  coachSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coachSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#002147",
    marginBottom: 8,
    textAlign: "center", // Centered
  },
  coachName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E5F8A",
    marginBottom: 8,
    textAlign: "center", // Centered
  },
  coachDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    textAlign: "center", // Centered
  },
});