// components/AdminVideoControls.tsx

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
    ScrollView
} from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getVideos, addVideo, deleteVideo, auth, getUserData } from '../services/firebase';

const AdminVideoControls = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [videoId, setVideoId] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        checkIfAdmin();
    }, []);

    useEffect(() => {
        if (showManageModal) {
            loadVideos();
        }
    }, [showManageModal]);

    const checkIfAdmin = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userData = await getUserData(currentUser.uid);
            setIsAdmin(userData?.role === 'admin');
        }
    };

    const loadVideos = async () => {
        setLoading(true);
        try {
            const fetchedVideos = await getVideos();
            console.log("Fetched videos for admin:", fetchedVideos);
            setVideos(fetchedVideos);
        } catch (error) {
            console.error('Error loading videos:', error);
            Alert.alert('Error', 'Failed to load videos');
        } finally {
            setLoading(false);
        }
    };

    const handleAddVideo = async () => {
        if (!title.trim() || !videoId.trim()) {
          Alert.alert('Error', 'Please enter both title and YouTube video ID');
          return;
        }
        
        // Clean the YouTube ID - remove any extra parts
        let cleanVideoId = videoId.trim();
        
        // If they pasted a full URL, extract just the ID
        if (cleanVideoId.includes('youtube.com') || cleanVideoId.includes('youtu.be')) {
          try {
            // For URLs like: https://www.youtube.com/watch?v=ABCDEFG
            if (cleanVideoId.includes('watch?v=')) {
              cleanVideoId = cleanVideoId.split('watch?v=')[1].split('&')[0];
            }
            // For URLs like: https://youtu.be/ABCDEFG
            else if (cleanVideoId.includes('youtu.be/')) {
              cleanVideoId = cleanVideoId.split('youtu.be/')[1].split('?')[0];
            }
          } catch (e) {
            Alert.alert('Error', 'Invalid YouTube URL. Please enter just the video ID');
            return;
          }
        }
      
        setSubmitting(true);
        try {
          await addVideo({
            title,
            videoId: cleanVideoId, // Use the cleaned video ID
            description: description.trim() || '',
            isPublic: true,
            addedBy: auth.currentUser.uid,
            date: new Date().toLocaleDateString(),
            time: '0:00',
            weight: '0MB',
          });
          
          setTitle('');
          setVideoId('');
          setDescription('');
          setShowAddModal(false);
          Alert.alert('Success', 'Video added successfully');
        } catch (error) {
          console.error('Error adding video:', error);
          Alert.alert('Error', 'Failed to add video');
        } finally {
          setSubmitting(false);
        }
      };
    // Make sure the handleDeleteVideo function takes the correct parameter
    const handleDeleteVideo = async (videoId) => {
        try {
        console.log("Attempting to delete video with ID:", videoId);
        await deleteVideo(videoId);
        Alert.alert('Success', 'Video deleted successfully');
        loadVideos(); // Reload the list after deletion
        } catch (error) {
        console.error('Error deleting video:', error);
        Alert.alert('Error', 'Failed to delete video: ' + error.message);
        }
    };
    
    // Make sure the delete button passes the correct ID parameter
    <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => {
        console.log("Delete button pressed for video:", video.id);
        Alert.alert(
            "Delete Video",
            `Are you sure you want to delete "${video.title}"?`,
            [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                onPress: () => {
                console.log("Confirming deletion of video:", video.id);
                handleDeleteVideo(video.id);
                }, 
                style: "destructive" 
            }
            ]
        );
        }}
    >
        <FontAwesome5 name="trash" size={18} color="#E74C3C" />
    </TouchableOpacity>

    if (!isAdmin) return null;

    return (
        <View style={styles.container}>
            <View style={styles.adminPanel}>
                <Text style={styles.adminText}>Admin Controls</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.adminButton}
                        onPress={() => setShowAddModal(true)}
                    >
                        <FontAwesome5 name="plus" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Add Video</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.adminButton, styles.manageButton]}
                        onPress={() => setShowManageModal(true)}
                    >
                        <FontAwesome5 name="cog" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Manage Videos</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Add Video Modal */}
            <Modal
                visible={showAddModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Video</Text>
                            <TouchableOpacity
                                onPress={() => setShowAddModal(false)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <FontAwesome5 name="times" size={20} color="#757575" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            <Text style={styles.inputLabel}>Video Title*</Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Enter video title"
                            />

                            <Text style={styles.inputLabel}>YouTube Video ID*</Text>
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

                            <Text style={styles.helpText}>
                                * YouTube Video ID is the part after "v=" in YouTube URL.
                                For example, in https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is "dQw4w9WgXcQ".
                            </Text>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowAddModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleAddVideo}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>Add Video</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Manage Videos Modal */}
            <Modal
                visible={showManageModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Manage Videos</Text>
                            <TouchableOpacity
                                onPress={() => setShowManageModal(false)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <FontAwesome5 name="times" size={20} color="#757575" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.videoList}>
                            {loading ? (
                                <ActivityIndicator style={styles.loader} size="large" color="#1E5F8A" />
                            ) : videos.length === 0 ? (
                                <Text style={styles.emptyText}>No videos found</Text>
                            ) : (
                                videos.map((video) => (
                                    <View key={video.id} style={styles.videoItem}>
                                        <View style={styles.videoInfo}>
                                            <Text style={styles.videoTitle}>{video.title}</Text>
                                            <Text style={styles.videoId}>ID: {video.videoId}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() =>
                                                Alert.alert(
                                                    "Delete Video",
                                                    `Are you sure you want to delete "${video.title}"?`,
                                                    [
                                                        { text: "Cancel", style: "cancel" },
                                                        { text: "Delete", onPress: () => handleDeleteVideo(video.id), style: "destructive" }
                                                    ]
                                                )
                                            }
                                        >
                                            <FontAwesome5 name="trash" size={18} color="#E74C3C" />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowManageModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    adminPanel: {
        backgroundColor: "#EEEEEE",
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#1E5F8A",
    },
    adminText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#002147",
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    adminButton: {
        backgroundColor: "#1E5F8A",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
        flex: 1,
    },
    manageButton: {
        backgroundColor: "#4DA1D8",
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        width: '90%',
        maxHeight: '80%',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E5F8A",
    },
    form: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 4,
        color: "#333333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    helpText: {
        fontSize: 12,
        color: "#757575",
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: "#EEEEEE",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333333",
    },
    submitButton: {
        backgroundColor: "#1E5F8A",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    videoList: {
        marginBottom: 20,
        maxHeight: 300,
    },
    videoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#F9F9F9",
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#4DA1D8",
    },
    videoInfo: {
        flex: 1,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333333",
    },
    videoId: {
        fontSize: 12,
        color: "#757575",
    },
    deleteButton: {
        padding: 10, // Larger touch area
        backgroundColor: '#F8F8F8', // Subtle background
        borderRadius: 8,
    },
    loader: {
        marginVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#757575",
        textAlign: 'center',
        marginVertical: 20,
    },
    closeButton: {
        backgroundColor: "#4DA1D8",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

export default AdminVideoControls;