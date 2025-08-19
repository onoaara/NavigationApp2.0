// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   Animated,
//   Platform,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/firebase";
// import { Icon } from "@rneui/base";
// import { LinearGradient } from "expo-linear-gradient";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// import SearchBar from "../components/SearchBar";
// import Events from "../components/Events";
// import WeatherBar from "../components/WeatherBar";

// const { width, height } = Dimensions.get("window");

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const [popularPlaces, setPopularPlaces] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [notification, setNotification] = useState({
//     message: "",
//     type: "",
//     visible: false,
//   });
//   const [notificationAnim] = useState(new Animated.Value(-100));

//   const showNotification = (message, type) => {
//     setNotification({ message, type, visible: true });
//     Animated.timing(notificationAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();

//     setTimeout(() => {
//       Animated.timing(notificationAnim, {
//         toValue: -100,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() =>
//         setNotification({ message: "", type: "", visible: false })
//       );
//     }, 3000);
//   };

//   const fetchPopularPlacesData = async () => {
//     try {
//       const popularPlacesCollection = collection(db, "popularPlaces");
//       const popularPlacesSnapshot = await getDocs(popularPlacesCollection);
//       const popularPlacesList = popularPlacesSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setPopularPlaces(popularPlacesList);
//     } catch (error) {
//       showNotification("Failed to fetch popular places", "error");
//     }
//   };

//   useEffect(() => {
//     fetchPopularPlacesData();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchPopularPlacesData().then(() => setRefreshing(false));
//   };

//   return (
//     <View
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={{ flex: 1 }}
//     >
//       <LinearGradient colors={["#CFF393", "#019839"]} style={styles.background}>
//         {notification.visible && (
//           <Animated.View
//             style={[
//               styles.notification,
//               {
//                 transform: [{ translateY: notificationAnim }],
//                 backgroundColor:
//                   notification.type === "success" ? "#10B981" : "#EF4444",
//               },
//             ]}
//           >
//             <Text style={styles.notificationText}>{notification.message}</Text>
//           </Animated.View>
//         )}
//         <ScrollView
//           contentContainerStyle={styles.scrollContainer}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor="#FFFFFF"
//             />
//           }
//         >
//           {/* <SearchBar /> */}
//           <View style={{ height: height * 0.05 }} />
//           <WeatherBar />
//           <View style={styles.popular_places}>
//             <View style={styles.ppp}>
//               <Text style={styles.ppp_text}>Popular Places</Text>
//               <Icon
//                 type="ionicon"
//                 name="arrow-forward-outline"
//                 size={24}
//                 color="#FFFFFF"
//               />
//             </View>
//             <View>
//               <FlatList
//                 style={styles.flatList}
//                 showsHorizontalScrollIndicator={false}
//                 data={popularPlaces}
//                 horizontal={true}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.pp_img}
//                     onPress={() =>
//                       navigation.navigate("PopularPlaces", {
//                         image: item.image,
//                         name: item.name,
//                         activities: item.activities,
//                       })
//                     }
//                   >
//                     <Image source={{ uri: item.image }} style={styles.image} />
//                     <View style={styles.overlay}>
//                       <Text style={styles.text}>{item.name}</Text>
//                       <Text style={styles.text}>
//                         {item.activities} activities
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 )}
//                 keyExtractor={(item) => item.id}
//               />
//             </View>
//           </View>
//           <Events />
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => navigation.navigate("CabScreen")}
//           >
//             <LinearGradient
//               colors={["#4B5EFC", "#003D94"]}
//               style={styles.buttonGradient}
//             >
//               <Text style={styles.buttonText}>Tap to Get a Cab</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </ScrollView>
//       </LinearGradient>
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     height: height,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     alignItems: "center",
//     padding: 24,
//   },
//   popular_places: {
//     marginTop: height * 0.02,
//     width: "100%",
//   },
//   ppp: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     // marginBottom: 12,
//   },
//   ppp_text: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#FFFFFF",
//     fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
//   },
//   button: {
//     marginVertical: 30,
//     width: width * 0.9,
//     height: 56,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   buttonGradient: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   pp_img: {
//     marginHorizontal: width * 0.02,
//   },
//   image: {
//     width: width * 0.4,
//     height: width * 0.4,
//     resizeMode: "cover",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "flex-end",
//     paddingLeft: width * 0.03,
//     paddingBottom: height * 0.01,
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     borderRadius: 12,
//   },
//   text: {
//     color: "#FFFFFF",
//     fontSize: height * 0.017,
//     fontWeight: "600",
//     textShadowColor: "rgba(0, 0, 0, 0.75)",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 6,
//   },
//   flatList: {
//     paddingTop: height * 0.01,
//     paddingBottom: height * 0.02,
//   },
//   notification: {
//     position: "absolute",
//     top: 0,
//     width: width,
//     height: 80,
//     padding: 16,
//     zIndex: 1000,
//     justifyContent: "flex-end",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   notificationText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "500",
//     textAlign: "center",
//   },
// });

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Icon } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import SearchBar from "../components/SearchBar";
import Events from "../components/Events";
import WeatherBar from "../components/WeatherBar";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const [notificationAnim] = useState(new Animated.Value(-100));
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const fetchPopularPlacesData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "popularPlaces"));
      setPopularPlaces(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      showNotification("Failed to fetch popular places", "error");
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPopularPlacesData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentIndex(0);
    fetchPopularPlacesData();
  };

  const scrollToNextPlace = () => {
    if (!flatListRef.current || !popularPlaces.length) return;
    const nextIndex = (currentIndex + 1) % popularPlaces.length;
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
        >
          <View style={{ height: height * 0.05 }} />
          <WeatherBar />
          <View style={styles.popular_places}>
            <View style={styles.ppp}>
              <Text style={styles.ppp_text}>Popular Places</Text>
              <TouchableOpacity onPress={scrollToNextPlace}>
                <Icon
                  type="ionicon"
                  name="arrow-forward-outline"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              ref={flatListRef}
              style={styles.flatList}
              showsHorizontalScrollIndicator={false}
              data={popularPlaces}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pp_img}
                  onPress={() =>
                    navigation.navigate("PopularPlaces", {
                      image: item.image,
                      name: item.name,
                      activities: item.activities,
                    })
                  }
                >
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.overlay}>
                    <Text style={styles.text}>{item.name}</Text>
                    <Text style={styles.text}>
                      {item.activities} activities
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          <Events />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CabScreen")}
          >
            <LinearGradient
              colors={["#4B5EFC", "#003D94"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Tap to Get a Cab</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: { flex: 1, height: height },
  scrollContainer: { flexGrow: 1, alignItems: "center", padding: 24 },
  popular_places: { marginTop: height * 0.02, width: "100%" },
  ppp: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ppp_text: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  button: {
    marginVertical: 30,
    width: width * 0.9,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
  pp_img: { marginHorizontal: width * 0.02 },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "cover",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingLeft: width * 0.03,
    paddingBottom: height * 0.01,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
  },
  text: {
    color: "#FFFFFF",
    fontSize: height * 0.017,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  flatList: { paddingTop: height * 0.01, paddingBottom: height * 0.02 },
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
});
