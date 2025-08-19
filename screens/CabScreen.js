// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/firebase";
// import SearchBar from "../components/SearchBar";

// const { width, height } = Dimensions.get("window");

// const CabScreen = () => {
//   const [cabs, setCabs] = useState([]);
//   const [filteredCabs, setFilteredCabs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigation = useNavigation();

//   const fetchCabsData = async () => {
//     try {
//       const cabsCollection = collection(db, "cabs");
//       const cabsSnapshot = await getDocs(cabsCollection);
//       const cabsList = cabsSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setCabs(cabsList);
//       setFilteredCabs(cabsList); // Initialize filtered cabs
//     } catch (error) {
//       console.error("Error fetching cabs data: ", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCabsData();
//   }, []);

//   useEffect(() => {
//     const filteredData = cabs.filter((cab) =>
//       cab.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredCabs(filteredData);
//   }, [searchQuery, cabs]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchCabsData().then(() => setRefreshing(false));
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() =>
//         navigation.navigate("CabDetails", {
//           name: item.name,
//           phoneNumber: item.phoneNumber,
//           carModel: item.carModel,
//           plateNumber: item.plateNumber,
//           image: item.image,
//         })
//       }
//       style={styles.card}
//     >
//       <Image source={{ uri: item.image }} style={styles.image} />
//       <View style={styles.cardContent}>
//         <Text style={styles.name}>{item.name}</Text>
//         <Text style={styles.details}>Phone: {item.phoneNumber}</Text>
//         <Text style={styles.details}>Car Model: {item.carModel}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <SearchBar placeholder="Search..." onChangeText={setSearchQuery} />
//       {loading ? (
//         <ActivityIndicator size="small" color="#4361ee" />
//       ) : (
//         <FlatList
//           data={filteredCabs}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContainer}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//         />
//       )}
//     </View>
//   );
// };

// export default CabScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: width * 0.05,
//   },
//   listContainer: {
//     paddingBottom: height * 0.05,
//     paddingHorizontal: width * 0.013,
//   },
//   image: {
//     width: width * 0.17,
//     height: height * 0.08,
//     borderRadius: 10,
//     marginRight: width * 0.04,
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f9f9f9",
//     borderRadius: 12,
//     padding: width * 0.02,
//     marginTop: height * 0.02,
//     shadowColor: "#000",
//     shadowRadius: 5,
//     shadowOpacity: 0.2,
//     elevation: 5,
//   },
//   cardContent: {
//     flex: 1,
//   },
//   name: {
//     fontSize: height * 0.02,
//     fontWeight: "bold",
//     marginBottom: height * 0.003,
//   },
//   details: {
//     fontSize: height * 0.015,
//     color: "#555",
//   },
// });

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SearchBar from "../components/SearchBar";

const { width, height } = Dimensions.get("window");

const CabScreen = () => {
  const [cabs, setCabs] = useState([]);
  const [filteredCabs, setFilteredCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });
  const [notificationAnim] = useState(new Animated.Value(-80));
  const navigation = useNavigation();

  const showNotification = (message) => {
    setNotification({ message, visible: true });
    Animated.timing(notificationAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(notificationAnim, {
        toValue: -80,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setNotification({ message: "", visible: false }));
    }, 1500);
  };

  const fetchCabsData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "cabs"));
      const cabsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const validCabs = cabsList.filter((cab) => cab.image); // Filter out invalid images
      setCabs(validCabs);
      setFilteredCabs(validCabs);
    } catch (error) {
      showNotification("Failed to fetch cabs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCabsData();
  }, []);

  useEffect(() => {
    setFilteredCabs(
      cabs.filter((cab) =>
        cab.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, cabs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCabsData();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("CabDetails", {
          name: item.name,
          phoneNumber: item.phoneNumber,
          carModel: item.carModel,
          plateNumber: item.plateNumber,
          image: item.image,
        })
      }
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>Phone: {item.phoneNumber}</Text>
        <Text style={styles.details}>Car Model: {item.carModel}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
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
                backgroundColor: "#EF4444",
              },
            ]}
          >
            <Text style={styles.notificationText}>{notification.message}</Text>
          </Animated.View>
        )}
        <View style={styles.container}>
          <SearchBar placeholder="Search..." onChangeText={setSearchQuery} />
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#003D94"
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={filteredCabs}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#FFFFFF"
                />
              }
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default CabScreen;

const styles = StyleSheet.create({
  background: { flex: 1, height: height },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  listContainer: { paddingBottom: height * 0.05 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: width * 0.03,
    marginTop: height * 0.015,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: width * 0.17,
    height: height * 0.08,
    borderRadius: 10,
    marginRight: width * 0.03,
  },
  cardContent: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: height * 0.005,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  details: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  loader: { marginTop: height * 0.2 },
  notification: {
    position: "absolute",
    top: 0,
    width: width,
    height: 60,
    padding: 12,
    zIndex: 1000,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
