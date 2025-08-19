import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { auth, db } from "../firebase/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const EditProfile = ({ route }) => {
  const navigation = useNavigation();
  const { userData } = route.params;
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [imageUrl, setImageUrl] = useState(userData.imageUrl || null);

  const getInitials = () => {
    const { firstName, lastName } = userData;
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "";
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.uri);
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "userDetails"),
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const userDocRef = doc.ref;

            const updateData = {
              firstName,
              lastName,
            };
            if (imageUrl) {
              updateData.imageUrl = imageUrl;
            }

            await updateDoc(userDocRef, updateData);
            Alert.alert(
              "Profile Updated",
              "Your profile has been updated successfully."
            );
          });
        } else {
          console.log("No such document!");
          Alert.alert("Error", "No such document exists.");
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
      Alert.alert("Error", "There was an error updating your profile.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.initialsContainer}>
        <Text style={styles.initialsText}>{getInitials()}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TouchableOpacity style={styles.save_btn} onPress={handleSave}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.1,
    backgroundColor: "#fff",
  },
  image: {
    height: height * 0.2,
    width: height * 0.2,
    backgroundColor: "#069732",
    borderRadius: 12,
    marginBottom: height * 0.03,
  },
  input: {
    width: width * 0.8,
    height: height * 0.06,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
  },
  save_btn: {
    marginTop: height * 0.03,
    paddingHorizontal: width * 0.07,
    paddingVertical: height * 0.02,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4361ee",
    // backgroundColor: "#4361ee",
  },
  btnText: {
    fontSize: height * 0.017,
    fontWeight: "600",
    // color: "#fff",
  },
  initialsContainer: {
    height: height * 0.2,
    width: height * 0.2,
    backgroundColor: "#4361ee",
    borderRadius: height * 0.1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  initialsText: {
    color: "#ffffff",
    fontSize: height * 0.08,
    fontWeight: "700",
  },
});
