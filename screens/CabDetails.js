// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   Dimensions,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import React from "react";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { Icon } from "@rneui/base";
// import * as Clipboard from "expo-clipboard";

// const { width, height } = Dimensions.get("window");

// const CabDetails = () => {
//   const route = useRoute();
//   const navigation = useNavigation();

//   const { name, image, plateNumber, carModel, phoneNumber } = route.params;

//   const copyToClipboard = () => {
//     Clipboard.setString(phoneNumber);
//     Alert.alert(
//       "Copied to Clipboard",
//       "Phone number has been copied to clipboard."
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.closeButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Icon type="ionicon" name="close" size={height * 0.03} color="red" />
//       </TouchableOpacity>
//       <Image source={{ uri: image }} style={styles.image} />
//       <View style={styles.detailsContainer}>
//         <Text style={styles.name}>{name}</Text>
//         <View style={styles.phoneContainer}>
//           <Text style={styles.detail}>Phone: {phoneNumber}</Text>
//           <TouchableOpacity onPress={copyToClipboard}>
//             <Icon
//               type="ionicon"
//               name="copy"
//               size={height * 0.02}
//               color="#4361ee"
//               style={{ paddingLeft: 10 }}
//             />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.detail}>Car Model: {carModel}</Text>
//         <Text style={styles.detail}>Plate Number: {plateNumber}</Text>
//       </View>
//     </View>
//   );
// };

// export default CabDetails;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: width * 0.05,
//   },
//   image: {
//     width: "70%",
//     height: height * 0.4,
//     borderRadius: 12,
//     marginBottom: height * 0.03,
//   },
//   detailsContainer: {
//     width: "100%",
//     alignItems: "center",
//   },
//   name: {
//     fontSize: height * 0.03,
//     fontWeight: "bold",
//     marginBottom: height * 0.02,
//   },
//   phoneContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: height * 0.01,
//   },
//   detail: {
//     fontSize: height * 0.02,
//     color: "#555",
//   },
//   closeButton: {
//     position: "absolute",
//     top: height * 0.05,
//     right: width * 0.05,
//     zIndex: 1,
//   },
// });

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Clipboard from "expo-clipboard";

const { width, height } = Dimensions.get("window");

const CabDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { name, image, plateNumber, carModel, phoneNumber } = route.params;
  const [notification, setNotification] = React.useState({
    message: "",
    visible: false,
  });
  const [notificationAnim] = React.useState(new Animated.Value(-80));

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

  const copyToClipboard = () => {
    Clipboard.setString(phoneNumber);
    showNotification("Phone number copied to clipboard");
  };

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
                backgroundColor: "#10B981",
              },
            ]}
          >
            <Text style={styles.notificationText}>{notification.message}</Text>
          </Animated.View>
        )}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon type="ionicon" name="close" size={24} color="#EF4444" />
          </TouchableOpacity>
          <View style={styles.card}>
            <Image
              source={{ uri: image || "https://via.placeholder.com/150" }}
              style={styles.image}
            />
            <View style={styles.detailsContainer}>
              <Text style={styles.name}>{name}</Text>
              <View style={styles.phoneContainer}>
                <Text style={styles.detail}>Phone: {phoneNumber}</Text>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Icon
                    type="ionicon"
                    name="copy"
                    size={20}
                    color="#003D94"
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.detail}>Car Model: {carModel}</Text>
              <Text style={styles.detail}>Plate Number: {plateNumber}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default CabDetails;

const styles = StyleSheet.create({
  background: { flex: 1, height: height },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: width * 0.04,
    marginTop: height * 0.07,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: width * 0.7,
    height: height * 0.3,
    borderRadius: 12,
    marginBottom: height * 0.02,
  },
  detailsContainer: { width: "100%", alignItems: "center" },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: height * 0.015,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  detail: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: height * 0.005,
  },
  closeButton: {
    position: "absolute",
    top: height * 0.05,
    right: width * 0.05,
    zIndex: 1,
  },
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
