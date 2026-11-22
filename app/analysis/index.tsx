// app/analysis/index.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import FileInput from "@/components/FileInput";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// Comment these out for initial testing
// import { auth, addPayment } from "../../services/firebase";
// import { COLORS, FONTS, SIZES, SHADOWS, CONTAINER_STYLES } from "@/constants/styles";
// import Button from "@/components/Button";
// import Card from "@/components/Card";

// Temporary mock for testing
const auth = {
  currentUser: { uid: 'test-user' }
};

const addPayment = async (data) => {
  console.log('Mock payment added:', data);
  return true;
};

// Temporary style constants for testing
const COLORS = {
  primary: '#1E5F8A',
  secondary: '#4DA1D8',
  accent: '#F0C14B',
  success: '#4CAF50',
  danger: '#E74C3C',
  grey: '#757575',
  lightGrey: '#EEEEEE',
  white: '#FFFFFF',
  dark: '#002147',
  background: '#F9F9F9',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const SIZES = {
  spacing_xs: 4,
  spacing_sm: 8,
  spacing_md: 16,
  spacing_lg: 24,
  spacing_xl: 32,
  radius_xs: 4,
  radius_sm: 8,
  radius_md: 12,
};

export default function Analysis() {
  const [isSelected, setIsSelected] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    if (!auth.currentUser) {
      Alert.alert(
        "Login Required",
        "Please login or register to use the analysis service",
        [
          {
            text: "Login",
            onPress: () => router.push("/login"),
          },
          {
            text: "Cancel",
            onPress: () => router.back(),
            style: "cancel",
          },
        ]
      );
    }
  }, []);

  const handleSetIsSelected = (filename) => {
    setIsSelected(true);
    setSelectedFileName(filename || "Selected Video");
  };

  const handleStartPayment = () => {
    if (!auth.currentUser) {
      Alert.alert("Login Required", "Please login to continue");
      router.push("/login");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Record the payment in Firebase
        await addPayment({
          userId: auth.currentUser.uid,
          amount: 10,
          currency: "EUR",
          status: "completed",
          type: "video_analysis",
          date: new Date()
        });

        setPaymentComplete(true);
        setShowPaymentModal(false);
        setIsProcessing(false);

        Alert.alert(
          "Payment Successful",
          "You can now upload your tennis video for analysis",
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error("Error processing payment:", error);
        Alert.alert("Payment Error", "There was a problem processing your payment");
        setIsProcessing(false);
      }
    }, 2000); // Simulate 2 second processing time
  };

  // Simple placeholder for Button component
  const Button = ({ title, onPress, disabled }) => (
    <TouchableOpacity
      style={{
        backgroundColor: disabled ? COLORS.lightGrey : COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
  );

  // Simple placeholder for Card component
  const Card = ({ children, style }) => (
    <View style={[{
      backgroundColor: COLORS.white,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <View style={styles.infoCardContent}>
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              color={COLORS.accent}
            />
            <Text style={styles.infoText}>
              Professional video analysis costs €10 per video
            </Text>
          </View>
        </Card>

        <View style={styles.headerSection}>
          <Text style={styles.title}>Improve Your Tennis Skills</Text>
          <Text style={styles.subtitle}>
            Our experts will analyze your technique and provide personalized feedback
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={[
              styles.stepCircle,
              paymentComplete && styles.stepCompleted
            ]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Payment</Text>
          </View>

          <View style={styles.stepConnector} />

          <View style={styles.step}>
            <View style={[
              styles.stepCircle,
              paymentComplete && isSelected && styles.stepCompleted
            ]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Video Upload</Text>
          </View>

          <View style={styles.stepConnector} />

          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Analysis</Text>
          </View>
        </View>

        <Card>
          {!paymentComplete ? (
            <View style={styles.paymentSection}>
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>What You'll Get:</Text>

                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={16} color={COLORS.success} style={styles.benefitIcon} />
                  <Text style={styles.benefitText}>Professional stroke analysis</Text>
                </View>

                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={16} color={COLORS.success} style={styles.benefitIcon} />
                  <Text style={styles.benefitText}>Detailed technique feedback</Text>
                </View>
              </View>

              <Button
                title="Pay €10 to Continue"
                onPress={handleStartPayment}
              />
            </View>
          ) : (
            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>Upload Your Tennis Video</Text>

              {isSelected ? (
                <View style={styles.selectedFileContainer}>
                  <View style={styles.selectedFileInfo}>
                    <FontAwesome5 name="file-video" size={24} color={COLORS.primary} style={styles.fileIcon} />
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName} numberOfLines={1}>{selectedFileName}</Text>
                      <Text style={styles.fileStatus}>Ready to submit</Text>
                    </View>
                  </View>
                  <Button
                    title="Upload Different Video"
                    onPress={() => setIsSelected(false)}
                  />
                </View>
              ) : (
                <View style={styles.uploadContainer}>
                  <Image
                    source={require("@/assets/images/video.png")}
                    style={styles.uploadImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.uploadInstructions}>
                    Select a video from your device.
                  </Text>
                  <FileInput handleSetIsSelected={handleSetIsSelected} />
                </View>
              )}

              {isSelected && (
                <Button
                  title="Submit for Analysis"
                  onPress={() => {
                    Alert.alert(
                      "Analysis Submitted",
                      "Your video has been submitted for analysis. You will be notified when it's ready.",
                      [{ text: "OK", onPress: () => router.replace("/") }]
                    );
                  }}
                />
              )}
            </View>
          )}
        </Card>

        <Card>
          <Text style={styles.tipsTitle}>Tips for Better Analysis</Text>

          <View style={styles.tipItem}>
            <FontAwesome5 name="video" size={16} color={COLORS.primary} style={styles.tipIcon} />
            <Text style={styles.tipText}>Record in landscape mode for wider view</Text>
          </View>

          <View style={styles.tipItem}>
            <FontAwesome5 name="sun" size={16} color={COLORS.primary} style={styles.tipIcon} />
            <Text style={styles.tipText}>Ensure good lighting conditions</Text>
          </View>
        </Card>
      </ScrollView>

      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Details</Text>
              {!isProcessing && (
                <TouchableOpacity
                  onPress={() => setShowPaymentModal(false)}
                >
                  <FontAwesome5 name="times" size={20} color={COLORS.grey} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.paymentDetails}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Service:</Text>
                <Text style={styles.paymentValue}>Tennis Video Analysis</Text>
              </View>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Amount:</Text>
                <Text style={styles.paymentAmount}>€10.00</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              {isProcessing ? (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.processingText}>Processing payment...</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowPaymentModal(false)}
                  />
                  <Button
                    title="Pay Now"
                    onPress={handleProcessPayment}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
    fontWeight: '500',
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  stepLabel: {
    fontSize: 14,
    color: COLORS.grey,
  },
  stepConnector: {
    height: 2,
    width: '15%',
    backgroundColor: COLORS.border,
  },
  paymentSection: {
    alignItems: 'center',
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
  },
  uploadSection: {
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  uploadContainer: {
    alignItems: 'center',
    width: '100%',
  },
  uploadImage: {
    width: 150,
    height: 120,
    marginBottom: 24,
  },
  uploadInstructions: {
    fontSize: 14,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 24,
  },
  selectedFileContainer: {
    width: '100%',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  selectedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fileIcon: {
    marginRight: 16,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  fileStatus: {
    fontSize: 14,
    color: COLORS.success,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    marginRight: 16,
  },
  tipText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  paymentDetails: {
    marginBottom: 24,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 16,
    color: COLORS.grey,
  },
  paymentValue: {
    fontSize: 16,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalActions: {
    marginTop: 16,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  processingText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 8,
  },
});