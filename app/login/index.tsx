// app/login/index.tsx

import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  ScrollView,
  Alert
} from "react-native";
import { Link, router } from "expo-router";
import { COLORS, FONTS, SIZES, SHADOWS, CONTAINER_STYLES } from "@/constants/styles";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { loginUser } from "../../services/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateInputs = () => {
    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      router.replace("/");
    } catch (error) {
      let message = "Failed to login";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        message = "Invalid email or password";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format";
      }
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image 
                source={require("@/assets/images/logo.png")} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>Tennis Analysis</Text>
              <Text style={styles.tagline}>Improve your game with professional feedback</Text>
            </View>

            <Card style={styles.formCard}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>

              <View style={styles.form}>
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="envelope"
                  iconPosition="left"
                  error={emailError}
                  required
                />

                <Input
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                  }}
                  secureTextEntry
                  icon="lock"
                  iconPosition="left"
                  error={passwordError}
                  required
                />

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  loading={loading}
                  fullWidth
                  size="large"
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  title="Continue with Google"
                  type="outline"
                  icon="google"
                  fullWidth
                  onPress={() => Alert.alert("Google Sign In", "This feature is not implemented yet")}
                />
              </View>
            </Card>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: SIZES.spacing_lg,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SIZES.spacing_xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SIZES.spacing_sm,
  },
  appName: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SIZES.spacing_xs,
  },
  tagline: {
    ...FONTS.body1,
    color: COLORS.grey,
    textAlign: "center",
  },
  formCard: {
    marginBottom: SIZES.spacing_lg,
  },
  title: {
    ...FONTS.h2,
    marginBottom: SIZES.spacing_xs,
    textAlign: "center",
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.grey,
    marginBottom: SIZES.spacing_xl,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: SIZES.spacing_lg,
  },
  forgotPasswordText: {
    ...FONTS.body2,
    color: COLORS.primary,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SIZES.spacing_lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    ...FONTS.body2,
    color: COLORS.grey,
    marginHorizontal: SIZES.spacing_md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    ...FONTS.body1,
    color: COLORS.grey,
  },
  registerLink: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});