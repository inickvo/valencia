// components/BuyAnalysis.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
    Image
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/styles';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { auth, addPayment } from '../services/firebase';
import ChatWithSergio from './ChatWithSergio';
import FileInput from './FileInput';

const BuyAnalysis = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBuyNow = () => {
        if (!auth.currentUser) {
            Alert.alert(
                "Login Required",
                "Please login or register to purchase analysis",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Login", onPress: () => { /* Navigate to login */ } }
                ]
            );
            return;
        }
        setShowPaymentModal(true);
    };

    const handleSetIsSelected = (filename) => {
        setIsFileSelected(true);
        setSelectedFileName(filename || "Selected Video");
    };

    const handleProcessPayment = () => {
        // Validate payment details
        if (!cardNumber.trim() || !cardHolder.trim() || !expiryDate.trim() || !cvv.trim()) {
            Alert.alert("Error", "Please fill in all payment details");
            return;
        }

        setProcessing(true);

        // Simulate payment processing
        setTimeout(async () => {
            try {
                // Add payment record to Firebase
                await addPayment({
                    userId: auth.currentUser.uid,
                    amount: 10,
                    currency: "EUR",
                    status: "completed",
                    type: "tennis_analysis",
                    date: new Date()
                });

                setProcessing(false);
                setShowPaymentModal(false);
                setPaymentComplete(true);

                Alert.alert(
                    "Payment Successful",
                    "You have successfully purchased a tennis video analysis. You can now upload your video and chat with Sergio.",
                    [{ text: "OK" }]
                );
            } catch (error) {
                console.error("Error processing payment:", error);
                setProcessing(false);
                Alert.alert("Payment Error", "There was a problem processing your payment. Please try again.");
            }
        }, 2000);
    };

    const handleSubmitVideo = () => {
        if (!isFileSelected) {
            Alert.alert("Error", "Please select a video file first");
            return;
        }

        setIsSubmitting(true);

        // Simulate video submission
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert(
                "Video Submitted",
                "Your video has been submitted for analysis. Sergio will review it and send you feedback soon.",
                [{ text: "OK" }]
            );
        }, 1500);
    };

    // Format card number with spaces
    const formatCardNumber = (text) => {
        // Remove all non-numeric characters
        const cleaned = text.replace(/\D/g, '');
        // Add a space after every 4 digits
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
        // Limit to 19 characters (16 digits + 3 spaces)
        return formatted.slice(0, 19);
    };

    // Format expiry date (MM/YY)
    const formatExpiryDate = (text) => {
        // Remove all non-numeric characters
        const cleaned = text.replace(/\D/g, '');
        // Add slash after 2 digits
        const formatted = cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` : cleaned;
        // Limit to 5 characters (MM/YY)
        return formatted.slice(0, 5);
    };

    return (
        <View style={styles.container}>
            {!paymentComplete ? (
                <>
                    <View style={styles.pricingCard}>
                        <View style={styles.pricingHeader}>
                            <Text style={styles.pricingTitle}>Professional Tennis Analysis</Text>
                            <Text style={styles.price}>€10</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.features}>
                            <View style={styles.featureItem}>
                                <FontAwesome5 name="check-circle" size={16} color={COLORS.success} style={styles.featureIcon} />
                                <Text style={styles.featureText}>Professional stroke analysis</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <FontAwesome5 name="check-circle" size={16} color={COLORS.success} style={styles.featureIcon} />
                                <Text style={styles.featureText}>Detailed technique feedback</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <FontAwesome5 name="check-circle" size={16} color={COLORS.success} style={styles.featureIcon} />
                                <Text style={styles.featureText}>1-on-1 chat with coach Sergio</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <FontAwesome5 name="check-circle" size={16} color={COLORS.success} style={styles.featureIcon} />
                                <Text style={styles.featureText}>Personalized improvement plan</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.buyButton}
                            onPress={handleBuyNow}
                        >
                            <Text style={styles.buyButtonText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.infoHeader}>How It Works</Text>

                        <View style={styles.infoItem}>
                            <View style={styles.infoStep}>
                                <Text style={styles.infoStepNumber}>1</Text>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Purchase</Text>
                                <Text style={styles.infoText}>Pay for the video analysis service</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={styles.infoStep}>
                                <Text style={styles.infoStepNumber}>2</Text>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Upload</Text>
                                <Text style={styles.infoText}>Upload a video of your tennis play</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={styles.infoStep}>
                                <Text style={styles.infoStepNumber}>3</Text>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Chat</Text>
                                <Text style={styles.infoText}>Discuss your technique with coach Sergio</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={styles.infoStep}>
                                <Text style={styles.infoStepNumber}>4</Text>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Receive Analysis</Text>
                                <Text style={styles.infoText}>Get your professional video analysis</Text>
                            </View>
                        </View>
                    </View>
                </>
            ) : (
                <View style={styles.postPurchaseContainer}>
                    <View style={styles.successHeader}>
                        <FontAwesome5 name="check-circle" size={50} color={COLORS.success} style={styles.successIcon} />
                        <Text style={styles.successTitle}>Analysis Purchased!</Text>
                        <Text style={styles.successSubtitle}>Please upload your video and start chatting with Sergio</Text>
                    </View>

                    <View style={styles.videoUpload}>
                        <Text style={styles.sectionTitle}>Upload Your Video</Text>

                        {isFileSelected ? (
                            <View style={styles.selectedFileContainer}>
                                <View style={styles.selectedFileInfo}>
                                    <FontAwesome5 name="file-video" size={24} color={COLORS.primary} style={styles.fileIcon} />
                                    <View style={styles.fileDetails}>
                                        <Text style={styles.fileName} numberOfLines={1}>{selectedFileName}</Text>
                                        <Text style={styles.fileStatus}>Ready to submit</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.changeButton}
                                    onPress={() => setIsFileSelected(false)}
                                >
                                    <Text style={styles.changeButtonText}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.uploadContainer}>
                                <Image
                                    source={require("@/assets/images/video.png")}
                                    style={styles.uploadImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.uploadInstructions}>
                                    Select a video from your device. For best results, ensure your full body is visible and the video is shot from a good angle.
                                </Text>
                                <FileInput handleSetIsSelected={handleSetIsSelected} />
                            </View>
                        )}

                        {isFileSelected && (
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmitVideo}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Video</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.chatSection}>
                        <Text style={styles.sectionTitle}>Contact Sergio</Text>
                        <Text style={styles.chatInstructions}>
                            Chat with Sergio about your tennis technique and specific areas you want feedback on.
                        </Text>
                        <ChatWithSergio />
                    </View>
                </View>
            )}

            {/* Payment Modal */}
            <Modal
                visible={showPaymentModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Complete Purchase</Text>
                            {!processing && (
                                <TouchableOpacity
                                    onPress={() => setShowPaymentModal(false)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <FontAwesome5 name="times" size={20} color={COLORS.grey} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.orderSummary}>
                                <Text style={styles.orderTitle}>Order Summary</Text>
                                <View style={styles.orderItem}>
                                    <Text style={styles.orderItemName}>Tennis Video Analysis</Text>
                                    <Text style={styles.orderItemPrice}>€10.00</Text>
                                </View>
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalText}>Total</Text>
                                    <Text style={styles.totalPrice}>€10.00</Text>
                                </View>
                            </View>

                            <View style={styles.paymentForm}>
                                <Text style={styles.formTitle}>Payment Details</Text>

                                <Text style={styles.inputLabel}>Card Number</Text>
                                <View style={styles.cardNumberContainer}>
                                    <FontAwesome5 name="credit-card" size={18} color={COLORS.grey} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={cardNumber}
                                        onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                                        placeholder="1234 5678 9012 3456"
                                        keyboardType="numeric"
                                        maxLength={19}
                                    />
                                </View>

                                <Text style={styles.inputLabel}>Cardholder Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={cardHolder}
                                    onChangeText={setCardHolder}
                                    placeholder="John Doe"
                                />

                                <View style={styles.expiryRow}>
                                    <View style={styles.expiryContainer}>
                                        <Text style={styles.inputLabel}>Expiry Date</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={expiryDate}
                                            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                                            placeholder="MM/YY"
                                            keyboardType="numeric"
                                            maxLength={5}
                                        />
                                    </View>

                                    <View style={styles.cvvContainer}>
                                        <Text style={styles.inputLabel}>CVV</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={cvv}
                                            onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                                            placeholder="123"
                                            keyboardType="numeric"
                                            maxLength={3}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                <Text style={styles.securityNote}>
                                    <FontAwesome5 name="lock" size={12} color={COLORS.grey} /> Your payment information is secure and encrypted
                                </Text>
                            </View>
                        </ScrollView>

                        <View style={styles.modalActions}>
                            {processing ? (
                                <View style={styles.processingContainer}>
                                    <ActivityIndicator size="small" color={COLORS.primary} />
                                    <Text style={styles.processingText}>Processing payment...</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.payButton}
                                    onPress={handleProcessPayment}
                                >
                                    <Text style={styles.payButtonText}>Pay €10.00</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SIZES.spacing_lg,
    },
    pricingCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius_md,
        padding: SIZES.spacing_lg,
        ...SHADOWS.medium,
        marginBottom: SIZES.spacing_lg,
    },
    pricingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.spacing_md,
    },
    pricingTitle: {
        ...FONTS.h3,
        color: COLORS.primary,
        flex: 1,
    },
    price: {
        ...FONTS.h1,
        color: COLORS.primary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SIZES.spacing_md,
    },
    features: {
        marginBottom: SIZES.spacing_lg,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.spacing_sm,
    },
    featureIcon: {
        marginRight: SIZES.spacing_md,
    },
    featureText: {
        ...FONTS.body1,
    },
    buyButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.spacing_lg,
        borderRadius: SIZES.radius_sm,
        alignItems: 'center',
        ...SHADOWS.small,
    },
    buyButtonText: {
        ...FONTS.h3,
        color: COLORS.white,
    },
    infoSection: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius_md,
        padding: SIZES.spacing_lg,
        ...SHADOWS.small,
    },
    infoHeader: {
        ...FONTS.h3,
        marginBottom: SIZES.spacing_md,
        textAlign: 'center',
        color: COLORS.dark,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: SIZES.spacing_md,
    },
    infoStep: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.spacing_md,
    },
    infoStepNumber: {
        ...FONTS.h4,
        color: COLORS.white,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        ...FONTS.h4,
        marginBottom: 2,
    },
    infoText: {
        ...FONTS.body2,
        color: COLORS.grey,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        width: '90%',
        maxHeight: '90%',
        borderRadius: SIZES.radius_md,
        ...SHADOWS.medium,
        padding: SIZES.spacing_lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.spacing_lg,
    },
    modalTitle: {
        ...FONTS.h3,
        color: COLORS.primary,
    },
    orderSummary: {
        backgroundColor: COLORS.lightGrey,
        borderRadius: SIZES.radius_sm,
        padding: SIZES.spacing_md,
        marginBottom: SIZES.spacing_lg,
    },
    orderTitle: {
        ...FONTS.h4,
        marginBottom: SIZES.spacing_md,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.spacing_sm,
    },
    orderItemName: {
        ...FONTS.body2,
    },
    orderItemPrice: {
        ...FONTS.body2,
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SIZES.spacing_sm,
        marginTop: SIZES.spacing_sm,
    },
    totalText: {
        ...FONTS.h4,
    },
    totalPrice: {
        ...FONTS.h4,
        color: COLORS.primary,
    },
    paymentForm: {
        marginBottom: SIZES.spacing_lg,
    },
    formTitle: {
        ...FONTS.h4,
        marginBottom: SIZES.spacing_md,
    },
    inputLabel: {
        ...FONTS.body2,
        marginBottom: SIZES.spacing_xs,
    },
    cardNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius_sm,
        marginBottom: SIZES.spacing_md,
        paddingHorizontal: SIZES.spacing_md,
    },
    inputIcon: {
        marginRight: SIZES.spacing_sm,
    },
    input: {
        flex: 1,
        paddingVertical: SIZES.spacing_md,
        ...FONTS.body1,
    },
    expiryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.spacing_md,
    },
    expiryContainer: {
        flex: 1,
        marginRight: SIZES.spacing_md,
    },
    cvvContainer: {
        width: '30%',
    },
    securityNote: {
        ...FONTS.caption,
        color: COLORS.grey,
        textAlign: 'center',
    },
    modalActions: {
        marginTop: SIZES.spacing_md,
    },
    payButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.spacing_md,
        borderRadius: SIZES.radius_sm,
        alignItems: 'center',
    },
    payButtonText: {
        ...FONTS.button,
        color: COLORS.white,
    },
    processingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.spacing_md,
    },
    processingText: {
        ...FONTS.body1,
        color: COLORS.primary,
        marginLeft: SIZES.spacing_md,
    },
    postPurchaseContainer: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius_md,
        padding: SIZES.spacing_lg,
        ...SHADOWS.medium,
    },
    successHeader: {
        alignItems: 'center',
        marginBottom: SIZES.spacing_xl,
    },
    successIcon: {
        marginBottom: SIZES.spacing_md,
    },
    successTitle: {
        ...FONTS.h2,
        color: COLORS.success,
        marginBottom: SIZES.spacing_sm,
    },
    successSubtitle: {
        ...FONTS.body1,
        color: COLORS.grey,
        textAlign: 'center',
    },
    videoUpload: {
        marginBottom: SIZES.spacing_xl,
    },
    sectionTitle: {
        ...FONTS.h3,
        marginBottom: SIZES.spacing_md,
    },
    uploadContainer: {
        alignItems: 'center',
        backgroundColor: COLORS.lightGrey,
        borderRadius: SIZES.radius_md,
        padding: SIZES.spacing_lg,
        marginBottom: SIZES.spacing_md,
    },
    uploadImage: {
        width: 100,
        height: 100,
        marginBottom: SIZES.spacing_md,
    },
    uploadInstructions: {
        ...FONTS.body2,
        color: COLORS.grey,
        textAlign: 'center',
        marginBottom: SIZES.spacing_lg,
    },
    selectedFileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGrey,
        borderRadius: SIZES.radius_md,
        padding: SIZES.spacing_md,
        marginBottom: SIZES.spacing_md,
    },
    selectedFileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    fileIcon: {
        marginRight: SIZES.spacing_md,
    },
    fileDetails: {
        flex: 1,
    },
    fileName: {
        ...FONTS.body1,
        fontWeight: 'bold',
    },
    fileStatus: {
        ...FONTS.body2,
        color: COLORS.success,
    },
    changeButton: {
        backgroundColor: COLORS.white,
        paddingVertical: SIZES.spacing_xs,
        paddingHorizontal: SIZES.spacing_md,
        borderRadius: SIZES.radius_sm,
        ...SHADOWS.small,
    },
    changeButtonText: {
        ...FONTS.button,
        color: COLORS.primary,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.spacing_md,
        borderRadius: SIZES.radius_sm,
        alignItems: 'center',
        ...SHADOWS.small,
    },
    submitButtonText: {
        ...FONTS.button,
        color: COLORS.white,
    },
    chatSection: {
        marginBottom: SIZES.spacing_md,
    },
    chatInstructions: {
        ...FONTS.body2,
        color: COLORS.grey,
        marginBottom: SIZES.spacing_md,
    }
});