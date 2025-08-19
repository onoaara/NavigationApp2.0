import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const DestinationScreen = ({ route }) => {
  const { origin, destination, routeCoords } = route.params;
  const navigation = useNavigation();

  const handleConfirmRide = () => {
    Alert.alert("Ride Confirmed", "Your ride has been requested successfully!");
    navigation.navigate("Main");
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (origin.latitude + destination.latitude) / 2,
          longitude: (origin.longitude + destination.longitude) / 2,
          latitudeDelta: Math.abs(origin.latitude - destination.latitude) + 0.1,
          longitudeDelta:
            Math.abs(origin.longitude - destination.longitude) + 0.1,
        }}
      >
        <Marker coordinate={origin} title="Your Location" />
        <Marker coordinate={destination} title="Destination" />
        <Polyline
          coordinates={routeCoords}
          strokeWidth={5}
          strokeColor="blue"
        />
      </MapView>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>
          Origin: {`${origin.latitude}, ${origin.longitude}`}
        </Text>
        <Text style={styles.detailsText}>
          Destination: {`${destination.latitude}, ${destination.longitude}`}
        </Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmRide}
        >
          <Text style={styles.confirmButtonText}>Confirm Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DestinationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  map: {
    width: width,
    height: height * 0.7,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#4361ee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
