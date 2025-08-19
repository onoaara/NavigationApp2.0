import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage, db } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const PhotoGallery = () => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access media library is required!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setPhoto({ uri });
    }
  };

  const handleUploadPhoto = async () => {
    if (!photo) {
      Alert.alert("No photo selected", "Please choose a photo to upload.");
      return;
    }

    const { uri } = photo;
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, filename);

    try {
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "photos"), {
        url,
        description,
        createdAt: serverTimestamp(),
      });

      setPhoto(null);
      setDescription("");
      Alert.alert(
        "Photo uploaded!",
        "Your photo has been uploaded to Firebase."
      );
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Upload failed",
        "There was an error while uploading the photo."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Photos</Text>
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>
      {photo && (
        <>
          <View style={styles.photoContainer}>
            <Image source={photo} style={styles.photoPreview} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.button} onPress={handleUploadPhoto}>
            <Text style={styles.buttonText}>Upload Photo</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PhotoGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4361ee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  photoContainer: {
    width: width * 0.8,
    height: height * 0.4,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: width * 0.8,
  },
});
