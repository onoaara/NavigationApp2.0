import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notificationAnim] = useState(new Animated.Value(-100));
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    Animated.timing(notificationAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(notificationAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() =>
        setNotification({ message: "", type: "", visible: false })
      );
    }, 3000);
  };

  const handleLogin = async () => {
    let hasError = false;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long");
      hasError = true;
    }

    if (hasError) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification("Logged in successfully!", "success");
      setTimeout(() => navigation.replace("Main"), 1000);
    } catch (error) {
      // console.error("Error logging in: ", error);
      showNotification(error.message, "error");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleResetPassword = async () => {
    if (!email) {
      showNotification("Please enter your email address", "error");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showNotification("Password reset email sent!", "success");
    } catch (error) {
      // console.error("Error sending password reset email: ", error);
      showNotification(error.message, "error");
    }
  };

  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={["#CFF393", "#019839"]} style={styles.background}>
        {notification.visible && (
          <Animated.View
            style={[
              styles.notification,
              {
                transform: [{ translateY: notificationAnim }],
                backgroundColor:
                  notification.type === "success" ? "#10B981" : "#EF4444",
              },
            ]}
          >
            <Text style={styles.notificationText}>{notification.message}</Text>
          </Animated.View>
        )}
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          <View style={styles.input_error_container}>
            <View style={styles.inputContainer}>
              <Icon name="person" type="ionicon" color="#003D94" size={24} />
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View>
            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed"
                type="ionicon"
                color="#003D94"
                size={24}
              />
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  type="ionicon"
                  color="#003D94"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <LinearGradient
              colors={["#4B5EFC", "#003D94"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
          >
            <Text style={styles.resetButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.linkText}>
              Don't have an account?{" "}
              <Text style={styles.linkHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: height,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  subtitle: {
    fontSize: 16,
    color: "#D1D5DB",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    marginBottom: 1,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 0.5,
    borderRadius: 5,
  },
  errorText: {
    color: "#dd0000ff",
    fontSize: 12,
    // marginBottom: 15,
    marginLeft: 16,
    width: width * 0.9,
  },
  button: {
    marginVertical: 30,
    width: width * 0.9,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  resetButton: {
    marginVertical: 16,
  },
  resetButtonText: {
    color: "#D1D5DB",
    fontSize: 16,
    fontWeight: "500",
  },
  linkText: {
    color: "#D1D5DB",
    fontSize: 16,
    fontWeight: "500",
  },
  linkHighlight: {
    color: "#003D94",
    fontWeight: "600",
  },
  notification: {
    position: "absolute",
    top: 0,
    width: width,
    height: 80,
    padding: 16,
    zIndex: 1000,
    justifyContent: "flex-end",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  input_error_container: {
    marginBottom: 15,
  },
});
