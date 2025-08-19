import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { LinearGradient } from "expo-linear-gradient";
import SearchBar from "../components/SearchBar";

const { width, height } = Dimensions.get("window");

const Navigate = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [locations, setLocations] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });
  const [notificationAnim] = useState(new Animated.Value(-80));
  const mapRef = useRef(null);
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

  useEffect(() => {
    getCurrentLocation();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (origin && destination) {
      fitMapToCoordinates([origin, destination]);
    } else if (origin) {
      fitMapToCoordinates([origin]);
    }
  }, [origin, destination]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showNotification("Location permission denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setOrigin({ latitude, longitude });
  };

  const fetchLocations = async () => {
    try {
      const snapshot = await getDocs(collection(db, "locations"));
      setLocations(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      showNotification("Failed to fetch locations");
    }
  };

  const fetchRoute = async () => {
    if (origin && destination) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=AIzaSyBGtxL3mVOau2CTPHcZuBzgrQthui7evsE`
        );
        const json = await response.json();
        if (json.routes.length) {
          const points = decode(json.routes[0].overview_polyline.points);
          const route = points.map((point) => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }));
          setRouteCoords(route);
          fitMapToCoordinates([origin, ...route, destination]);
        } else {
          showNotification("No routes found");
        }
      } catch (error) {
        showNotification("Failed to fetch route");
      }
    } else {
      showNotification("Origin or destination missing");
    }
  };

  const decode = (t) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const handleSearch = (query) => {
    setQuery(query);
    if (query) {
      const filtered = locations.filter((location) =>
        location.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  const handleSelectLocation = (location) => {
    setQuery(location.name);
    setDestination({
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
    });
    setFilteredLocations([]);
  };

  const fitMapToCoordinates = (coordinates) => {
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 100, right: 50, bottom: 150, left: 50 },
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 6.3344,
          longitude: 7.2193,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={
          origin
            ? {
                latitude: origin.latitude,
                longitude: origin.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      >
        {origin && <Marker coordinate={origin} title="Your Location" />}
        {destination && <Marker coordinate={destination} title="Destination" />}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={6}
            strokeColor="#003D94"
          />
        )}
      </MapView>
      <View style={styles.overlayContainer}>
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
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Enter destination"
            query={query}
            onChangeText={handleSearch}
            data={filteredLocations}
            onSelect={handleSelectLocation}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={fetchRoute}>
            <LinearGradient
              colors={["#4B5EFC", "#003D94"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Route</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Navigate;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: width, height: height, position: "absolute", top: 0, left: 0 },
  overlayContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  searchContainer: {
    width: width * 0.9,
    // backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    // padding: width * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: "absolute",
    top: height * 0.045,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: height * 0.02,
    alignItems: "center",
    position: "absolute",
    bottom: height * 0.03,
  },
  button: {
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
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },
  notification: {
    width: width * 0.9,
    height: 40,
    padding: 12,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    borderRadius: 12,
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
