// components/ChatWithSergio.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Modal,
    Keyboard
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/styles';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { auth, createChat, getChats, addMessageToChat } from '../services/firebase';

const Message = ({ content, isUser, timestamp }) => {
    const date = timestamp ? new Date(timestamp.seconds * 1000) : new Date();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={[
            styles.messageContainer,
            isUser ? styles.userMessageContainer : styles.otherMessageContainer
        ]}>
            <Text style={styles.messageText}>{content}</Text>
            <Text style={styles.timeText}>{timeString}</Text>
        </View>
    );
};

const ChatWithSergio = () => {
    const [showChat, setShowChat] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [initialMessage, setInitialMessage] = useState('');
    const [showStartChatModal, setShowStartChatModal] = useState(false);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (showChat) {
            loadChats();
        }
    }, [showChat]);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const loadChats = async () => {
        if (!auth.currentUser) return;

        setLoading(true);
        try {
            const chats = await getChats(auth.currentUser.uid);
            if (chats.length > 0) {
                // Sort by most recent
                const latestChat = chats.sort((a, b) =>
                    b.updatedAt.seconds - a.updatedAt.seconds
                )[0];

                setChatId(latestChat.id);
                setMessages(latestChat.messages || []);
            }
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        if (!auth.currentUser) return;

        setLoading(true);
        try {
            if (!chatId) {
                // Create a new chat
                const chatRef = await createChat(auth.currentUser.uid, message);
                setChatId(chatRef.id);
                setMessages([{
                    sender: auth.currentUser.uid,
                    content: message,
                    timestamp: new Date()
                }]);
            } else {
                // Add message to existing chat
                await addMessageToChat(chatId, auth.currentUser.uid, message);
                setMessages([
                    ...messages,
                    {
                        sender: auth.currentUser.uid,
                        content: message,
                        timestamp: new Date()
                    }
                ]);
            }
            setMessage('');
            Keyboard.dismiss();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = () => {
        if (!initialMessage.trim()) {
            return;
        }

        // Set the first message and close the modal
        setMessage(initialMessage);
        setShowStartChatModal(false);
        setShowChat(true);

        // Send the message after a brief delay to ensure chat is loaded
        setTimeout(() => {
            handleSendMessage();
        }, 500);
    };

    const renderMessageItem = ({ item }) => {
        return (
            <Message
                content={item.content}
                isUser={item.sender === auth.currentUser?.uid}
                timestamp={item.timestamp}
            />
        );
    };

    if (!auth.currentUser) return null;

    return (
        <>
            {/* Chat button */}
            <TouchableOpacity
                style={styles.chatButton}
                onPress={() => {
                    if (chatId) {
                        setShowChat(true);
                    } else {
                        setShowStartChatModal(true);
                    }
                }}
            >
                <FontAwesome5 name="comment" size={20} color={COLORS.white} />
                <Text style={styles.chatButtonText}>Chat with Sergio</Text>
            </TouchableOpacity>

            {/* Modal for starting a new chat */}
            <Modal
                visible={showStartChatModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Start a Conversation</Text>
                            <TouchableOpacity
                                onPress={() => setShowStartChatModal(false)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <FontAwesome5 name="times" size={20} color={COLORS.grey} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalDescription}>
                            Enter your message to Sergio. You can ask about your video analysis or any tennis-related questions.
                        </Text>

                        <TextInput
                            style={styles.initialMessageInput}
                            value={initialMessage}
                            onChangeText={setInitialMessage}
                            placeholder="Write your message here..."
                            multiline
                            numberOfLines={4}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowStartChatModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.startChatButton}
                                onPress={handleStartChat}
                            >
                                <Text style={styles.startChatButtonText}>Start Chat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Chat window */}
            <Modal
                visible={showChat}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.chatOverlay}>
                    <View style={styles.chatContent}>
                        <View style={styles.chatHeader}>
                            <View style={styles.chatHeaderInfo}>
                                <FontAwesome5 name="user-circle" size={24} color={COLORS.primary} style={styles.avatarIcon} />
                                <Text style={styles.chatTitle}>Sergio</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowChat(false)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <FontAwesome5 name="times" size={20} color={COLORS.grey} />
                            </TouchableOpacity>
                        </View>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.chatBody}
                            keyboardVerticalOffset={100}
                        >
                            {loading && messages.length === 0 ? (
                                <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />
                            ) : (
                                <FlatList
                                    ref={flatListRef}
                                    data={messages}
                                    renderItem={renderMessageItem}
                                    keyExtractor={(item, index) => `msg-${index}`}
                                    contentContainerStyle={styles.messagesList}
                                    onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                                />
                            )}

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={message}
                                    onChangeText={setMessage}
                                    placeholder="Type a message..."
                                    multiline
                                />
                                <TouchableOpacity
                                    style={styles.sendButton}
                                    onPress={handleSendMessage}
                                    disabled={loading || !message.trim()}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <FontAwesome5 name="paper-plane" size={16} color={COLORS.white} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    chatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.spacing_md,
        paddingHorizontal: SIZES.spacing_lg,
        borderRadius: SIZES.radius_sm,
        justifyContent: 'center',
        marginBottom: SIZES.spacing_md,
        ...SHADOWS.small,
    },
    chatButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        marginLeft: SIZES.spacing_sm,
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
        borderRadius: SIZES.radius_md,
        ...SHADOWS.medium,
        padding: SIZES.spacing_lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.spacing_md,
    },
    modalTitle: {
        ...FONTS.h3,
        color: COLORS.primary,
    },
    modalDescription: {
        ...FONTS.body2,
        color: COLORS.grey,
        marginBottom: SIZES.spacing_md,
    },
    initialMessageInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius_sm,
        padding: SIZES.spacing_md,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: SIZES.spacing_lg,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: COLORS.lightGrey,
        paddingVertical: SIZES.spacing_md,
        paddingHorizontal: SIZES.spacing_lg,
        borderRadius: SIZES.radius_sm,
        flex: 1,
        marginRight: SIZES.spacing_sm,
        alignItems: 'center',
    },
    cancelButtonText: {
        ...FONTS.button,
        color: COLORS.dark,
    },
    startChatButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.spacing_md,
        paddingHorizontal: SIZES.spacing_lg,
        borderRadius: SIZES.radius_sm,
        flex: 1,
        marginLeft: SIZES.spacing_sm,
        alignItems: 'center',
    },
    startChatButtonText: {
        ...FONTS.button,
        color: COLORS.white,
    },
    chatOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    chatContent: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: 50,
        borderTopLeftRadius: SIZES.radius_lg,
        borderTopRightRadius: SIZES.radius_lg,
        ...SHADOWS.large,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.spacing_lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    chatHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarIcon: {
        marginRight: SIZES.spacing_md,
    },
    chatTitle: {
        ...FONTS.h3,
    },
    chatBody: {
        flex: 1,
    },
    messagesList: {
        padding: SIZES.spacing_md,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: SIZES.spacing_md,
        borderRadius: SIZES.radius_md,
        marginVertical: SIZES.spacing_sm,
        ...SHADOWS.small,
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 0,
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.lightGrey,
        borderBottomLeftRadius: 0,
    },
    messageText: {
        ...FONTS.body2,
        color: COLORS.dark,
    },
    timeText: {
        ...FONTS.caption,
        color: COLORS.grey,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: SIZES.spacing_md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius_sm,
        padding: SIZES.spacing_md,
        maxHeight: 100,
        backgroundColor: COLORS.lightGrey,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SIZES.spacing_md,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});