import React, { useState } from "react";
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
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");

const SignUpScreen = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [gender, setGender] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [matricNumberError, setMatricNumberError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [notificationAnim] = useState(new Animated.Value(-100));
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateMatricNumber = (matricNumber) => {
    return matricNumber.length >= 6;
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
        setNotification({ message: "", type: "", visible: false }),
      );
    }, 3000);
  };

  const handleSignUp = async () => {
    let hasError = false;

    // Reset errors
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneError("");
    setMatricNumberError("");
    setGenderError("");
    setTermsError("");

    // Validate inputs
    if (!fullName) {
      setFullNameError("Full name is required");
      hasError = true;
    } else if (fullName.split(" ").length < 2) {
      setFullNameError("Please enter both first and last name");
      hasError = true;
    }

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (!phone) {
      setPhoneError("Phone number is required");
      hasError = true;
    } else if (!validatePhone(phone)) {
      setPhoneError("Please enter a valid phone number");
      hasError = true;
    }

    if (!matricNumber) {
      setMatricNumberError("Matric number is required");
      hasError = true;
    } else if (!validateMatricNumber(matricNumber)) {
      setMatricNumberError("Matric number must be at least 6 characters");
      hasError = true;
    }

    if (!gender) {
      setGenderError("Please select a gender");
      hasError = true;
    }

    if (!termsAccepted) {
      setTermsError("You must accept the terms and conditions");
      hasError = true;
    }

    if (hasError) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const [firstName, ...lastNameParts] = fullName.split(" ");
      const lastName = lastNameParts.join(" ");

      await addDoc(collection(db, "userDetails"), {
        uid: user.uid,
        firstName,
        lastName,
        dob: dob.toISOString().split("T")[0],
        phone,
        matricNumber,
        gender,
        email,
        isActive: true,
      });

      showNotification("Account created successfully!", "success");
      setTimeout(() => navigation.replace("Login"), 1000);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const openGenderModal = () => {
    setModalVisible(true);
  };

  const selectGender = (selectedGender) => {
    setGender(selectedGender);
    setGenderError("");
    setModalVisible(false);
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              omitting
              backButton
              style
              to
              avoid
              absolute
              positioning
              issues
            >
              <Ionicons name="arrow-back" color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <View style={{ width: 24 }} />
          </View>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.input_error_container}>
            <View style={styles.inputContainer}>
              <Ionicons name="person" color="#003D94" size={24} />
              <TextInput
                style={[styles.input, fullNameError ? styles.inputError : null]}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setFullNameError("");
                }}
                autoCapitalize="words"
              />
            </View>
            {fullNameError ? (
              <Text style={styles.errorText}>{fullNameError}</Text>
            ) : null}
          </View>

          <View style={styles.input_error_container}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" color="#003D94" size={24} />
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

          <View style={styles.input_error_container}>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" color="#003D94" size={24} />
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
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  color="#003D94"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <View style={styles.input_error_container}>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" color="#003D94" size={24} />
              <TextInput
                style={[
                  styles.input,
                  confirmPasswordError ? styles.inputError : null,
                ]}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError("");
                }}
                secureTextEntry={!confirmPasswordVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                <Ionicons
                  name={
                    confirmPasswordVisible ? "eye-off-outline" : "eye-outline"
                  }
                  color="#003D94"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          <View style={styles.input_error_container}>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" color="#003D94" size={24} />
              <Text
                style={[styles.input, { color: dob ? "#1F2937" : "#9CA3AF" }]}
              >
                {dob
                  ? dob.toISOString().split("T")[0]
                  : "Date of Birth (YYYY-MM-DD)"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDob(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.input_error_container}>
            <View style={styles.inputContainer}>
              <Ionicons name="call" color="#003D94" size={24} />
              <TextInput
                style={[styles.input, phoneError ? styles.inputError : null]}
                placeholder="Phone"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setPhoneError("");
                }}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            </View>
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}
          </View>

          <View style={styles.input_error_container}>
            <View style={styles.inputContainer}>
              <Ionicons name="card" color="#003D94" size={24} />
              <TextInput
                style={[
                  styles.input,
                  matricNumberError ? styles.inputError : null,
                ]}
                placeholder="Matric Number"
                placeholderTextColor="#9CA3AF"
                value={matricNumber}
                onChangeText={(text) => {
                  setMatricNumber(text);
                  setMatricNumberError("");
                }}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>
            {matricNumberError ? (
              <Text style={styles.errorText}>{matricNumberError}</Text>
            ) : null}
          </View>

          <View style={styles.input_error_container}>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                genderError ? styles.inputError : null,
              ]}
              onPress={openGenderModal}
            >
              <Ionicons name="male-female" color="#003D94" size={24} />
              <Text
                style={[
                  styles.input,
                  { color: gender ? "#1F2937" : "#9CA3AF" },
                ]}
              >
                {gender || "Select Gender"}
              </Text>
            </TouchableOpacity>
            {genderError ? (
              <Text style={styles.errorText}>{genderError}</Text>
            ) : null}
          </View>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => selectGender("M")}>
                  <Text style={styles.modalText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectGender("F")}>
                  <Text style={styles.modalText}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => {
                setTermsAccepted(!termsAccepted);
                setTermsError("");
              }}
            >
              <Ionicons
                name={termsAccepted ? "checkbox-outline" : "square-outline"}
                color="#FFFFFF"
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I agree to all the{" "}
              <Text style={styles.linkHighlight}>Terms & Conditions</Text>
            </Text>
          </View>
          {termsError ? (
            <Text style={styles.errorText}>{termsError}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <LinearGradient
              colors={["#4B5EFC", "#003D94"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.linkHighlight}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default SignUpScreen;

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
  header: {
    width: width * 0.9,
    // marginBottom: 32,
    marginTop: height * 0.03,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
    color: "#D1D5DB",
    fontSize: 16,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalText: {
    fontSize: 18,
    color: "#1F2937",
    marginVertical: 10,
    fontWeight: "500",
  },
  modalCancel: {
    fontSize: 18,
    color: "#EF4444",
    marginVertical: 10,
    fontWeight: "500",
  },
});
