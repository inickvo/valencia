// services/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, deleteDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace with your actual Firebase config if needed
const firebaseConfig = {
  apiKey: "AIzaSyDamtxhHfAaoOREPbtZJjlqiftJ3qu9VGs",
  authDomain: "tennis-analysis-app.firebaseapp.com",
  projectId: "tennis-analysis-app",
  storageBucket: "tennis-analysis-app.firebasestorage.app",
  messagingSenderId: "1007373973627",
  appId: "1:1007373973627:web:3754bfb600175db577cade",
  measurementId: "G-NCV2MXM1JT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, "users"), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: "user", // default role
      createdAt: new Date()
    });
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get user details including role
export const getUserData = async (uid) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Video management functions
export const addVideo = async (videoData) => {
  try {
    // Make sure isPublic is explicitly set to true
    const data = {
      ...videoData,
      isPublic: true,
      createdAt: new Date()
    };
    
    console.log("Adding video with data:", data);
    const docRef = await addDoc(collection(db, "videos"), data);
    console.log("Video added with ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding video:", error);
    throw error;
  }
};

export const getVideos = async (userId = null) => {
  try {
    let videosQuery;
    if (userId) {
      videosQuery = query(collection(db, "videos"), where("userId", "==", userId));
    } else {
      videosQuery = collection(db, "videos");
    }
    
    const querySnapshot = await getDocs(videosQuery);
    const videos = [];
    querySnapshot.forEach((doc) => {
      videos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Retrieved ${videos.length} videos${userId ? ' for user' : ''}`);
    return videos;
  } catch (error) {
    console.error("Error getting videos:", error);
    return [];
  }
};

// Function to delete videos
export const deleteVideo = async (videoId) => {
  try {
    console.log("Deleting video with ID:", videoId);
    const videoRef = doc(db, "videos", videoId);
    await deleteDoc(videoRef);
    console.log("Video successfully deleted");
    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

// Payment records
export const addPayment = async (paymentData) => {
  try {
    return await addDoc(collection(db, "payments"), {
      ...paymentData,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};

export { auth, db };