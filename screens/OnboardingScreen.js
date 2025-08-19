import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Image } from "@rneui/base";

const img = "../assets/logo.png";

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.continer}>
      <View style={styles.welcome}>
        <Image
          source={require(img)}
          style={styles.item}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>
      <View style={styles.next}>
        <TouchableOpacity
          onPress={() => navigation.replace("Login")}
          style={styles.touch}
        >
          <Text style={styles.smallText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  welcome: {
    marginTop: 50,
    flex: 0.85,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  next: {
    flex: 0.15,
    backgroundColor: "#fff",
  },
  touch: {
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  text: {
    fontSize: 48,
    fontWeight: "800",
    color: "white",
  },
  smallText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003D94",
    paddingRight: 20,
  },
  item: {
    // aspectRatio: 1,
    width: 200,
    height: 200,
  },
});
