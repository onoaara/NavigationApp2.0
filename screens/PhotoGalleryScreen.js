import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Icon } from "@rneui/base";
import SearchBar from "../components/SearchBar";
import { db, storage } from "../firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

const PhotoGalleryScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchPhotos = async () => {
    const photoList = [];
    const querySnapshot = await getDocs(collection(db, "photos"));
    querySnapshot.forEach((doc) => {
      photoList.push({ id: doc.id, ...doc.data() });
    });
    setPhotos(photoList);
    setFilteredPhotos(photoList);
    icach;
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    const filteredData = photos.filter((photo) =>
      photo.description
        ? photo.description.toLowerCase().includes(searchQuery.toLowerCase())
        : false
    );
    setFilteredPhotos(filteredData);
  }, [searchQuery, photos]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPhotos().then(() => setRefreshing(false));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image || !description) {
      Alert.alert("Error", "Please select an image and enter a description.");
      return;
    }

    const response = await fetch(image);
    const blob = await response.blob();
    const filename = image.substring(image.lastIndexOf("/") + 1);
    const storageRef = ref(storage, `photos/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "photos"), {
        url,
        description,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Photo uploaded successfully!");
      setImage(null);
      setDescription("");
      fetchPhotos();
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload photo.");
    }
  };

  const cancelUpload = () => {
    setImage(null);
    setDescription("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.search_filter}>
          <SearchBar placeholder="Search..." onChangeText={setSearchQuery} />
        </View>
        <FlatList
          data={filteredPhotos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.photoContainer}>
              <Image source={{ uri: item.url }} style={styles.photo} />
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Icon name="add" type="ionicon" color="#fff" size={30} />
        </TouchableOpacity>
        {image && (
          <View style={styles.uploadContainer}>
            <ScrollView>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={uploadImage}
              >
                <Text style={styles.uploadButtonText}>Upload Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelUpload}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default PhotoGalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  search_filter: {
    width: width * 0.9,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  photoContainer: {
    width: width * 0.45,
    height: height * 0.35,
    margin: width * 0.025,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: "#4361ee",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadContainer: {
    position: "absolute",
    bottom: 100,
    width: "70%",
    padding: 20,
    backgroundColor: "#949494ff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    alignItems: "center",
    borderRadius: 12,
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginBottom: 15,
    borderRadius: 10,
  },
  input: {
    // width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#4361ee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#c90202ff",
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
